from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SUNC Progress API",
    description="Backend для платформы онлайн-обучения",
    version="0.1.0",
)

# CORS: разрешаем фронту с Vite (порт 5173) обращаться к нам
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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