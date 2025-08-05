import {useState,useRef} from 'react';
import styles from './Chat.module.css';
import AutoResizeTextarea from '../components/AutoResizeTextarea';
import sendIcon2 from '../assets/sendIcon.png';

function Chat() {

    const messageInputRef = useRef(null);
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isChatting, setIsChatting] = useState(false);
    
    const handleMessageChange = (e) => {
        setNewMessage(e.target.value);
    }

    const handleIsChatting = () => {
        setMessages([...messages,newMessage])
        setIsChatting(true);
    }

    return (
        <div className={styles.chat}>
            <div className={styles.chatContainer}>
                <h1 className={styles.chatTitle}>Chat</h1>
                <div className={styles.chatInputContainer}>
                        <AutoResizeTextarea ref={messageInputRef} value={newMessage} onChange={handleMessageChange}/>
                    <button className={styles.sendButton} onClick={handleIsChatting}>
                        <img src={sendIcon2} alt="送信" />
                    </button>
                </div>
                {/* <input className={styles.chatInput} type="text" placeholder="メッセージを入力" value={message} onChange={(e) => setMessage(e.target.value)} ref={messageInputRef}/> */}
            </div>
            {isChatting && (
                <div className={styles.chatMessages}>
                    {messages.map((message, index) => (
                        <div key={index} className={styles.chatMessage}>{message}</div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Chat;