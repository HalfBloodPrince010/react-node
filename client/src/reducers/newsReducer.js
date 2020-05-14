const initState = {
    newsState:'Guardian'
}

const newsReducer = (state = initState, action) => {
    if(action.type == 'CHANGE_NEWS'){
        console.log("from store", action.newsValue)
        return{
            newsState : action.newsValue
        }
    }
    return state
}

export default newsReducer;