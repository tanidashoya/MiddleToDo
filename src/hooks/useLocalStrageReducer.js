import { useReducer, useEffect } from "react";


//第一引数にkey、第二引数にreducer関数、第三引数にinitialState（初期値）を渡す
function useLocalStorageReducer(key, reducer, initialState) {
  //useReducerの第一引数はreducer、第二引数は初期値
  //reducerはstateを変更するための関数
  //initialStateは初期値
  //useReducerの戻り値は[state,dispatch]
  //stateは現在のstate、dispatchはstateを変更するための関数

  //initialState がそのまま最初の state になる
  // reducer は初期値に一切手を加えない → 初期値がそのまま最初の state になる
  // dispatch() が呼ばれたときだけ reducer(state, action) が実行され、state を更新する
  //useReducerの第2引数は初期値、第3引数は初期化関数
  //useReducerの第三引数(初期値関数)では初期値をlocalStorageから取得する
  const [state, dispatch] = useReducer(reducer, initialState, (() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialState;
  }));

  //stateは現在のstate、dispatchはstateを変更したいときにactionを送信する関数
  //変化がある場合にlocalStorageに保存する
  //taskReducerによってstateが変化したときに、その変化をlocalStorageに保存する
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  //useLocalStorageReducerの戻り値は[state,dispatch]

  return [state, dispatch];
}

export default useLocalStorageReducer;
