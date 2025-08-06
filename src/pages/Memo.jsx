import styles from './Memo.module.css';
import { useState} from 'react'; 
import MemoList from '../components/MemoList.jsx';
import useWindowKey from '../hooks/useWindowKey.js';
import useSortedTasks from '../hooks/useSortedTasks.js';
import useLocalStorageReducer from '../hooks/useLocalStorageReducer.js';
import { memoReducer } from '../reducers/memoReducer.js';
import useFilteredMemos from '../hooks/useFilteredMemos.js';

function Memo() {

    //メモのタイトルを管理するuseState
    const [memoTitle,setMemoTitle] = useState("");

    //メモリストを管理するuseState
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

    //レンダリングに時にuseWindowKeyが実行され、
    //useEffectが評価されて
    //window.addEventListener(...) が実行されてイベントが登録される
    //コンポーネントがアンマウントされたら自動的に removeEventListener が呼ばれる
    useWindowKey((e) => {
        setIsCreateing(true);
    })

    const sortedMemoList = useSortedTasks(memoList,sortOrder)

    const filteredMemoList = useFilteredMemos(sortedMemoList,searchText)
    
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