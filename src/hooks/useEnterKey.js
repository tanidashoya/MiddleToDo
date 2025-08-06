import { useEffect } from "react";

// ref：対象の DOM 要素を指定（例：input）⇒実行したいDOM要素にrefをつける
// callback：Enterキー（またはCtrl+Enter）時に呼び出す処理
// options：拡張オプション（今回は ctrlOnly のみ）
function useEnterKey(ref, callback) {

  //useEffect は、ref, callbackの変更があったら、再実行される
  //これは毎回の再レンダリングでaddEventListenerを登録することを防ぐためのもの
  //ReactのuseEffectは「依存配列の中身がどうであれ、コンポーネントがマウント（初回描画）されたときには必ず一度発動します。
  useEffect(() => {
      const handler = (e) => {
        //そもそもEnterキーが押されていない場合はreturn
        //Enter以外の場合はなにも処理しない
        if (e.key !== "Enter") return;
  
        e.preventDefault(); // フォームのsubmit防止など
        callback(e); // 呼び出し元の処理を実行
      };

    //refオブジェクトが存在する場合に、その中のcurrentプロパティ（＝実際のDOM要素）を取り出す
    //ただし、refが未定義でもエラーにならないように、安全にアクセスするためにref?.currentとしている
    const element = ref?.current;

    //refが存在する場合だけ条件がTrueになり、addEventListenerを呼び出す

    if (element) {
      element.addEventListener("keydown", handler);
    }

    //useEffectのreturnでは、removeEventListenerを呼び出してイベントリスナーを削除する
    return () => {
      element?.removeEventListener("keydown", handler);
    };
    //ref, callbackの変更が無い限り、useEffect が再実行されない
  }, [ref, callback]);
}

export default useEnterKey;

//初回のaddEventListener登録は、次の3つのステップを経て起こる：
// 親コンポーネントがマウント（JSX → 実DOMへ）
// ref.current に DOM 要素がセットされる
// useEffect が実行されて、addEventListener が呼ばれる（refとcallbackが使える）



// ref={ref} が指定されて要素が存在する場合に、
// その要素に対して keydown イベントリスナーが設定される。
// そして Enter キーが押されたときに限って、
// callback 関数が呼び出される。