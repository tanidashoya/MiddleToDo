from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# CORS設定（Reactと通信できるように）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React開発時のURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # or gpt-4
        messages=[{"role": "user", "content": request.message}]
    )
    reply = response.choices[0].message["content"]
    return {"reply": reply}
