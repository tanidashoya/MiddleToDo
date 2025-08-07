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



// useState型	                                      useReducer型
// 「状態をどう変更するかは自分で処理してから渡す」	     「状態をどう変えるかは reducer に任せる」
// 「加工してから setMemoList(updated)」	          「dispatch でアクションを送る」
// 処理の分散 → 複雑になりがち	                        ロジックの集中管理 → 明確で保守性が高い