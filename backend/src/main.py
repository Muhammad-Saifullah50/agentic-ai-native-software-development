from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware # Import CORSMiddleware
from src.api import simulate
from src.api import scenarios
from src.api import websockets
from src.api import review
from src.error_handling import validation_exception_handler, generic_exception_handler


app = FastAPI()
origins = [
    "https://agentic-ai-native-software-developm.vercel.app",
    "https://agentic-ai-native-software-developm-theta.vercel.app",
    "http://localhost:3000",
]
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

app.include_router(simulate.router)
app.include_router(scenarios.router)
app.include_router(websockets.router)
app.include_router(review.router)

@app.get("/")
async def root():
    return {"message": "AI-Native Scenario Simulator Backend"}
