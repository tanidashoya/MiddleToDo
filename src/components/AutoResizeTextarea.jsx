import { useRef, useEffect } from 'react';
import styles from './AutoResizeTextarea.module.css';
import useEnterKey from '../hooks/useEnterKey';

//propsでvalue, onChangeを分割代入で受け取る
//valueは親コンポーネント（Chat.jsx）の状態message(メッセージの内容)
//onChangeは親コンポーネント（Chat.jsx）のonChange(メッセージの内容を変更した時の処理:状態messageを更新する)
function AutoResizeTextarea({ value, onChange }) {
  //textareaのrefをuseRefで定義
  //refはDOM要素を参照するためのもの
  //このrefを使って高さ（style.height）を調整する
  const textareaRef = useRef(null);

  //valueが変更された時にtextareaの高さを自動調整する
  //resetボタンやsendボタンを押してメッセージを送信したときに高さが自動調節されるように
  useEffect(() => {
    //textareaRef.current によって、ref属性で textareaRef が指定されている要素（DOM）を取得する
    const textarea = textareaRef.current;
    //cssに高さを設定する
    if (textarea) {
      //textareaの高さをリセット（textareaの高さを最小限にする）
      textarea.style.height = 'auto';
      //textareaの高さを自動調整
      //textareaの中の全コンテンツを表示するのに必要な高さ（px単位）を表す
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [value]);

  // これはチャットの送信ボタンを押した時に送信される
  // useEnterKey(textareaRef, (e) => {
  //   if (e.ctrlKey) {
  //     チャット画面送信関数
  //   }
  // });


  //ユーザーがメッセージを入力した時の処理
  //textareaの高さを自動調整する
  //onChangeで親コンポーネント（Chat.jsx）のonChangeを呼び出す
  //こちらだけだとresetボタンやsendボタンを押してメッセージを送信したときに高さが自動調節されない
  //e:HTMLの <textarea> に入力が発生したとき、「何が起きたか」を教えてくれる郵便物📨 のようなもの。
  const handleInput = (e) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto'; // 一度リセットしないと高さが増え続ける
    textarea.style.height = textarea.scrollHeight + 'px';

    //親コンポーネント（Chat.jsx）のonChange(handleMessageChange)を呼び出す（e:textareaの入力イベントが渡される）
    onChange(e); // 親に渡す
  };

  return (
    <textarea   
      ref={textareaRef}
      placeholder='メッセージを入力'
      value={value}
      onChange={handleInput}
      rows={1}
    />
  );
}

export default AutoResizeTextarea;
