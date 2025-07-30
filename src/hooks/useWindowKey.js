import { useEffect } from "react";

// ref：対象の DOM 要素を指定（例：input）⇒実行したいDOM要素にrefをつける
// callback：Enterキー（またはCtrl+Enter）時に呼び出す処理
// options：拡張オプション（今回は ctrlOnly のみ）
function useEnterKey(ref, callback, options) {
  //optionsというオブジェクトの中にある ctrlOnly というキーを「安全に」取り出している。
  //options が undefined でない場合だけoptions.ctrlOnly の値を取り出す
  //呼び出し元ではTrueかFalseを渡す
  //オプショナルチェイニング（?.）によってoptionsがundifinedになっていてもエラーにならない
  const ctrlOnly = options?.ctrlOnly; // ⭐️これが必要！

  //useEffect は、ref, callback, ctrlOnly の変更があったら、再実行される
  //これは毎回の再レンダリングでaddEventListenerを登録することを防ぐためのもの
  useEffect(() => {
    const handler = (e) => {
      const isEnter = e.key === "Enter";
      const isCtrl = e.ctrlKey;

      //条件分岐の入れ子構造になっている
      //ctrlOnly が true なら → Enter かつ Ctrl が押されてるか？
      // ctrlOnly が false または undefined なら → Enter が押されてるか？
      if (ctrlOnly ? (isEnter && isCtrl) : isEnter) {
        e.preventDefault();
        //渡した関数が実行される
        callback(e);
      }
    };

    const element = ref?.current;

    //refが存在する場合だけ条件がTrueになり、addEventListenerを呼び出す
    if (element) {
      element.addEventListener("keydown", handler);
    }

    return () => {
      element?.removeEventListener("keydown", handler);
    };
    //ref, callback, ctrlOnly の変更があったら、useEffect が再実行される
  }, [ref, callback, ctrlOnly]);
}

export default useEnterKey;
