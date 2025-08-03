export const memoReducer = (state,action) => {
    switch(action.type){
        case "save":
            return [...state,action.payload]
        case "delete":
            return state.filter((memo) => memo !== action.payload)
        case "edit":
            return state.map(memo => memo === action.payload.original ? {
                ...memo,title:action.payload.editTitle,content:action.payload.editContent,createdAt:action.payload.editDate}:memo)
        default:
            return state
    }
}


// useReducer を使うことで「現在の状態に対してどう変更するか」のロジックを reducer に集約できる。
// useState のように変更後の状態を定数に格納して set 関数に渡す必要がなくなる。
// ただし、状態は直接変更するのではなく、「新しい状態を作って返す」形で更新する点は同じ。


// useState型	                                      useReducer型
// 「状態をどう変更するかは自分で処理してから渡す」	     「状態をどう変えるかは reducer に任せる」
// 「加工してから setMemoList(updated)」	          「dispatch でアクションを送る」
// 処理の分散 → 複雑になりがち	                        ロジックの集中管理 → 明確で保守性が高い