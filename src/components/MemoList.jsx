import styles from './MemoList.module.css';
import { useState } from 'react';


function MemoList(props) {

    const {
        filteredMemoList,
        handleDelete,
        setMemoTitle,
        setMemoContent,
        dispatch
    } 
    = props;

    //編集モードの状態管理
    const [isEditing,setIsEditing] = useState(false);
    const [editTitle,setEditTitle] = useState('');
    const [editContent,setEditContent] = useState('');
    const [editDate,setEditDate] = useState('');
    //編集中のmemoを管理する
    const [editingMemo,setEditingMemo] = useState(null);

    const handleEdit = (memo) => {
        //編集中の特定に使う
        setIsEditing(true);
        //editingMemoにmemoオブジェクトを代入。これは返答該当箇所の特定に使う
        setEditingMemo(memo);
        setEditTitle(memo.title);
        setEditContent(memo.content);
        setEditDate(memo.createdAt);
    }

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingMemo(null);
        setMemoTitle('');
        setMemoContent('');
        setEditDate('');
    }
    
    const handleSaveEdit = () => {
        if (isEditing) {
            dispatch({"type":"edit",payload:{original:editingMemo,editTitle:editTitle,editContent:editContent,editDate:editDate}})
        }
        //編集モードを終了する
        setIsEditing(false);
        setEditingMemo(null);
        setEditTitle('');
        setEditContent('');
        setEditDate('');
    }
    
    return(
        <div className={styles.memoListContainer}>
            {filteredMemoList.map((memo,index)=>(
                <div key={index} className={styles.memoAllItem}>
                    <span className={styles.memoDate}>{memo.createdAt}</span>
                    <div className={styles.memoItem}>
                        <span className={styles.memoTitle}>{memo.title}</span>
                        <button className={styles.editButton} onClick={()=>handleEdit(memo)}>閲覧・編集</button>
                        <button className={styles.deleteButton} onClick={()=>handleDelete(memo)}>削除</button>
                    </div>
                </div>
            ))}
            
            {/* 編集モードのウィンドウ */}
            {isEditing && (
                <div className={styles.createContainer}>
                    <div className={styles.editWindow}>
                        <h2 className={styles.editTitle}>メモを編集</h2> 
                        <input 
                            className={styles.titleInput} 
                            type="text" 
                            placeholder="タイトルを入力" 
                            value={editTitle} 
                            onChange={(e)=>setEditTitle(e.target.value)}
                        />
                        <textarea 
                            className={styles.contentInput} 
                            rows="17" 
                            cols="50" 
                            placeholder="内容を入力" 
                            value={editContent} 
                            onChange={(e)=>setEditContent(e.target.value)}
                        />
                        <div className={styles.buttonContainer}>
                            <button className={styles.saveButton} onClick={handleSaveEdit}>保存</button>
                            <button className={styles.cancelButton} onClick={handleCancelEdit}>キャンセル</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        
    )
}

export default MemoList;