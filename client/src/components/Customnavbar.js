import React, { Component } from 'react';
import {Link, NavLink, withRouter} from 'react-router-dom';
import {Button, Nav, Navbar, NavDropdown, Form, FormControl, Dropdown} from 'react-bootstrap';
import './navbar.css';
import axios from 'axios';
import _ from 'lodash';
import Select from 'react-select';
import { connect } from 'react-redux';
import  {FaBookmark} from 'react-icons/fa';
import {FaRegBookmark} from 'react-icons/fa';
import Switch from "react-switch";
import ReactTooltip from 'react-tooltip'

class CustomNavbar extends Component{
  state= {
        searchWord : "",
        searchResults : [],
        searchingWord : "",
        news : ""
    }


  onsearch = (selectedOption) =>{
    if (selectedOption.value) {
      let word = selectedOption.value;
      this.setState({ searchWord: word, searchResults:[] })
      console.log("setting state word", this.state.searchWord)
      this.props.history.push({
          pathname: "/search/"+ word,
          state: { searchWord: word }
      });
  } else {
      alert("No Text Entered");
  }
}

handleSearch = (inputValue) =>{
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Ocp-Apim-Subscription-Key':'[AUTOSUGGEST-API]'
        
        }
        { console.log("Input",inputValue) }
        this.setState({
          searchWord : inputValue
        })
        if(inputValue.length>0){
        let url = `https://api.cognitive.microsoft.com/bing/v7.0/suggestions?q=${inputValue}`;
        axios.get(url, {headers:headers})
        .then(responseData => {
            let results = responseData.data.suggestionGroups[0].searchSuggestions
            const searchResults = results.map(result => ({ value: result.displayText, label: result.displayText }));
            this.setState({ searchResults })
            console.log("results",this.state.searchResults)
            return searchResults
          })
        .catch(responseData=>{
            console.log("ERROR from Search Results", responseData); 
        })
      }
    }


handleSwitchChange=()=>{
  if(this.props.whichNews === 'guardian' || this.props.whichNews === 'Guardian'){
    console.log("changing from", this.state.news,"to nytimes")
    this.setState({news:'nytimes'})
    this.props.changeNewsState('nytimes')
    localStorage.setItem('currentNews','nytimes')
  }
  else{
    console.log("changing from", this.state.news,"to guardian")
    this.setState({news:'guardian'})
    this.props.changeNewsState('guardian')
    localStorage.setItem('currentNews','guardian')
  }
}

handleFavorites=()=>{
  console.log("Going to Bookmarks")
  ReactTooltip.hide();
  this.props.history.push({
    pathname: "/favorites"
  })
}

