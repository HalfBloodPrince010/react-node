import React from 'react'
import {Card, Col, Row, Badge, Modal} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './home.css';
import {IoMdShare} from 'react-icons/io'


const Helper = props =>{
    if(props.news == 'guardian'){
        console.log("From Helper:Guardian")
        let newsCards = props.newsData.map(news => {
            let color = "brown"
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
            if(news.blocks.hasOwnProperty('main') && news.hasOwnProperty('webTitle') && news.hasOwnProperty('webPublicationDate') && news.hasOwnProperty('id') && news.hasOwnProperty('webUrl')){
            const newsTitle = news.webTitle;
            const newsDescription = news.blocks.body[0].bodyTextSummary;
            let imageList = []
                if(news.blocks.main.elements[0].assets.length == 0){
                    imageList = ["https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"]
                }
                else{
                    let filteredList = news.blocks.main.elements[0].assets.filter(image => {
                        return image.typeData.width >= 2000
                    })
                    imageList = filteredList.map(filteredimg=>{
                        return filteredimg.file
                    })
                    if(imageList.length == 0){
                        imageList = ["https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"]
                    }
                }
            const newsImage = imageList[0]
            let newsDate = news.webPublicationDate;
            newsDate = newsDate.slice(0,10)
            const newsBadge = news.sectionId.toUpperCase();
            const newsId = news.id;
            const newsShareUrl = news.webUrl;
            return (
                <Link to={{ pathname: '/detailedarticle/gua/' + newsId }} style={{ width:'100%', display:'block', textDecoration: 'none', color:'inherit' }}>
                <div className="HomepageCard">
                <Card style={{ width: '100%', marginTop:'30px', marginBottom:'30px', boxShadow:'0 6px 20px 0 rgba(0, 0, 0, 0.55)' }} >
                        <Row>
                            <Col lg={3} xs={12} className="mr-0 ml-0" align="center">
                                <Card.Img className="img-responsive" variant="top" src={newsImage} style={{ padding: '6px', border:'1px solid lightgray', margin:'10px', height:'200px', width:'90%', borderBottomLeftRadius: 'calc(.25rem - 1px)', borderBottomRightRadius: 'calc(.25rem - 1px)' }} />
                            </Col>
                            <Col lg={9} xs={12} className="mr-0 ml-0">
                                <Card.Body>
                                    <Card.Title><em>{newsTitle}<Link style={{position:'relative', textDecoration: 'none', color:'inherit'}} onClick={()=>props.handleOpen(newsTitle, newsShareUrl)}><IoMdShare/></Link></em></Card.Title>
                                    <Card.Text className="news-description">
                                        {newsDescription}
                                    </Card.Text>
                                    <Card.Text>
                                    <span> <em>{newsDate}</em> </span>
                                    <Badge style={{backgroundColor: color, color:text_color}} className="float-right">
                                        {newsBadge}
                                    </Badge>
                                    </Card.Text>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                </div>
                </Link>
                )
            }
        })
        console.log("From Helper NewsCards:", newsCards.length)
        // Checking for newsCard length to display only first 10
        if(newsCards.length > 10){
        return (newsCards.slice(0,10))
        }
        else{
            return newsCards
        }
    }
    else{
        console.log("From Helper:NYTimes")
        let newsCards = props.newsData.map(news => {
            let color = "brown"
            let text_color = "white"
            if(news.section == 'sports'|| news.section == 'Sports'){
                color = '#f6c244';
                text_color = 'black';
            }
            else if(news.section == 'world' || news.section == 'World'){
                color = '#7c4eff';
            }
            else if(news.section == 'technology' || news.section == 'Technology'){
                color = '#cedc39';
                text_color = 'black';
            }
            else if(news.section == 'politics' || news.section == 'Politics'){
                color = '#419488';
            }
            else if(news.section == 'business' || news.section == 'Business'){
                color = '#4696ec';
            }
            else {
                color = '#6e757c';
                text_color = 'white'
            }
            let count = 0
            if(news.hasOwnProperty('multimedia') && news.hasOwnProperty('title') && news.hasOwnProperty('abstract') && news.hasOwnProperty('published_date') && news.hasOwnProperty('url')){
            const newsTitle = news.title;
            const newsDescription = news.abstract;
            let imageList = []
            if (news.multimedia){
                if(news.multimedia.length == 0){
                    imageList = ["https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"]
                }
                else{
                    imageList = news.multimedia.filter(image => image.width>=2000)
                    imageList = imageList.length==0?["https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"]:[imageList[0].url]
                }
            }
            else{
                imageList = ["https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"]
            }
            const newsImage = imageList[0]
            let newsDate = news.published_date;
            newsDate = newsDate.slice(0,10)
            const newsBadge = news.section.toUpperCase();
            const newsId = news.url;
            const newsShareUrl = news.url;
            return (
                <Link to={{ pathname: '/detailedarticle/nyt/' + newsId }} style={{ width:'100%', display:'block', textDecoration: 'none', color:'inherit' }}>
                <div className="HomepageCard">
                <Card style={{ width: '100%', marginTop:'30px', marginBottom:'30px', boxShadow:'0 6px 20px 0 rgba(0, 0, 0, 0.55)' }} >
                        <Row>
                            <Col lg={3} xs={12} className="mr-0 ml-0" align="center">
                                <Card.Img className="img-responsive" variant="top" src={newsImage} style={{ padding: '6px', border:'1px solid lightgray', margin:'10px', height:'200px', width:'90%', borderBottomLeftRadius: 'calc(.25rem - 1px)', borderBottomRightRadius: 'calc(.25rem - 1px)' }} />
                            </Col>
                            <Col lg={9} xs={12} className="mr-0 ml-0">
                                <Card.Body>
                                    <Card.Title><em>{newsTitle}<Link style={{position:'relative', textDecoration: 'none', color:'inherit'}} onClick={()=>props.handleOpen(newsTitle, newsShareUrl)}><IoMdShare/></Link></em></Card.Title>
                                    <Card.Text className="news-description">
                                        {newsDescription}
                                    </Card.Text>
                                    <Card.Text>
                                    <span> <em>{newsDate}</em> </span>
                                    <Badge style={{backgroundColor: color, color:text_color}} className="float-right">
                                        {newsBadge}
                                    </Badge>
                                    </Card.Text>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                </div>
                </Link>
                )
            }
        })
        console.log("From Helper NewsCards:", newsCards.slice(0,10))
        if(newsCards.length > 10){
        return (newsCards.slice(0,10))
        }
        else{
            return newsCards
        }
    }
}

export default(Helper)