import { useEffect } from "react";

// ref：対象の DOM 要素を指定（例：input）⇒実行したいDOM要素にrefをつける
// callback：Enterキー（またはCtrl+Enter）時に呼び出す処理
// options：拡張オプション（今回は ctrlOnly のみ）
function useWindowKey(callback) {
  //optionsというオブジェクトの中にある ctrlOnly というキーを「安全に」取り出している。
  //options が undefined でない場合だけoptions.ctrlOnly の値を取り出す
  //呼び出し元ではTrueかFalseを渡す
  //オプショナルチェイニング（?.）によってoptionsがundifinedになっていてもエラーにならない

  //useEffect は、ref, callback, ctrlOnly の変更があったら、再実行される
  //これは毎回の再レンダリングでaddEventListenerを登録することを防ぐためのもの
  useEffect(() => {
    //キーが押されたら実行されるという関数を定義
    const handler = (e) => {
      if (e.ctrlKey && e.key ==='c'){
        // そのイベントに対するブラウザのデフォルトの動作**をキャンセルする
        e.preventDefault();
        //渡した関数が実行される
        callback(e);
      }
    };

    window.addEventListener("keydown", handler);
    

    return () => {
      window.removeEventListener("keydown", handler);
    };
    //ref, callback, ctrlOnly の変更があったら、useEffect が再実行される
  }, [callback]);
}

export default useWindowKey;
