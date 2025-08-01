//Reactで状態変化が必要かどうかを判断する考え方
//ユーザーの行動 → 状態の変化 → UIの変化
//ユーザーの行動を受け取って状態を変化させる → 状態の変化をUIに反映させる

//useRef は「DOM参照もできる」フック（Hook）であり、かつ「再レンダリングを伴わずに値を保持できる」フック
import {useState,useRef} from 'react';
import TaskList from '../components/TaskList.jsx';
import styles from './Home.module.css';
import useFilteredTasks from '../hooks/useFilteredTasks.js';
import useSortedTasks from '../hooks/useSortedTasks.js';
import useEnterKey from '../hooks/useEnterKey.js';
import useLocalStorageReducer from '../hooks/useLocalStrageReducer.js';
import {taskReducer} from '../reducers/taskReducer.js';



function Home() {


    //カスタムHookでショートカットキーを扱うためのuseRef
    //useRefはDOM要素を参照するためのフック（これでinput要素を参照できる）
    const taskInputRef = useRef(null);
    const dueDateInputRef = useRef(null);

    //期限日付の管理をする
    const [dueDate, setDueDate] = useState("");

    //追加するタスクを管理するuseState
    //初期値はinputのvalueと考える
    const[newTask,setNewTask] = useState("");

    //useLocalStorageReducerの第一引数は保存するデータのキー、第二引数はreducer、第三引数は初期値
    //戻り値が[state,dispatch]があるので、それをtasksとdispatchに代入する
    //dispatchによってuseLocalStorageReducer内にあるtaskReducerが実行される
    //これはそもそもtasksをいろんなルール（add,delete,toggle,edit）で管理するためにuseReducerを使っている
    //かつlocalStorageに保存・最初のレンダリング時に取得するためにuseLocalStorageReducerのカスタムHookを使っている
    //以上の機能を持つカスタムHook（useLocalStorageReducer）
    const [tasks,dispatch] =useLocalStorageReducer("tasks",taskReducer,[]);

    //編集中のタスクを管理するuseState
    const [editText,setEditText] = useState("");

    //編集中のタスクを管理するuseState
    const [editingTask,setEditingTask] = useState(null);

    //並び替え順を管理するuseState
    const [sortOrder,setSortOrder] = useState("asc");

    //検索欄の文字を管理するuseState
    const [searchText,setSearchText] = useState("");


    //e.target⇒イベントが発生した要素
    //e.target.value⇒イベントが発生した要素のvalue
    const handleChange = (e) => {
        setNewTask(e.target.value)
    }



    const handleAddTask = () => {
        if(newTask.trim() !== ""){
            //tasksにnewTaskを追加する
            //追加されるタスクは{tasks:newTask, completed:false}というオブジェクトとして追加される
            dispatch({"type":"add","payload":{task:newTask,completed:false,due:dueDate}})
            setDueDate("");
            setNewTask(""); // 入力フィールドをクリア
        }
    }



    //インデックスではなく削除したいタスクを指定して削除する
    const handleDeleteTask = (taskToDelete) => {
        //タスクの内容で検索して削除する
        //ここでのtaskはtasks配列の一つ一つの要素{task:"タスク名", completed:false, due:dueDate}というオブジェクトとして渡される
        dispatch({"type":"delete",payload:taskToDelete})
    }

    //タスクの完了状態をチェックボックスで切り替える
    //インデックスではなくタスクオブジェクトを受け取るように変更
    //ここでのreturnはhandleToggleTaskのreturnではなく、map関数のreturnである
    //map関数は配列の各要素に対して処理を行う関数であり、新しい配列に入っていく
    const handleToggleTask = (taskToToggle) => {
        dispatch({"type":"toggle",payload:taskToToggle})
    }
    

    //DOM要素を参照してイベントを追加するカスタムHookなので変数代入も要素に設定も必要ない
    useEnterKey(taskInputRef, (e) => {
        //ctrlキーが押されている場合は最初のタスクを削除
        //ctrlキーが押されていない場合はタスクを追加
        if (e.ctrlKey) {
          // Ctrl + Enter：最初のタスクを削除
          if (tasks.length > 0) handleDeleteTask(tasks[0]);
        } else {
          // Enterのみ：タスクを追加
          handleAddTask();
        }
    });
      


    //DOM要素を参照してイベントを追加するカスタムHookなので変数代入も要素に設定も必要ない
    useEnterKey(dueDateInputRef,(e)=>{
        if (e.ctrlKey){
            setDueDate("");
        } else {
            e.preventDefault();
            taskInputRef.current?.focus();
        }
    })



    //期限入力欄でctrl+Enterキーが押されたら期限をクリア
    //  taskInputRef.current → 実際の <input> 要素 
    //  .focus() → ブラウザの機能で「その入力欄にカーソルを置く」 
    //  taskInputRef.currentがnullでない場合にのみメソッドを呼び出す(nullの場合?がないとエラーになりアプリが止まる)
    // const handleKeyDownDue = (e) => {
    //     if (e.ctrlKey && e.key === 'Enter'){
    //         setDueDate("");
    //     }

    //     if (e.key === 'Enter') {
    //         e.preventDefault(); // フォームの送信などを防止
    //         taskInputRef.current?.focus();
    //     }
    // }



    //編集中のタスクを編集する(編集ボタンが押されたら編集モードに入る)
    //タスクオブジェクトを受け取るように変更
    const handleEditTask = (taskToEdit) => {
        setEditingTask(taskToEdit);
        setEditText(taskToEdit.task);
    }

    //編集中のタスクを保存する
    const handleSaveTask = (taskToSave) => {
        dispatch({"type":"edit",payload:{original:taskToSave,editText:editText}});
        //編集中のタスクを保存したら編集モードを終了するためにsetEditingTaskをnullにする
        setEditingTask(null);
        setEditText("");
    }

    const handleEditCancel = () => {
        setEditingTask(null);
        setEditText("");
    }

    //並び替え順を変更する
    //比較用関数を作成
    //a,bは現在処理中の要素（a:一つ目の要素,b:二つ目の要素）
    //sortOrderが"asc"の場合はa.dueとb.dueを比較してa.dueがb.dueより小さい場合は-1,大きい場合は1,等しい場合は0を返す
    //sortOrderが"desc"の場合はa.dueとb.dueを比較してa.dueがb.dueより大きい場合は-1,小さい場合は1,等しい場合は0を返す
    //sortの引数が負の数であれば昇順、正の数であれば降順
    //全体として隣り合った数字同氏を比べて昇順・降順を繰り返して全体として昇順・降順としている
    const sorterdTasks = useSortedTasks(tasks,sortOrder)

    //検索欄に文字を入力したら入力した文字でフィルターされる
    //検索窓が空の場合はsorterdTasksをそのまま表示する（includes("")は全ての文字列にマッチする）
    //検索結果は新たな状態として保持していないので入力を消すと元に戻る
    //filter()は配列の要素を一つずつ取り出して、条件に合うかどうかを判断する。処理部分がTrueの場合は新しい配列に追加
    const filteredTasks = useFilteredTasks(sorterdTasks,searchText)

    //Reactのフォームでは、<input> や <textarea> に入力された値を即時に state に保存することで、
    //常に「状態 = 入力内容」を一致させておくのが基本
    //つまり、入力内容が変わったら状態を更新する
    //そのため、onChangeで状態を更新する
    return(
        <div className={styles.home}>

            <div className={styles.homeContainer}>
                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>ToDo</h1>
                    <div className={styles.inputContainer}>
                        {/* onChange⇒入力が変更されたらhandleChangeを呼び出す */}

                        <input className={styles.dateInput} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} ref={dueDateInputRef}/>
                        {/* ref⇒DOM要素を参照する */}
                        {/* ref={taskInputRef}⇒このinputタグをJavaScript側から直接操作できるようにする」ための参照（Ref）を作る処理 */}
                        {/* つまりtaskInputRef.current = 実際のinput要素（HTMLInputElement） となる*/}
                        <input className={styles.inputBox} type="text" placeholder="タスクを入力" value={newTask} ref={taskInputRef} onChange={handleChange}/>
                        <button className={styles.addButton} onClick={handleAddTask}>追加</button>
                </div>
                {/* 並び替えボタン */}
                {/* 並び替えボタンを押したらsortOrderを昇順か降順に切り替える */}
                <div className={styles.dataContainer}>
                    <input className={styles.searchInput} type="text" placeholder="タスクを検索" value={searchText} onChange={(e) => setSearchText(e.target.value)}/>
                    <button className={styles.sortButton} onClick={()=>setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                        {sortOrder === "asc" ? "🔼昇順" : "🔽降順"}
                    </button>
                </div>
                </div>
                {/* tasks.length > 0⇒タスクが1つ以上ある場合 */}
                {/* 左側がtrueの場合は右側の処理が実行される */}
                {tasks.length > 0 && (
                    <div className={styles.taskList}>
                        <div className={styles.taskListTitle}>
                            <span className={styles.taskListTitleText}>TaskList</span>
                        </div>
                        <TaskList filteredTasks={filteredTasks} 
                        handleDeleteTask={handleDeleteTask} 
                        handleToggleTask={handleToggleTask} 
                        handleEditTask={handleEditTask}
                        editText={editText}
                        editingTask={editingTask}
                        setEditText={setEditText}
                        handleSaveTask={handleSaveTask}
                        handleEditCancel={handleEditCancel}
                        // sorterdTasks={sorterdTasks}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home;




//しょうやさん、その悩みは**とても正しい感覚**です。Reactの開発で「状態（state）」が分からない・増えると混乱する・先に考えておくべきなのか？というのは、誰もが一度は通る道です。

// ---

// ## ✅ 結論から言うと…

// ### 🔸 **状態管理は、開発前に「ざっくりでいいから考えておく」べきです。**

// ### 🔸 **考える出発点は、「ユーザーが何をするか（行動）」です。**

// ---

// ## 🧭 なぜ先に状態を考えておくのか？

// Reactでは状態が**UIのすべての源**だからです。
// 状態を曖昧にしたまま作り始めると…

// * 中途半端にuseStateが増えてゴチャゴチャする
// * 機能追加のたびに状態設計をやり直すはめになる
// * 状態が分散してバグりやすくなる（例：更新したのに画面が変わらない）

// ---

// ## 🧠 状態を洗い出すための考え方

// ### ステップ①：**ユーザーがする行動**をすべて書き出す

// 例：ToDoアプリなら…

// ```
// ・タスクを入力する
// ・タスクを追加する
// ・タスクを削除する
// ・タスクにチェックを入れる
// ・タスクを編集する
// ```

// ---

// ### ステップ②：**その行動で「変わる情報」を見つける**

// その情報がUIに影響するなら、状態にすべきです。

// | 行動        | 状態として必要なもの                         |
// | --------- | ---------------------------------- |
// | 入力欄に文字を打つ | `newTask`（入力フィールドの文字）              |
// | タスクを追加する  | `tasks`（タスク一覧）                     |
// | チェックを入れる  | `tasks[index].completed`           |
// | 編集ボタンを押す  | `editText`、`editingIndex`（編集内容と位置） |
// | 編集して保存    | `tasks`（中のテキストが変化）                 |

// ---

// ### ステップ③：UIのどこに影響するか考えてみる

// * 入力欄 → 入力中に表示が変わる
// * タスク一覧 → 完了チェックや編集で表示が変わる
// * 編集中 → 編集用のinputを表示する

// → UIに関係ある → useStateで状態として持つ

// ---

// ## 🎯 状態を洗い出すチェックリスト

// 1. ✅ ユーザーが直接変更する情報か？
// 2. ✅ その情報が画面に影響を与えるか？
// 3. ✅ 状態が変わったら再レンダリングされるべきか？

// → YES が多ければ `useState` や `useReducer` で管理するべき状態です。

// ---

// ## 🧰 おすすめ補助ツール（紙 or ノート or Miro）

// 作る前に以下のようにメモをしておくととてもスムーズです：

// ```text
// 【アプリ名】ToDoアプリ

// ▼ ユーザー操作
// ・文字入力
// ・追加ボタン
// ・チェックボックス
// ・編集ボタン
// ・保存ボタン
// ・削除ボタン

// ▼ 必要な状態
// ・newTask：入力欄の文字列
// ・tasks：タスクの配列（task + completed）
// ・editText：編集中の文字列
// ・editingIndex：どのタスクを編集中か
// ```

// ---

// ## 💬 最後に：しょうやさんへ

// 今やっている「ユーザー行動から状態を考える」という姿勢は**プロの現場でも通用する考え方**です。Reactが難しいと感じるのは、それだけ**UIのロジックを状態で正しく構築できるか**が大事だからです。

// 無理に完璧にしてから始めなくても大丈夫。最初は「ざっくり設計→書いてみる→動かしながら修正」のサイクルでOKです。

// ---

// ✅ 状態の洗い出し手順をまとめると…
// ユーザーが画面上でどんな操作をするかをすべて書き出す。

// それぞれの操作で「アプリの中で変わる情報は何か？」を考える。
//※このアプリでの削除・追加は既にある状態を変化させるだけなので新たにusestateは必要ない。

// その情報がUIに影響するなら useState で状態管理する。ょうやさんが次に作ってみたいアプリや、今作ろうとしている構想があれば、それを一緒に「状態の設計」から考えてみることもできますよ！お気軽に教えてください😊
