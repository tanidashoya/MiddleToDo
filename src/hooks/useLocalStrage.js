import { useState, useEffect } from "react";

//useLocalStorageの第一引数は保存するデータのキー、第二引数は保存するデータの値
//useLocalStorageの戻り値は[value,setValue]
//valueは保存するデータの値、setValueは保存するデータの値を変更する関数
//useLocalStorageはlocalStorageに保存するデータの値を管理する
//useLocalStorageはlocalStorageに保存するデータの値を管理する
function useLocalStorage(key, initialValue) {
  // 初期化：localStorageに値があればそれを使う
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  //tasksの値の変更を引数keyから受け取っている
  // 値が変わるたびにlocalStorageに保存
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  //useLocalStorageの戻り値は[value,setValue]
  // 「関数の参照そのものを渡している」ので、setTasks は setValue と完全に同じ関数を指している
  return [value, setValue];
}

export default useLocalStorage;
