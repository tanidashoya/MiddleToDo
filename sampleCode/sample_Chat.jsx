import { useState, useRef } from 'react';
import styles from './Chat.module.css';
import AutoResizeTextarea from '../components/AutoResizeTextarea';
import sendIcon2 from '../assets/sendIcon.png';

function Chat() {
  //message入力欄のDOM要素を参照するためのref
  const messageInputRef = useRef(null);
  //message入力欄の値を管理するstate
  const [newMessage, setNewMessage] = useState('');
  //チャットの履歴を管理するstate
  const [messages, setMessages] = useState([]);
  //チャット中かどうかを管理するstate
  const [isChatting, setIsChatting] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ← ローディング状態

  // メッセージ入力欄での値の更新
  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  //async = 非同期関数ですよと宣言するキーワード
  // チャット開始ボタン(送信)を押した時の処理
  const handleIsChatting = async () => {
    if (!newMessage.trim()) return;
    //状態が変わる前に一時的に別の変数・定数に値を避難しておく安全なやり方
    const userMessage = newMessage;
    setMessages([...messages, { role: 'user', text: userMessage }]);
    setIsChatting(true);
    setIsLoading(true);
    // ここで setNewMessage('') をした瞬間、newMessage の値はまだ変わっていません
    setNewMessage('');  // 入力欄をクリア


    //fetch = サーバーにデータを取りに行く関数
    // fetch("http://localhost:8000/chat"このURLにアクセスしてデータを何かほしい。
    //JSON.stringify = オブジェクトをJSON形式の文字列に変換する関数
    //await = 非同期処理が終わるまで待つ（async関数の中でのみ使える）fetchの完了（リクエストの送信からレスポンスの受信まで）を待つ
    //何かを“取りに行く”処理（＝非同期処理）を実行したときに…
    // 返事がくるまでの間は待って（=一時停止して）…
    // 終わったらまた続きを実行する！
    //awaitがある部分だけ一時停止するけど、他の処理は並行して動く（非同期のまま）！
    //定数resにはサーバーからのレスポンスが入っている
    //promise = 非同期処理の結果を表すオブジェクト
    //fetchは即座に結果が決まってない箱（Promiseオブジェクト）を返す
    //その Promise は「サーバーからのレスポンスが返ってくるまでの一時的な箱」
    // await を付けることで「中身が返ってくるまで処理を止める」
    // 「Promiseの中身」が返ってくると、処理が再開される
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",  //データを送信する時はPOST、データを受け取る時はGET(FastAPI側では@app.post("/chat")となっている)
        headers: {
          "Content-Type": "application/json",       //サーバーに「これから送るデータはこんな形式だよ」と教えるメモ
        },
        //userMessage に保存せずに newMessage を使っていたらnewMessage が空文字に変わっている可能性がある(setStateは時間差があるとはいえ)
        body: JSON.stringify({ message: userMessage }),  //データを送信する時はbodyにデータを入れる(サーバーに送る実際のデータ本体)
      });

      //res.json()の返り値はPromiseオブジェクトなのでawaitで待つ
      //awaitはその処理が終わるまでは次の行に進まないようにするキーワード
      //他の処理を止めずにその関数の中だけ次に進まずに一時停止
      //res.json()「JSON文字列のまま送られてきたデータを、JavaScriptのオブジェクトに変換する処理」
      const data = await res.json();
      const reply = data.reply;

      // try-catch-finally = エラーが発生した時の処理
      // try = 正常に処理が終わった時の処理
      // catch = エラーが発生した時の処理
      // finally = 正常に処理が終わった時の処理
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (error) {
      console.error("APIエラー:", error);
      setMessages(prev => [...prev, { role: 'assistant', text: 'エラーが発生しました。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chat}>
      <div className={styles.chatContainer}>
        <h1 className={styles.chatTitle}>Chat</h1>
        <div className={styles.chatInputContainer}>
          <AutoResizeTextarea
            ref={messageInputRef}
            value={newMessage}
            onChange={handleMessageChange}
          />
          <button className={styles.sendButton} onClick={handleIsChatting} disabled={isLoading}>
            <img src={sendIcon2} alt="送信" />
          </button>
        </div>
      </div>

      {/* チャット中のメッセージを表示 */}
      {isChatting && (
        <div className={styles.chatMessages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}
            >
              {msg.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Chat;
