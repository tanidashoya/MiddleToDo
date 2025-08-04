import {useState,useRef} from 'react';
import styles from './Chat.module.css';
import AutoResizeTextarea from '../components/AutoResizeTextarea';
import sendIcon2 from '../assets/sendIcon.png';

function Chat() {

    const messageInputRef = useRef(null);
    const [message, setMessage] = useState('');
    
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    }

    return (
        <div className={styles.chat}>
            <div className={styles.chatContainer}>
                <h1 className={styles.chatTitle}>Chat</h1>
                <div className={styles.chatInputContainer}>
                    <AutoResizeTextarea ref={messageInputRef} value={message} onChange={handleMessageChange}/>
                    <button className={styles.sendButton}>
                        <img src={sendIcon2} alt="送信" />
                    </button>
                </div>
                {/* <input className={styles.chatInput} type="text" placeholder="メッセージを入力" value={message} onChange={(e) => setMessage(e.target.value)} ref={messageInputRef}/> */}
            </div>
        </div>
    )
}

export default Chat;