import styles from './Memo.module.css';
import { useState,useEffect,useRef } from 'react';  //useRefはDOM要素を参照するために使う
import MemoList from '../components/MemoList.jsx';
import useWindowKey from '../hooks/useWindowKey.js';
import useSortedTasks from '../hooks/useSortedTasks.js';
import useLocalStorageReducer from '../hooks/useLocalStorageReducer.js';
import { memoReducer } from '../reducers/memoReducer.js';
import useFilteredMemos from '../hooks/useFilteredMemos.js';

function Memo() {

    // const createRef = useRef(null);

    //メモのタイトルを管理するuseState
    const [memoTitle,setMemoTitle] = useState("");

    //メモリストを管理するuseState
    //初期値をlocalStorageから読み込む
    const [memoList,dispatch] = useLocalStorageReducer("memoList",memoReducer,[]);

    
    //メモの内容を管理するuseState
    const [memoContent,setMemoContent] = useState("");

    //メモ作成中かどうかを管理する
    const [isCreateing,setIsCreateing] = useState(false);

    //並び替え順を管理するuseState
    const [sortOrder,setSortOrder] = useState("asc");

    //検索欄の文字を管理するuseState
    const [searchText,setSearchText] = useState("");

    //メモ作成画面でメモを保存する
    const handleSave = () => {
        if (!memoTitle.trim()) {
            alert("タイトルを入力してください");
            return;
        }
        if (!memoContent.trim()) {
            alert("内容を入力してください");
            return;
        }
        dispatch({"type":"save",payload:{id:Date.now(),title:memoTitle,content:memoContent,createdAt:new Date().toLocaleDateString()}})
        setMemoTitle("");
        setMemoContent("");
        //作成画面を閉じる
        setIsCreateing(false);
    }

    //メモを削除するボタン
    const handleDelete = (memo) => {
        dispatch({"type":"delete",payload:memo});
    }

    //メモの作成をキャンセルする（作成画面で使う）
    const handleCancel = () => {
        setIsCreateing(false);
        setMemoTitle("");
        setMemoContent("");
    }


    const handleKeyDownCreate = useWindowKey((e) => {
        setIsCreateing(true);
    })


    //ctrl+cキーが押されたら作成画面を開く
    //Reactの中で JavaScript の「生のAPI（DOM API）」を使うのはよくあること   
    //useEffect() → 副作用を実行するためのフック(第二引数に[]を渡すと、初回のみ実行される)
    //「初回」とは、そのコンポーネント（ここでは Memo）が画面上に初めて表示（＝マウント）されるタイミング
    //再びMemoコンポーネントが表示されたときにも、useEffect が実行される
    //「Reactの世界では、はじめから window.addEventListener を設置してはいけない」から useEffect が必要
    //ページコンポーネントを切り替えてまたもとのページコンポーネントを表示したときに
    //何度もwindow.addEventListener('keydown', handleKeyDownCreate)が呼ばれてしまう
    // useEffect とクリーンアップ関数を使うことで、
    // window.addEventListener が再レンダリングや再マウント時に
    // 重複して登録されるのを防いでいる
    //Reactでは DOM操作に関わるコードは useEffect(() => {...}, []) の中に書くのが原則・一般的
    // useEffect(() => {
    //     const handleKeyDownCreate = (e) => {
    //         if (e.ctrlKey && e.key === 'c') {
    //             e.preventDefault(); // ブラウザのデフォルト動作を防ぐ（コピーとか）
    //             setIsCreateing(true);
    //         }
    //     };

    //     //addEventListener() → イベントリスナーを追加するメソッド
    //     //第一引数：keydown → キーが押されたときに発火するイベント
    //     //第二引数：handleKeyDownCreate → キーが押されたときに実行する関数
    //     window.addEventListener('keydown', handleKeyDownCreate);
        
    //     //クリーンアップ関数
    //     //removeEventListener() → イベントリスナーを削除するメソッド
    //     //実行されるタイミング：コンポーネントがアンマウントされるタイミング
    //     //コンポーネントがアンマウントされるタイミング：コンポーネントが画面から消えるタイミング
    //     return () => {
    //         window.removeEventListener('keydown', handleKeyDownCreate);
    //     };
    // }, []);
    
    const sortedMemoList = useSortedTasks(memoList,sortOrder)

    //並び替え順を管理するuseState
    // const sorterdMemoList = [...memoList].sort((a,b) => {

    //     //日付型で比較する
    //     const dataA = new Date(a.createdAt)
    //     const dataB = new Date(b.createdAt)

    //     //ascの場合は正の数だと入れ替える。負の数だと入れ替えない。
    //     // sort(正の値)は入れ替える、sort（負の値）は入れ替えない
    //     //戻り値が負の数だと入れ替えない。
    //     if(sortOrder === "asc"){
    //         return dataA - dataB;
    //     } else {
    //         return dataB - dataA;
    //     }
    // })



    //検索欄に文字を入力したら入力した文字でフィルターされる
    //検索窓が空の場合はsortedTasksをそのまま表示する（includes("")は全ての文字列にマッチする）
    //検索結果は新たな状態として保持していないので入力を消すと元に戻る
    //filter()は配列の要素を一つずつ取り出して、条件に合うかどうかを判断する。処理部分がTrueの場合は新しい配列に追加
    //toLowerCase()は文字列を小文字に変換するメソッド
    //includes()は文字列に指定した文字列が含まれているかどうかを判断するメソッド
    //検索対象の文字列.includes(検索したい文字列)
    const filteredMemoList = useFilteredMemos(sortedMemoList,searchText)
    



    //Reactのフォームでは、<input> や <textarea> に入力された値を即時に state に保存することで、
    //常に「状態 = 入力内容」を一致させておくのが基本
    //つまり、入力内容が変わったら状態を更新する
    //そのため、onChangeで状態を更新する
    return(
        <div className={styles.memo}>
            <div className={styles.memoContainer}>
                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>Memo</h1>
                    <div className={styles.inputContainer}>
                        <button className={styles.createButton} onClick={()=>setIsCreateing(true)}>作成</button>
                    </div>
                    <div className={styles.DataContainer}>
                        <div className={styles.searchContainer}>
                            <input 
                                className={styles.searchInput} 
                                type="text" 
                                placeholder="検索" 
                                value={searchText} 
                                onChange={(e)=>setSearchText(e.target.value)}
                            />
                        </div>
                        <div className={styles.sortContainer}>
                            <button className={styles.sortButton} onClick={()=>setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                                {sortOrder === "asc" ? "🔼昇順" : "🔽降順"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* 作成モードのウィンドウ */}
            {isCreateing && (
                <div className={styles.createContainer}>
                    <div className={styles.createWindow}>
                        <h2>新規作成</h2>
                        <input 
                            className={styles.titleInput} 
                            type="text" 
                            placeholder="タイトルを入力" 
                            value={memoTitle} 
                            onChange={(e)=>setMemoTitle(e.target.value)}
                        />
                        <textarea 
                            className={styles.contentInput} 
                            rows="13"
                            cols="50" 
                            placeholder="内容を入力" 
                            value={memoContent} 
                            onChange={(e)=>setMemoContent(e.target.value)}
                        />
                        <div className={styles.buttonContainer}>
                            <button className={styles.saveButton} onClick={handleSave}>保存</button>
                            <button className={styles.cancelButton} onClick={handleCancel}>キャンセル</button>
                        </div>
                    </div>
                </div>
            )}
            {memoList.length === 0 ? (
                <div className={styles.noMemoContainer}>
                    <span className={styles.noMemoText}>メモがありません</span>
                </div>
                ) : (
                
                <div className={styles.memoListContainer}>
                    <div className={styles.memoListTitle}>
                        <span className={styles.memoListTitleText}>MemoList</span>
                    </div>
                    <MemoList 
                        filteredMemoList={filteredMemoList} 
                        handleDelete={handleDelete} 
                        setMemoTitle={setMemoTitle}
                        setMemoContent={setMemoContent}
                        //dispatchはmemoReducerの中で定義されたactionを実行するための関数
                        dispatch={dispatch}
                    />
                </div>
                )}
        </div>
    )
}

export default Memo;