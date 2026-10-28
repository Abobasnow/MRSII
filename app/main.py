from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, materials, assignments

app = FastAPI(
    title="SUNC Progress API",
    description="Backend для платформы онлайн-обучения",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(materials.router)
app.include_router(assignments.router)
@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "sunc-progress-api",
        "version": "0.1.0",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}