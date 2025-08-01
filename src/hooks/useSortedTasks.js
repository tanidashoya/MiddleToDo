


function useSortedTasks(tasks,sortOrder){
    return [...tasks].sort((a,b)=>  {
        if (a.completed !== b.completed) {
            return a.completed ? 1:-1;
        }

        //0:並び順を維持する,-1:「a を b より前にする＝明確に順序を変える」,1:「b を a より前にする＝明確に順序を変える」
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