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

#データの形式を定義
#受け取るデータは、message という名前の文字列だよ」と定義している。
#{ "msg": "こんにちは" }  ← "message" じゃないからエラーになる
class ChatRequest(BaseModel):
    message: str

#asyncを関数の前につけると、この関数、時間かかるかもしれんけえ、他の処理と並行してやるようにしておくで！になる（非同期処理）
#openai.ChatCompletion.create() = チャットボットのAPIを呼び出す関数(これは同期関数なのでawaitがなくても処理が終わるまで一時停止する)
@app.post("/chat")
async def chat(request: ChatRequest):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # or gpt-4
        messages=[{"role": "user", "content": request.message}]
    )
    reply = response.choices[0].message["content"]
    return {"reply": reply}
