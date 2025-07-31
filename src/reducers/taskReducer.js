//dispatchによってactionが実行される
//actionは{type:string,payload:any}というオブジェクトとして渡される
//stateは現在のstate、actionはstateを変更するためのaction
export const taskReducer = (state,action) => {
    switch(action.type){
        case "add":
            return [...state,action.payload]
        case "delete":
            return state.filter((task) => task !== action.payload)
        case "toggle":
            return state.map((task) => task ===action.payload ? {...task,completed:!task.completed} : task)
        case "edit":
            return state.map((task) => task === action.payload.original ? {...task,task:action.payload.editText} : task)
        default:
            return state
    }
}