import React, { useState, useEffect, Component, memo, useReducer } from 'react'
import {Card, Col, Row, Badge, Button,Modal, Container} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './detailed_page.css';
import {FaTrash} from 'react-icons/fa';
import {FacebookShareButton, TwitterShareButton, EmailShareButton} from 'react-share';
import {EmailIcon,FacebookIcon,TwitterIcon} from 'react-share';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import {IoMdShare} from 'react-icons/io'
import { Zoom } from 'react-toastify';
import Truncate from 'react-truncate';
import './search.css'



const favReducer = (state, action) =>{
    switch(action.type){
        case 'REMOVE_ARTICLE':
            let localdataFetch = localStorage.getItem('favoriteData')
            let localdata = localdataFetch?JSON.parse(localdataFetch):[]
            let filterList = localdata.filter(article=>{
                return article.id!=action.id})
            return filterList
    }
}

const Favorites = props =>{
const [favorites, dispatch] = useReducer(favReducer,[],()=>{
    let localdata = localStorage.getItem('favoriteData')
    console.log("Rendering and setting favorites", localdata, localdata.length)
    return localdata?JSON.parse(localdata):[]
})
const [finalArticle, status] = useState({stat:false,articleTitle:""})
const [isopenModal, changeModalState] = useState(false)
const [activeItem, getActiveItem] = useState("")

console.log("From favorites initial",favorites)
// toast("heloo owrl")

const handleClose = () =>{
    changeModalState(false)
}

const handleOpen = (title, weburl, news) =>{
    let sharedata = {title:title,webUrl:weburl, news:news}
    getActiveItem(sharedata)
    changeModalState(true)
}

useEffect(()=>{
    console.log("mouting and getting data")
    let data = favorites.length>0?favorites:[]
    console.log("from useEffect",data)
    if(finalArticle.stat){
        let toastData = 'Removing ' + finalArticle.articleTitle
        toast(toastData)}
    localStorage.setItem('favoriteData', JSON.stringify(data))
}, [favorites])

const handleDelete = (id, toastTitle) =>{
    // Test
    let localdataFetch = localStorage.getItem('favoriteData')
    let localdata = localdataFetch?JSON.parse(localdataFetch):[]
    if(localdata.length == 1){
        console.log("going to be deleted")
        status({stat:true, articleTitle:toastTitle.favoriteTitle})
    }
    // Fixed
    console.log("Removing and running toast")
    let toastData = "Removing" + toastTitle.favoriteTitle
    toast(toastData)
    dispatch({type:'REMOVE_ARTICLE',id:id.favoriteId})
}


if(favorites.length!=0){
console.log("rendering")
let modalNewsTitle = ""
let headerTag = ""
let favoriteList = favorites.map(favorite =>{
            let favoriteTitle = favorite.title
            let favoriteImage = favorite.image
            let favoriteDate =  favorite.date
            let favoriteId = favorite.id
            let fromNews = favorite.news
            console.log("FROM NEWS", fromNews)
            let favoriteUrl = favorite.shareurl
            console.log("Share url:", favoriteUrl)
            let section = favorite.section.toUpperCase()
            let color = ""
            let text_color = "white"
            if(section == 'SPORTS' || section == 'SPORT'){
                color = '#f6c244';
                text_color = 'black';
            }
            else if(section == 'WORLD'){
                color = '#7c4eff';
            }
            else if(section == 'TECHNOLOGY'){
                color = '#cedc39';
                text_color = 'black';
            }
            else if(section == 'POLITICS'){
                color = '#419488';
            }
            else if(section == 'BUSINESS'){
                color = '#4696ec';
            }
            else {
                color = '#6e757c';
            }
            let newsColor = ""
            let newsTextColor = ""
            let newsVal = ""
            modalNewsTitle = fromNews
            console.log("MODAL TITLE", modalNewsTitle)
            if (fromNews=='GUARDIAN'){
                newsColor = "#14284a"
                newsTextColor = "white"
                newsVal = "gua/"
            }
            else{
                newsColor = "#dddddd"
                newsTextColor = "black"
                newsVal = "nyt/"
            }
            return (
                <Col lg={3} sm={12}>
                    <Link to={{ pathname: '/detailedarticle/'+ newsVal + favoriteId ,state: {ArticleId: favoriteId, news:fromNews}}} style={{ width:'100%', display:'block', textDecoration: 'none', color:'inherit' }}>
                    <Card className="SearchCard">
                    <Card.Body>
                        <Card.Title style={{fontSize:'15px'}}><Truncate lines={2} ellipsis={<span>...</span>}>{favoriteTitle}</Truncate><Link style={{position:'relative', textDecoration: 'none', color:'inherit',height:'15px', paddingLeft:'5px'}} onClick={()=>handleOpen(favoriteTitle, favoriteUrl , fromNews)}><IoMdShare/></Link><Link onClick={()=>{handleDelete({favoriteId},{favoriteTitle})}} style={{backgroundColor:'white', border:'none', padding:'1px'}}><FaTrash style={{color:'black',height:'12px', width:'12px', height:'15px' }}/></Link>
                            <ToastContainer position={toast.POSITION.TOP_CENTER} autoClose={1500} transition={Zoom}/>
                        </Card.Title>
                        <Card.Img variant="top" src={favoriteImage} className="SearchCardImg"/>
                        <Card.Text className="mt-2">
                            <span style={{fontSize:'15px'}}><em>{favoriteDate}</em></span>
                            <Badge style={{margin:'2px',color:text_color, backgroundColor:color}} className="float-right">
                                {section}
                            </Badge>
                            <Badge style={{margin:'2px',color:newsTextColor, backgroundColor:newsColor}} className="float-right">
                                {fromNews}
                            </Badge>
                        </Card.Text>
                    </Card.Body>
                    </Card >
                    </Link>
                </Col>
                
            )
        }
    )
    return (
        <>
        <div style={{marginLeft:'20px', marginRight:'20px'}}>
                <h2 style={{marginTop:'3px', marginBottom:'0px'}}>Favorites</h2>
                <Row>
                    {favoriteList}
                </Row>
        </div>
        <Modal show={isopenModal} onHide={()=>handleClose()}>
                <Modal.Header closeButton>
                    <Modal.Title><span style={{fontWeight:'bold'}}>{activeItem.news}</span><br/>{activeItem.title}</Modal.Title>
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
    )
    
}
else{
    console.log("Toasting finished")
    return (
        <>  
            <Container>
            <div><ToastContainer position={toast.POSITION.TOP_CENTER} autoClose={1500} transition={Zoom}></ToastContainer></div>
            <div className="d-flex justify-content-center" style={{fontSize:'25px', height:'400px'}}>
              You have no saved Articles
            </div>
            </Container>
        </>
    )
    

}
}

export default memo(Favorites);

