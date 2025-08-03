//アロー関数の省略形式で書いた場合はreturnが不要
//TrueかFalseがfilter()に返ってmemoを残すか決めている
function useFilteredMemos(sortedMemoList, searchText) {
    return sortedMemoList.filter(memo =>
        memo.title.toLowerCase().includes(searchText.toLowerCase()) ||
        memo.content.toLowerCase().includes(searchText.toLowerCase())
    );
}


export default useFilteredMemos;


//アロー関数のブロック形式で書いた場合はreturnが必要
//function useFilteredMemos(sortedMemoList, searchText) {
//     return sortedMemoList.filter(memo => {
//         return memo.title.toLowerCase().includes(searchText.toLowerCase()) ||
//                memo.content.toLowerCase().includes(searchText.toLowerCase());
//     });
// }



//これはバグりポイント
//{} を使ったときに return が必要なのは、「JavaScriptの構文ルール」だからバグった

//アロー関数の書き方2種類
//1.省略形式
//const fn = x => x + 1;
//2.ブロック形式
//const fn = (x) => {
//  return x + 1;
//}

//バグったコード
// function useFilteredMemos(sortedMemoList,searchText){
//     return sortedMemoList.filter(memo => {
//         memo.title.toLowerCase().includes(searchText.toLowerCase()) ||
//         memo.content.toLowerCase().includes(searchText.toLowerCase())
//     })
// }

// export default useFilteredMemos;