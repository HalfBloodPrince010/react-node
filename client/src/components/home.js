import React, { useState, useEffect, memo, useRef} from 'react'
import './home.css';
import axios from 'axios';
import { connect } from 'react-redux';
import Helper from './helper'
import Loader from './loading'
import Sharemodal from './shareModal'

const Home = props =>{

    const [headlineNews, getNewsHeadlines] = useState([])
    const [isopenModal, changeModalState] = useState(false)
    const [activeItem, getActiveItem] = useState("")

    // Fetch Data
    const fetchData=()=>{
        if(props.whichNews === 'Guardian' || props.whichNews === 'guardian'){
        axios.get('http://reactnodenewsapplication-env.eba-ni6taxhj.us-east-1.elasticbeanstalk.com/guardian')
        .then(responseData => {
            getNewsHeadlines(responseData.data)
        })
        .catch(responseData=>{
            console.log("error");
        })
    }
    else if(props.whichNews === 'nytimes'){
        axios.get('http://reactnodenewsapplication-env.eba-ni6taxhj.us-east-1.elasticbeanstalk.com/nytimes')
        .then(responseData => {
            getNewsHeadlines(responseData.data)
        })
        .catch(responseData=>{
            console.log("error");
        })

    }
}

    const handleClose = () =>{
        changeModalState(false)
        console.log("closing")
    }

    const handleOpen = (title, weburl) =>{
        let sharedata = {title:title,webUrl:weburl}
        getActiveItem(sharedata)
        changeModalState(true)
    }

    // Function to clear data if previous state changed

    const prevNews = usePrevious(props.whichNews);
    console.log("Previous News",prevNews)
    function usePrevious(value) {
        const ref = useRef()
        useEffect(() => {
        if(prevNews != props.whichNews){
           getNewsHeadlines([])
          ref.current = value;
          fetchData()}
        }); // Only re-run if value changes
        return ref.current;
      }

            if (headlineNews.length==0){
                return(
                    <Loader />
                )
            }
            else{
            if((props.whichNews === 'guardian' || props.whichNews === 'Guardian')){
                if(headlineNews.length!=0 && headlineNews[0].hasOwnProperty('blocks')){
                    return (
                        <>
                            <Helper newsData={headlineNews} handleOpen={handleOpen} news="guardian" />
                            <Sharemodal isopenModal={isopenModal} activeItem={activeItem} handleClose={handleClose} />
                        </>
                        );
                    }
                
                    else{
                        return(
                            <Loader />
                        )
                }

}
            else if(props.whichNews == 'nytimes'){
                if(headlineNews.length!=0){
                    return (
                    <>
                        <Helper newsData={headlineNews} handleOpen={handleOpen} news="nytimes" />
                        <Sharemodal isopenModal={isopenModal} activeItem={activeItem} handleClose={handleClose} />
                    </>
                    );
                }
                else{
                        return(
                            <Loader />
                            )
                    } // Else NY Loading end
        } // NY News end
    } // Else end
} // Function end


const mapStateToProps = (state) =>{
    return{
        whichNews : state.newsState
    }
}

export default connect(mapStateToProps)(memo(Home));

