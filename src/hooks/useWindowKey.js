import { useEffect } from "react";


//オプショナルチェイニング（?.）によってoptionsがundifinedになっていてもエラーにならない
//useEffectは毎回の再レンダリングでaddEventListenerを登録することを防ぐためのもの
//クリーンアップ関数はcallbackが変更された時と、コンポーネントがアンマウント（画面から消える）時に実行される
function useWindowKey(callback) {

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key ==='c'){
        e.preventDefault();
        callback(e);
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [callback]);
}

export default useWindowKey;
