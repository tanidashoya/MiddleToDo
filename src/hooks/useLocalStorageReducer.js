import { useReducer, useEffect } from "react";


// dispatch() が呼ばれたときだけ reducer(state, action) が実行され、state を更新する
//useReducerの第三引数(初期値関数)では初期値をlocalStorageから取得する
function useLocalStorageReducer(key, reducer, initialState) {

  const [state, dispatch] = useReducer(reducer, initialState, (() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialState;
  }));

  //stateは現在のstate、dispatchはstateを変更したいときにactionを送信する関数
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, dispatch];
}

export default useLocalStorageReducer;
