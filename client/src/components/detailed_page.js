import React, { Component } from 'react'
import {Card, Col, Row, Badge, Button, Accordion} from 'react-bootstrap';
import './detailed_page.css';
import axios from 'axios';
import {FacebookShareButton, TwitterShareButton, EmailShareButton} from 'react-share';
import {EmailIcon,FacebookIcon,TwitterIcon} from 'react-share';
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import PageWithComments from './comments';
import { connect } from 'react-redux';
import {FaRegBookmark} from 'react-icons/fa';
import {FaBookmark} from 'react-icons/fa';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import BounceLoader from "react-spinners/BounceLoader";
import ReactTooltip from 'react-tooltip'
import { Zoom } from 'react-toastify';
import Loader from './loading'
import {animateScroll as Scroll, scroller, Element} from 'react-scroll';


class Detailed extends Component{
    state= {
        id : "",
        toggleMenuDown : 'flex',
        toggleMenuUp : 'none',
        articleDetails: null,
        articleAvailable: false,
        bookmarkset : false,
        articleNewsSource : ""
    }
// Toggle for News Description
    handleToggle = () =>{
        let down = this.state.toggleMenuUp 
        let up = this.state.toggleMenuDown 
        this.setState({
            toggleMenuDown : down,
            toggleMenuUp : up
        })
        if(this.state.toggleMenuUp !== 'none'){
            Scroll.scrollToTop({
                smooth: true,
            })
        }
        else{
            scroller.scrollTo('scroll_till_here',{
                smooth: true,
            })
        }
    }
// Getting the article Data

    componentWillMount(){
        let urlPath = window.location.pathname
        let urlPathId = urlPath.slice(21)
        let urlNews = this.props.match.params.news
        console.log("From news", urlNews)
        console.log("URL PARAMETERS",urlPathId)
        // Checkin if bookmarked or not
        let dataFetch = localStorage.getItem('favoriteData')
        let localData = dataFetch.length!=0?JSON.parse(dataFetch):[]
        console.log("Bookmark local data", localData)
        if (localData.length!=0){
            let filteredData = localData.filter(article=>article.id==urlPathId)
            console.log("Bookmarked filter data", filteredData)
            if(filteredData.length==0){
                this.setState({
                    bookmarkset : false,
                })
            }
            else{
                this.setState({
                    bookmarkset : true,
                })
            }
        }
        else{
        this.setState({
            bookmarkset : false,
        })
        }

        this.setState({
            id:urlPathId,
        })

        console.log("Its coming from this message,use this",this.props.match.params.news )
        if(urlNews == 'gua'){
            console.log("Inside Axios")
        let url = 'http://reactnodenewsapplication-env.eba-ni6taxhj.us-east-1.elasticbeanstalk.com/article/' + urlPathId
        axios.get(url)
            .then(responseData => {
                console.log(responseData.data);
                this.setState({
                    articleDetails : responseData.data,
                    articleAvailable : true
                })
            })
            .catch(responseData=>{
                console.log("error");
            })
        }
        else if(urlNews == 'nyt'){
        let url = 'http://reactnodenewsapplication-env.eba-ni6taxhj.us-east-1.elasticbeanstalk.com/nyarticle/' + urlPathId
        axios.get(url)
            .then(responseData => {
                console.log("NY ARTICLE",responseData.data);
                this.setState({
                    articleDetails : responseData.data,
                    articleAvailable : true
                })
            })
            .catch(responseData=>{
                console.log("error");
            })

        }
    }

// Handling Bookmark

