import { useState } from "react";

function useFilteredTasks(sortedTasks,searchText){
    return sortedTasks.filter(task => 
        task.task.toLowerCase().includes(searchText.toLowerCase())
    )
}

export default useFilteredTasks;