import { useReducer, useEffect } from "react";

function useLocalStorageReducer(key, reducer, initialState) {
  //useReducerの第一引数はreducer、第二引数は初期値
  //reducerはstateを変更するための関数
  //initialStateは初期値
  //useReducerの戻り値は[state,dispatch]
  //stateは現在のstate、dispatchはstateを変更するための関数

  const [state, dispatch] = useReducer(reducer, (() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialState;
  }));

  //stateは現在のstate、dispatchはstateを変更したいときにactionを送信する関数
  //変化がある場合にlocalStorageに保存する
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  //useLocalStorageReducerの戻り値は[state,dispatch]

  return [state, dispatch];
}

export default useLocalStorageReducer;