    handleBookmark = (e,title, image, news, date, section, shareurl) =>{
        let localdataFetch = localStorage.getItem('favoriteData')
        let localdata = localdataFetch?JSON.parse(localdataFetch):[]
        if(localdata.length != 0){
        let fetchArticle = localdata.filter(f_article =>{return f_article.id === this.state.id})
        console.log("Article Fetched",fetchArticle)
        let alreadyThere = fetchArticle.length>0?true:false
        console.log("There",alreadyThere)

        if(alreadyThere){
            // Remove it
            this.setState({
                bookmarkset:false
            })
            let toastData = 'Removing-' + title.articleTitle
            toast(toastData)
            let data = localdata.filter(f_article =>{
                console.log("f_article",f_article.id)
                return f_article.id != this.state.id})
            console.log("Already Present-So removing", data)
            localStorage.setItem('favoriteData', JSON.stringify(data))

        }
        else{
            this.setState({
                bookmarkset:true
            })
            let toastData = 'Saving-' + title.articleTitle
            toast(toastData)
            let favoriteTitle = title.articleTitle
            let favoriteImage = image.articleImage
            let favoriteDate = date.articleDate
            let favoriteNews = news
            let favoriteId = this.state.id
            let favoriteSection = section.articleSection
            let favoriteShare = shareurl.articleUrl
            console.log("detailed:shareurl", favoriteShare)
            // Add article
            let data = [...localdata, {title:favoriteTitle,image:favoriteImage,date:favoriteDate,news:favoriteNews,id:favoriteId,section:favoriteSection, shareurl:favoriteShare}]
            console.log("Not There- So adding",data)
            localStorage.setItem('favoriteData', JSON.stringify(data))
        }
    
    }
    else{
        this.setState({
            bookmarkset:true
        })
        let toastData = 'Saving-' + title.articleTitle
        toast(toastData)
        let favoriteTitle = title.articleTitle
        let favoriteImage = image.articleImage
        let favoriteDate = date.articleDate
        let favoriteNews = news
        let favoriteId = this.state.id
        let favoriteSection = section.articleSection
        let favoriteShare = shareurl.articleUrl
        console.log("detailed:shareurl", favoriteShare)
        // Add article
        let data = [...localdata, {title:favoriteTitle,image:favoriteImage,date:favoriteDate,news:favoriteNews,id:favoriteId,section:favoriteSection,shareurl:favoriteShare}]
        console.log("No data- So adding 1st Element", data)
        localStorage.setItem('favoriteData', JSON.stringify(data))

    }
}
    render(){
        console.log("Id thats been sent to commentBox", this.props.match.params.articleid)
        let bookmarkButtonG = ""
        let bookmarkButtonN = ""
        console.log("Bookmarked:",this.state.bookmarkset)
        if (!this.state.articleAvailable){
            return(
                <Loader />
            )
        }
        else{
            if(this.props.match.params.news == 'gua'){
            console.log("inside render->ArticleDetails", this.state.articleDetails)
            const articleObj = this.state.articleDetails
            const articleTitle = articleObj.webTitle
            let imageList = []
                if(articleObj.blocks.main.elements[0].assets.length == 0){
                    imageList = ["https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"]
                }
                else{
                    let filteredList = articleObj.blocks.main.elements[0].assets.filter(image => {
                    return image.typeData.width >= 2000
                    })
                    imageList = filteredList.map(filteredimg=>{
                    return filteredimg.file
                    })
                    if(imageList.length == 0){
                        imageList = ["https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"]
                    }
                }
            const articleImage = imageList[0]
            console.log("Image List",imageList)
            let articleDate = articleObj.webPublicationDate
            articleDate = articleDate.slice(0,10)
            const articleUrl = articleObj.webUrl
            let articleSection = articleObj.sectionId
            const articleDescription = articleObj.blocks.body[0].bodyTextSummary
            let Description = articleDescription.match(/([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g);
            {console.log(Description)}
            if(Description){
                Description = Description
            }
            else{
                Description = "No Description"
                Description = Description.match(/([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g);
            }
            if(this.state.bookmarkset){
                bookmarkButtonG = (<Button data-tip="Bookmark" data-for='detailed_article' onClick={(e)=>this.handleBookmark(e,{articleTitle},{articleImage},'GUARDIAN',{articleDate},{articleSection},{articleUrl})} className="ml-4" style={{backgroundColor:'white', border:'none'}}><span><FaBookmark style={{color:'red'}}/></span></Button>)
            }
            else{
                bookmarkButtonG = (<Button data-tip="Bookmark" data-for='detailed_article' onClick={(e)=>this.handleBookmark(e,{articleTitle},{articleImage},'GUARDIAN',{articleDate},{articleSection},{articleUrl})} className="ml-4" style={{backgroundColor:'white', border:'none'}}><span><FaRegBookmark style={{color:'red'}}/></span></Button>)
            }

            if(Description.length<=4){
            return(
                <>
                    <Col lg={12} sm={12}>
                            <Card className="SearchCard" key={window.location.pathname.slice(17)} style={{borderRadius:'0', boxShadow:'0 6px 20px 0 rgba(0, 0, 0, 0.55)'}}>
                            <Card.Body>
                                <Card.Title><em style={{fontWeight:'initial', fontSize:'20px'}}>{articleTitle}</em>
                                    <Card.Text className="mt-2">
                                        <span><em style={{fontWeight:'initial', fontSize:'15px'}}> {articleDate}</em></span>
                                        <span className="justify-content-end float-right">
                                        <ReactTooltip id='detailed_article' effect="solid" />
                                        <FacebookShareButton url={articleUrl} hashtag='CSCI_571_NewsApp' className="share">
                                            <FacebookIcon data-tip="Facebook" data-for='detailed_article' size={30} round={true}/>
                                        </FacebookShareButton>
                                        <TwitterShareButton url={articleUrl} hashtags={['CSCI_571_NewsApp']}>
                                            <TwitterIcon data-tip="Twitter" data-for='detailed_article' size={30} round={true}/>
                                        </TwitterShareButton>
                                        <EmailShareButton url={articleUrl} subject='#CSCI_571_NewsApp'>
                                            <EmailIcon data-tip="Email" data-for='detailed_article' size={30} round={true}/>
                                        </EmailShareButton>
                                        {bookmarkButtonG}
                                        </span>
                                        <ToastContainer position={toast.POSITION.TOP_CENTER} autoClose={1500} transition={Zoom}/>
                                    </Card.Text>
                                </Card.Title>
                                <Card.Img variant="top" src={articleImage} className="DetailedCardImg"/>
                                <Accordion>
                                    <Card style={{border:'none'}}>
                                        <Card.Body style={{padding:'0px', textAlign:'justify'}}>{articleDescription}</Card.Body>
                                    </Card>
                                </Accordion>
                            </Card.Body>
                            </Card >
                    </Col>
                    <br></br>
                    <PageWithComments id={articleUrl} />
                </>
            )
            }

            // ==========================================================================================================
            else{
                // let card = []
                let i = 0
                let desc_visible = ""
                for(i=0;i<4;i++){
                    desc_visible += Description[i]
                }
                let desc_hidden = ""
                for(i=4;i<Description.length;i++){
                    desc_hidden += Description[i]
                }
                            return(
                                <>
                                <Col lg={12} sm={12}>
                                <Card className="SearchCard" key={window.location.pathname.slice(17)} style={{borderRadius:'0',boxShadow:'0 6px 20px 0 rgba(0, 0, 0, 0.55)'}}>
                                <Card.Body>
                                    <Card.Title><em style={{fontWeight:'initial', fontSize:'20px'}}>{articleTitle}</em>
                                        <Card.Text className="mt-2">
                                            <span><em style={{fontWeight:'initial', fontSize:'15px'}}>{articleDate}</em></span>
                                            <span className="justify-content-end float-right">
                                                <ReactTooltip id="detailed_article" effect="solid" />
                                                <FacebookShareButton url={articleUrl} hashtag='CSCI_571_NewsApp' className="share">
                                                    <FacebookIcon data-tip="Facebook" data-for='detailed_article' size={30} round={true}/>
                                                </FacebookShareButton>
                                                <TwitterShareButton url={articleUrl} hashtags={['CSCI_571_NewsApp']}>
                                                    <TwitterIcon data-tip="Twitter" data-for='detailed_article' size={30} round={true}/>
                                                </TwitterShareButton>
                                                <EmailShareButton url={articleUrl} subject='#CSCI_571_NewsApp'>
                                                    <EmailIcon data-tip="Email" data-for='detailed_article' size={30} round={true}/>
                                                </EmailShareButton>
                                                {bookmarkButtonG}
                                            </span>
                                           <ToastContainer position={toast.POSITION.TOP_CENTER} autoClose={1500} transition={Zoom}/>
                                        </Card.Text>
                                    </Card.Title>
                                    <Card.Img variant="top" src={articleImage} className="DetailedCardImg"/>
                                    <Accordion>
                                        <Card style={{border:'none'}}>
                                            <Card.Body style={{padding:'0px', textAlign:'justify'}}>{desc_visible}</Card.Body>
                                            <Element name="scroll_till_here"></Element>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body style={{padding:'0px', textAlign:'justify'}} id="hidden-desc">{desc_hidden}</Card.Body>
                                            </Accordion.Collapse>
                                            <Card.Header style={{backgroundColor:'white'}}>
                                                <Accordion.Toggle eventKey="0" onClick={()=>{this.handleToggle()}} className="float-right" style={{backgroundColor:'white', border:'none'}}>
                                                    <span style={{display:this.state.toggleMenuDown}}><FaChevronDown/></span>
                                                    <span style={{display:this.state.toggleMenuUp}}><FaChevronUp/></span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                        </Card>
                                    </Accordion>
                                </Card.Body>
                                </Card >
                            </Col>
                            <br></br>
                            <PageWithComments id={articleUrl} />
                            </>
                            )
            }
        }
        else if(this.props.match.params.news === 'nyt'){
            let articleObj = this.state.articleDetails[0]
            // if(articleObj.hasOwnProperty('multimedia') && articleObj.hasOwnProperty('headline') && articleObj.multimedia){
            let articleTitle =  articleObj.hasOwnProperty('multimedia') && articleObj.hasOwnProperty('headline')? articleObj.headline.main : null
            let articleImage = []
            if(articleObj.multimedia){
            if(articleObj.hasOwnProperty('multimedia') && articleObj.hasOwnProperty('headline') && articleObj.multimedia.length!=0) {
                    let imageList = articleObj.multimedia.filter(image => image.width>=2000)
                    console.log("yes", imageList)
                    articleImage = imageList.length==0?["https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"]:['https://static01.nyt.com/'+imageList[0].url]
                    console.log("post", imageList)
            }
            else{
                articleImage = ["https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"]
            }
        }
        else{
            articleImage = ["https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"]
        }
                console.log("img", articleImage)
                articleImage = articleImage[0]
                console.log("Detailed Article Image URL", articleImage)
                let articleDate = articleObj.pub_date
                articleDate = articleDate.slice(0,10)
                let articleUrl = articleObj.web_url
                let articleDescription = articleObj.abstract
                let articleSection = articleObj.section_name
                let Description = articleDescription.match(/([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g);
                {console.log(Description)}
                console.log("article",articleTitle,articleImage,articleDate,articleDescription)
                if(this.state.bookmarkset){
                    bookmarkButtonN = (<Button data-tip="Bookmark" data-for='detailed_article' onClick={(e)=>this.handleBookmark(e,{articleTitle},{articleImage},'NYTIMES',{articleDate},{articleSection},{articleUrl})} className="ml-4" style={{backgroundColor:'white', border:'none'}}><span><FaBookmark style={{color:'red'}}/></span></Button>)
                }
                else{
                    bookmarkButtonN = (<Button data-tip="Bookmark" data-for='detailed_article' onClick={(e)=>this.handleBookmark(e,{articleTitle},{articleImage},'NYTIMES',{articleDate},{articleSection},{articleUrl})} className="ml-4" style={{backgroundColor:'white', border:'none'}}><span><FaRegBookmark style={{color:'red'}}/></span></Button>)
                }
                if(Description.length<=4){
                    console.log("Less than 4")
                return(
                    <>
                        <Col lg={12} sm={12}>
                                <Card className="SearchCard" key={window.location.pathname.slice(17)} style={{borderRadius:'0', boxShadow:'0 6px 20px 0 rgba(0, 0, 0, 0.55)'}}>
                                <Card.Body>
                                    <Card.Title><em style={{fontWeight:'initial', fontSize:'20px'}}>{articleTitle}</em>
                                        <Card.Text className="mt-2">
                                            <span><em style={{fontWeight:'initial', fontSize:'15px'}}> {articleDate}</em></span>
                                            <span className="justify-content-end float-right">
                                            <ReactTooltip id="detailed_article" effect="solid"/>
                                            <FacebookShareButton url={articleUrl} hashtag='CSCI_571_NewsApp' className="share">
                                                <FacebookIcon data-tip="Facebook" data-for='detailed_article' size={30} round={true}/>
                                            </FacebookShareButton>
                                            <TwitterShareButton url={articleUrl} hashtags={['CSCI_571_NewsApp']}>
                                                <TwitterIcon data-tip="Twitter" data-for='detailed_article' size={30} round={true}/>
                                            </TwitterShareButton>
                                            <EmailShareButton url={articleUrl} subject='#CSCI_571_NewsApp'>
                                                <EmailIcon data-tip="Email" data-for='detailed_article' size={30} round={true}/>
                                            </EmailShareButton>
                                            {bookmarkButtonN}
                                            </span>
                                            <ToastContainer position={toast.POSITION.TOP_CENTER} autoClose={1500} transition={Zoom}/>
                                        </Card.Text>
                                    </Card.Title>
                                    <Card.Img variant="top" src={articleImage} className="DetailedCardImg"/>
                                    <Accordion>
                                        <Card style={{border:'none'}}>
                                            <Card.Body style={{padding:'0px', textAlign:'justify'}}>{articleDescription}</Card.Body>
                                        </Card>
                                    </Accordion>
                                </Card.Body>
                                </Card >
                        </Col>
                        <br></br>
                        <PageWithComments id={articleUrl} />
                    </>
                )
        }
    // }
            // ==========================================================================================================
            else{
                let i = 0
                let desc_visible = ""
                for(i=0;i<4;i++){
                    desc_visible += Description[i]
                }
                let desc_hidden = ""
                for(i=4;i<Description.length;i++){
                    desc_hidden += Description[i]
                }
                            return(
                                <>
                                <Col lg={12} sm={12}>
                                <Card className="SearchCard" key={window.location.pathname.slice(17)} style={{borderRadius:'0',boxShadow:'0 6px 20px 0 rgba(0, 0, 0, 0.55)'}}>
                                <Card.Body>
                                    <Card.Title><em style={{fontWeight:'initial', fontSize:'20px'}}>{articleTitle}</em>
                                        <Card.Text className="mt-2">
                                            <span><em style={{fontWeight:'initial', fontSize:'15px'}}>{articleDate}</em></span>
                                            <span className="justify-content-end float-right">
                                                <ReactTooltip id="detailed_article" effect="solid"/>
                                                <FacebookShareButton url={articleUrl} hashtag='CSCI_571_NewsApp' className="share">
                                                    <FacebookIcon data-tip="Facebook" data-for='detailed_article' size={30} round={true}/>
                                                </FacebookShareButton>
                                                <TwitterShareButton url={articleUrl} hashtags={['CSCI_571_NewsApp']}>
                                                    <TwitterIcon data-tip="Twitter" data-for='detailed_article' size={30} round={true}/>
                                                </TwitterShareButton>
                                                <EmailShareButton url={articleUrl} subject='#CSCI_571_NewsApp'>
                                                    <EmailIcon data-tip="Email" data-for='detailed_article' size={30} round={true}/>
                                                </EmailShareButton>
                                                {bookmarkButtonN}
                                            </span> 
                                            <ToastContainer position={toast.POSITION.TOP_CENTER} autoClose={1500} transition={Zoom}/>
                                        </Card.Text>
                                    </Card.Title>
                                    <Card.Img variant="top" src={articleImage} className="DetailedCardImg"/>
                                    <Accordion>
                                        <Card style={{border:'none'}}>
                                            <Card.Body style={{padding:'0px', textAlign:'justify'}}>{desc_visible}</Card.Body>
                                            <Element name="scroll_till_here"></Element>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body style={{padding:'0px', textAlign:'justify'}}>{desc_hidden}</Card.Body>
                                            </Accordion.Collapse>
                                            <Card.Header style={{backgroundColor:'white'}}>
                                                <Accordion.Toggle eventKey="0" onClick={()=>{this.handleToggle()}} className="float-right" style={{backgroundColor:'white', border:'none'}}>
                                                    <span style={{display:this.state.toggleMenuDown}}><FaChevronDown/></span>
                                                    <span style={{display:this.state.toggleMenuUp}}><FaChevronUp/></span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                        </Card>
                                    </Accordion>
                                </Card.Body>
                                </Card >
                            </Col>
                            <br></br>
                            <div>
                            <PageWithComments id={articleUrl} />
                            </div>
                            </>
                        )
            }

        }
    }
}
}

const mapStateToProps = (state) =>{
    return{
        whichNews : state.newsState
    }
}


export default connect(mapStateToProps)(Detailed);
