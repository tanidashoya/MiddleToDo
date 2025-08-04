import { useRef, useEffect } from 'react';
import styles from './AutoResizeTextarea.module.css';

function AutoResizeTextarea({ value, onChange }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [value]);

  const handleInput = (e) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto'; // 一度リセットしないと高さが増え続ける
    textarea.style.height = textarea.scrollHeight + 'px';

    onChange(e); // 親に渡す
  };

  return (
    <textarea   
      ref={textareaRef}
      placeholder='メッセージを入力'
      value={value}
      onChange={handleInput}
      rows={1}
      style={{
        overflow: 'hidden',
        resize: 'none', // 手動リサイズ無効化（任意）
        width: '100%',
        fontSize: '1rem',
      }}
    />
  );
}

export default AutoResizeTextarea;
