import React, { useState, useEffect, memo } from 'react'
import {Card, Col, Row, Badge, Modal, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './search.css';
import './detailed_page.css';
import axios from 'axios';
import BounceLoader from "react-spinners/BounceLoader";
import {FacebookShareButton, TwitterShareButton, EmailShareButton} from 'react-share';
import {EmailIcon,FacebookIcon,TwitterIcon} from 'react-share';
import {IoMdShare} from 'react-icons/io'
import { connect } from 'react-redux';
import Truncate from 'react-truncate';
import Loader from './loading'

const SearchResults = props => {
    const [searchResults, setResults] = useState([])
    const [newsAvailable, setNewsAvailable] = useState(false) 
    const [activeItem, getActiveItem] = useState("")
    const [isopenModal, changeModalState] = useState(false)
    // const [searchWord, setSearchWord] = useState("")

    // setSearchWord(searchWord)
    const fetchData = () => {
        if(props.whichNews  === 'guardian' || props.whichNews === 'Guardian'){
        let url = 'http://reactnodenewsapplication-env.eba-ni6taxhj.us-east-1.elasticbeanstalk.com/searchResults/' + props.match.params.option
        axios.get(url)
        .then(responseData => {
            setResults(responseData.data)
            setNewsAvailable(true)

        })
        .catch(responseData=>{
            console.log("ERROR from Search Results");
            })
        }
        else{
        let url = 'http://reactnodenewsapplication-env.eba-ni6taxhj.us-east-1.elasticbeanstalk.com/searchResults/nytimes/' + props.match.params.option
        axios.get(url)
        .then(responseData => {
            console.log("NYT search", responseData.data.docs)
            setResults(responseData.data.docs)
            setNewsAvailable(true)

        })
        .catch(responseData=>{
            console.log("ERROR from Search Results");
            })
        }
    }

    useEffect(() => {
        fetchData()
    },[props.match.params.option])


    // Handling modal for sharing

    const handleClose = () =>{
        changeModalState(false)
    }

    const handleOpen = (title, weburl) =>{
        console.log("Calling hanfleopen")
        let sharedata = {title:title,webUrl:weburl}
        getActiveItem(sharedata)
        changeModalState(true)
    }


        if (!newsAvailable){
            return(
                <Loader />
            )
        }
        else{
        if(props.whichNews  === 'guardian' || props.whichNews === 'Guardian'){
        const newsCards = searchResults.map(news => {
                    // const newsBadge = news.sectionId.toUpperCase();
                    let color = ""
                    let text_color = "white"
                    if(news.sectionId == 'sport' || news.sectionId == 'Sport'){
                        color = '#f6c244';
                        text_color = 'black';
                    }
                    else if(news.sectionId == 'world' || news.sectionId == 'World'){
                        color = '#7c4eff';
                    }
                    else if(news.sectionId == 'technology' || news.sectionId == 'Technology'){
                        color = '#cedc39';
                        text_color = 'black';
                    }
                    else if(news.sectionId == 'politics' || news.sectionId == 'Politics'){
                        color = '#419488';
                    }
                    else if(news.sectionId == 'business'|| news.sectionId == 'Business'){
                        color = '#4696ec';
                    }
                    else {
                        color = '#6e757c';
                        text_color = 'white'
                    }
                    if(!news.blocks.main.elements[0].assets.length == 0){
                    const newsTitle = news.webTitle;
                    const newsDescription = news.blocks.body[0].bodyTextSummary;
                    const newsImage = news.blocks.main.elements[0].assets[news.blocks.main.elements[0].assets.length-1].file;
                    let newsDate = news.webPublicationDate;
                    newsDate = newsDate.slice(0,10)
                    let newsShareUrl = news.webUrl;
                    let newsBadge = ""
                    if(news.hasOwnProperty('sectionId')){
                        newsBadge = news.sectionId.toUpperCase()?news.sectionId.toUpperCase():"NONE"
                    }
                    else{
                        newsBadge = "NONE"
                    }
                    // let newsBadge = news.sectionId.toUpperCase()
                    const newsId = news.id;
                    return (
                        <Col lg={3} sm={12}>
                            <Link to={{ pathname: '/detailedarticle/gua/' + newsId }} style={{ width:'100%', display:'block', textDecoration: 'none', color:'inherit' }}>
                            <Card className="SearchCard">
                            <Card.Body>
                            <Card.Title style={{fontSize:'15px'}}><Truncate lines={2}>{newsTitle}</Truncate><Link style={{position:'relative', textDecoration: 'none', color:'inherit',height:'15px', paddingLeft:'5px'}} onClick={()=>handleOpen(newsTitle, newsShareUrl )}><IoMdShare/></Link>
                            </Card.Title>
                                <Card.Img variant="top" src={newsImage} className="SearchCardImg"/>
                                <Card.Text className="mt-2">
                                    <span><em>{newsDate}</em></span>
                                    <Badge style={{color:text_color, backgroundColor:color}} className="float-right">
                                        {newsBadge}
                                    </Badge>
                                </Card.Text>
                            </Card.Body>
                            </Card >
                            </Link>
                        </Col>
                        )
                    }
                })
        return (
        <>
        <div style={{marginLeft:'20px', marginRight:'20px'}}>
                <h2 style={{marginTop:'3px', marginBottom:'0px'}}>Results</h2>
                <Row>
                    {newsCards}
                </Row>
        </div>
        <Modal show={isopenModal} onHide={()=>handleClose()}>
                <Modal.Header closeButton>
                    <Modal.Title>{activeItem.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{marginTop:'1px',marginBottom:'1px', paddingBottom:'0px', fontSize:'20px'}} className="d-flex justify-content-center"><b>Share via</b></Modal.Body>
                <Modal.Body className="d-flex justify-content-between">
                <FacebookShareButton url={activeItem.webUrl} hashtag='CSCI_571_NewsApp' className="share">
                    <FacebookIcon size={70} className='float-left' round={true}/>
                </FacebookShareButton>
                <TwitterShareButton url={activeItem.webUrl} hashtags={['CSCI_571_NewsApp']}>
                    <TwitterIcon size={70} round={true}/>
                </TwitterShareButton>
                <EmailShareButton url={activeItem.webUrl} subject='#CSCI_571_NewsApp'>
                    <EmailIcon size={70} className='float-right' round={true}/>
                </EmailShareButton>
                </Modal.Body>
        </Modal>
        </>
        );
    } // IF - Guardian
    else if(props.whichNews == 'nytimes'){
        if(searchResults){
            const newsCards = searchResults.map(news => {
            let color = ""
            let text_color = "white"
            if(news.news_desk == 'sports'|| news.news_desk == 'Sports'){
                color = '#f6c244';
                text_color = 'black';
            }
            else if(news.news_desk == 'world' || news.news_desk == 'World'){
                color = '#7c4eff';
            }
            else if(news.news_desk == 'technology' || news.news_desk == 'Technology'){
                color = '#cedc39';
                text_color = 'black';
            }
            else if(news.news_desk == 'politics' || news.news_desk == 'Politics'){
                color = '#419488';
            }
            else if(news.news_desk == 'business' || news.news_desk == 'Business'){
                color = '#4696ec';
            }
            else {
                color = '#6e757c';
                text_color = 'white'
            }
            let newsTitle =  news.hasOwnProperty('multimedia') && news.hasOwnProperty('headline')? news.headline.main : ""
            let newsImage = []
            if(news.multimedia){
            if(news.hasOwnProperty('multimedia') && news.hasOwnProperty('headline') && news.multimedia.length!=0) {
                    let imageList = news.multimedia.filter(image => image.width>=2000)
                    // console.log("yes", imageList)
                    newsImage = imageList.length==0?["https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"]:['https://static01.nyt.com/'+imageList[0].url]
                    // console.log("post", imageList)
            }
            else{
                newsImage = ["https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"]
            }
        }
        else{
            newsImage = ["https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"]
        }

        newsImage = newsImage[0]
        let newsDate = news.pub_date
        newsDate = newsDate.slice(0,10)
        let newsId = news.web_url
        let newsShareUrl = news.web_url
        let newsBadge = ""
        if(news.hasOwnProperty('news_desk')){
        newsBadge = news.news_desk.toUpperCase()?news.news_desk.toUpperCase():"NONE"
        }
        else{
            newsBadge = "NONE"
        }
        return (
            <Col lg={3} sm={12}>
                <Link to={{ pathname: '/detailedarticle/nyt/' + newsId }} style={{ width:'100%', display:'block', textDecoration: 'none', color:'inherit' }}>
                    <Card className="SearchCard">
                        <Card.Body>
                            <Card.Title style={{fontSize:'15px'}}><Truncate lines={2}><em>{newsTitle}</em></Truncate><Link style={{position:'relative', backgroundColor:'white', border:'none'}} onClick={()=>handleOpen(newsTitle, newsShareUrl)}><IoMdShare style={{color:'black'}}/></Link></Card.Title>
                            <Card.Img variant="top" src={newsImage} className="SearchCardImg"/>
                            <Card.Text className="mt-2">
                                <span><em>{newsDate}</em></span>
                                    <Badge style={{color:text_color, backgroundColor:color}} className="float-right">
                                        {newsBadge}
                                    </Badge>
                            </Card.Text>
                        </Card.Body>
                    </Card >
                </Link>
            </Col>
            )
        })// MAP
        return (
            <>
            <div style={{marginLeft:'20px', marginRight:'20px'}}>
                    <h2 style={{marginTop:'3px', marginBottom:'0px'}}>Results</h2>
                    <Row>
                        {newsCards}
                    </Row>
            </div>
            <Modal show={isopenModal} onHide={()=>handleClose()}>
                    <Modal.Header closeButton>
                        <Modal.Title>{activeItem.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{marginTop:'1px',marginBottom:'1px', paddingBottom:'0px', fontSize:'20px'}} className="d-flex justify-content-center"><b>Share via</b></Modal.Body>
                    <Modal.Body className="d-flex justify-content-between">
                        <FacebookShareButton url={activeItem.webUrl} hashtag='CSCI_571_NewsApp' className="share">
                            <FacebookIcon size={70} className='float-left' round={true}/>
                        </FacebookShareButton>
                        <TwitterShareButton url={activeItem.webUrl} hashtags={['CSCI_571_NewsApp']}>
                            <TwitterIcon size={70} round={true}/>
                        </TwitterShareButton>
                        <EmailShareButton url={activeItem.webUrl} subject='#CSCI_571_NewsApp'>
                            <EmailIcon size={70} className='float-right' round={true}/>
                        </EmailShareButton>
                    </Modal.Body>
            </Modal>
            </>
            );
        } // Data Present
    else{
        return(<div>No Results</div>)
    }
    
    }
    } // Main else
} // Function

const mapStateToProps = (state) =>{
    return{
        whichNews : state.newsState
    }
}



export default connect(mapStateToProps)(memo(SearchResults));