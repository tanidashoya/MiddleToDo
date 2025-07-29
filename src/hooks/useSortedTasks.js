import { useState } from "react";


function useSortedTasks(tasks,sortOrder){
    return [...tasks].sort((a,b)=>  {
        if (a.completed !== b.copmpleted) {
            return a.completed ? 1:-1;
        }

        if (!a.due && !b.due) return 0;
        if (!a.due) return 1;
        if (!b.due) return -1;

        const dataA = new Date(a.due);
        const dataB = new Date(b.due);
        
        if (sortOrder === "asc") {
            return  dataA - dataB;
        }else{
            return dataB - dataA;
        }  
    })
}

export default useSortedTasks;