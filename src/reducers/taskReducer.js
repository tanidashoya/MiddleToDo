//dispatchによってactionが実行される
//actionは{type:string,payload:any}というオブジェクトとして渡される
//stateは現在のstate、actionはstateを変更するためのaction
//state と action は、呼び出し元の const [state, dispatch] = useReducer(taskReducer, 初期値) によって管理されている状態とアクションです。
export const taskReducer = (state,action) => {
    switch(action.type){
        case "add":
            return [...state,action.payload]
        case "delete":
            return state.filter((task) => task !== action.payload)
            //{...task}はスプレッド構文でtasktask オブジェクトの completed を含むすべてのキーと値をコピーしている。
            //そのあとでcompletedの値を反転させている
            //条件に合致しないものはそのままtaskオブジェクトを返す
        case "toggle":
            return state.map((task) => task ===action.payload ? {...task,completed:!task.completed} : task)
        case "edit":
            return state.map((task) => task === action.payload.original ? {...task,task:action.payload.editText,due:action.payload.editDate} : task)
        default:
            return state
    }
}