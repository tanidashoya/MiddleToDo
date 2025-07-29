import { useEffect } from "react";

// ref：対象の DOM 要素を指定（例：input）
// callback：Enterキー（またはCtrl+Enter）時に呼び出す処理
// options：拡張オプション（今回は ctrlOnly のみ）
function useEnterKey(ref,callback,options){
    useEffect(() => {
        const handler = (e) => {
          // ↓ここでEnterやCtrl+Enterかどうかを判定
          const isEnter = e.key === "Enter";
          const isCtrl = e.ctrlKey;
      
          if (ctrlOnly ? (isEnter && isCtrl) : isEnter) {
            e.preventDefault(); // フォーム送信防止など
            callback();         // 登録された処理を実行
          }
        };
      
        const element = ref?.current;
      
        if (element) {
          element.addEventListener("keydown", handler);
        }
      
        return () => {
          element?.removeEventListener("keydown", handler);
        };
      }, [ref, callback, ctrlOnly]);
      
}

export default useEnterKey;