from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.config import CORS_ORIGINS
from app.database import Base, engine, get_db
from app.dependencies import CurrentUser, DatabaseSession
from app.models import Event, User
from app.schemas import EventCreate, EventRead, LoginRequest, TokenResponse, UserCreate, UserRead
from app.security import create_access_token, hash_password, verify_password


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="OpportunityHub API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/auth/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: DatabaseSession) -> User:
    user = User(
        full_name=payload.full_name,
        email=str(payload.email),
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists") from None
    db.refresh(user)
    return user


@app.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: DatabaseSession) -> TokenResponse:
    user = db.scalar(select(User).where(User.email == str(payload.email)))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return TokenResponse(access_token=create_access_token(user.id), user=UserRead.model_validate(user))


@app.get("/auth/me", response_model=UserRead)
def current_user(user: CurrentUser) -> User:
    return user


@app.get("/events", response_model=list[EventRead])
def list_events(db: DatabaseSession) -> list[Event]:
    return list(
        db.scalars(
            select(Event).where(Event.is_demo.is_(False)).order_by(Event.created_at.desc())
        ).all()
    )


@app.get("/events/{event_id}", response_model=EventRead)
def get_event(event_id: str, db: DatabaseSession) -> Event:
    event = db.get(Event, event_id)
    if event is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return event


@app.post("/events", response_model=EventRead, status_code=status.HTTP_201_CREATED)
def create_event(payload: EventCreate, user: CurrentUser, db: DatabaseSession) -> Event:
    event = Event(**payload.model_dump(), created_by_id=user.id, is_demo=False)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@app.get("/bookmarks", response_model=list[EventRead])
def list_bookmarks(user: CurrentUser) -> list[Event]:
    return user.bookmarked_events


@app.put("/events/{event_id}/bookmark", status_code=status.HTTP_204_NO_CONTENT)
def add_bookmark(
    event_id: str,
    user: CurrentUser,
    db: DatabaseSession,
    payload: EventCreate | None = None,
) -> Response:
    event = db.get(Event, event_id)
    if event is None:
        if payload is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
        event = Event(
            id=event_id,
            **payload.model_dump(),
            created_by_id=None,
            is_demo=True,
        )
        db.add(event)
        db.flush()
    if event not in user.bookmarked_events:
        user.bookmarked_events.append(event)
        db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.delete("/events/{event_id}/bookmark", status_code=status.HTTP_204_NO_CONTENT)
def remove_bookmark(event_id: str, user: CurrentUser, db: DatabaseSession) -> Response:
    event = db.get(Event, event_id)
    if event is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    if event in user.bookmarked_events:
        user.bookmarked_events.remove(event)
        db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)