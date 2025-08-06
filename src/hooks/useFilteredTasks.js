//レンダリングされるたびにリアルタイムで再評価される
function useFilteredTasks(sortedTasks,searchText){
    return sortedTasks.filter(task => 
        task.task.toLowerCase().includes(searchText.toLowerCase())
    )
}

export default useFilteredTasks;