handleclick=(event)=>{
  // alert('Clicked..')
  event.target.style.color = 'white'
}

  render(){
    console.log("rendering")
    let bookmark = "";
    let switchNews = "";
    let search = ""
    let navbar = ""
    // Navbar

    //Bookmark handling
    if(window.location.pathname == '/favorites'){
      bookmark = (<Button className='mr-auto mb-2' data-tip="Bookmark" data-for="bookmark" onClick={()=>this.handleFavorites()} style={{background:'none', border:'none', paddingLeft:'0px'}}><FaBookmark style={{ height:'20px', width:'20px', color:'white'}}/></Button>)
    }
    else if( window.location.pathname.includes('/search') || window.location.pathname.includes('/detailedarticle')){
      bookmark = (<Button className='mr-auto mb-2' data-tip="Bookmark" data-for="bookmark" onClick={()=>this.handleFavorites()} style={{background:'none', border:'none', paddingLeft:'0px'}}><FaRegBookmark style={{ height:'20px', width:'20px', color:'white'}}/></Button>)
    }
    else{
      bookmark = (<Button className='mr-auto mb-2 mr-lg-4' data-tip="Bookmark" data-for="bookmark"  onClick={()=>this.handleFavorites()} style={{background:'none', border:'none', paddingLeft:'0px'}}><FaRegBookmark style={{ height:'20px', width:'20px', color:'white'}}/></Button>)
    }
    // Switch Handling
    if(window.location.pathname == '/favorites' ||  window.location.pathname.includes('/search') || window.location.pathname.includes('/detailedarticle')){
      switchNews = ""
    }
    else{
      if(this.props.whichNews === 'nytimes'){
      switchNews = (
            <>
              <Navbar.Text className="mr-sm-2"> NY Times </Navbar.Text>
              <Form inline>
                  <Switch
                  onChange={this.handleSwitchChange}
                  checked={false}
                  className="react-switch"
                  uncheckedIcon={false}
                  checkedIcon={false}
                  height={25}
                  width={45}
                  />
              </Form>
              <Navbar.Text className="mr-sm-2 ml-lg-2"> Guardian </Navbar.Text>
            </>
      )
    }
      else{
        switchNews = (
          <>
            <Navbar.Text className="mr-sm-2"> NY Times </Navbar.Text>
            <Form inline>
                <Switch
                  onChange={this.handleSwitchChange}
                  checked={true}
                  className="react-switch"
                  uncheckedIcon={false}
                  checkedIcon={false}
                  height={25}
                  width={45}
                  onColor= "#4696ec"
                />
            </Form>
            <Navbar.Text className="mr-sm-2 ml-lg-2"> Guardian </Navbar.Text>
          </>
    )
  }
}
  if (window.location.pathname.includes('/search')){
    search = (
            <Select className="CustomSearchBar"
            onInputChange={_.debounce(this.handleSearch, 500)}
            onChange={this.onsearch}
            options = { this.state.searchResults }
            placeholder="Enter Keyword .."
            value = { this.props.match.params.option }
            noOptionsMessage = {({ inputValue: string }) => "No Match"}
            />
            )
  }
  else{
  search = (
            <Select className="CustomSearchBar"
            onInputChange={_.debounce(this.handleSearch, 500)}
            onChange={this.onsearch}
            value = ""
            options = { this.state.searchResults }
            placeholder="Enter Keyword .."
            noOptionsMessage = {({ inputValue: string }) => "No Match"}
            />
            )
  }
      return(
      // On small it collapses 
          <Navbar className="bg-custom" expand="sm" variant="dark">
            {search}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto" defaultActiveKey="/">
                <Nav.Link exact={true} style={{color:'rgba(255,255,255,.5)'}} as={NavLink} to="/" href="/" activeStyle={{background: 'none',color: 'white'}}>Home</Nav.Link>
                <Nav.Link as={NavLink} style={{color:'rgba(255,255,255,.5)'}} to="/world" href="/world" activeStyle={{background: 'none',color: 'white'}}>World</Nav.Link>
                <Nav.Link as={NavLink} style={{color:'rgba(255,255,255,.5)'}} to="/politics" href="/politics" activeStyle={{background: 'none',color: 'white'}}>Politics</Nav.Link>
                <Nav.Link as={NavLink} style={{color:'rgba(255,255,255,.5)'}} to="/business" href="/business" activeStyle={{background: 'none',color: 'white'}}>Business</Nav.Link>
                <Nav.Link as={NavLink} style={{color:'rgba(255,255,255,.5)'}} to="/technology" href="/technology" activeStyle={{background: 'none',color: 'white'}}>Technology</Nav.Link>
                <Nav.Link as={NavLink} style={{color:'rgba(255,255,255,.5)'}} to="/sports" href="/sports" activeStyle={{background: 'none',color: 'white'}}>Sports</Nav.Link>
              </Nav>
              <Nav>
              {bookmark}
              <ReactTooltip id="bookmark" effect="solid" place="bottom"/>
              {switchNews}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
      )
      }
}


const mapStateToProps = (state) =>{
  return{
      whichNews : state.newsState
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
  changeNewsState : (newsValue) => { dispatch({type: 'CHANGE_NEWS', newsValue: newsValue})}
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(CustomNavbar))

















