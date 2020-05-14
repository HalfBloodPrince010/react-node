import React from 'react';
import CustomNavbar from './components/Customnavbar';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './components/home';
import World from './components/world';
import Politics from './components/politics';
import Business from './components/business';
import Technology from './components/technology';
import Sports from './components/sports';
import SearchResults from './components/searchResults';
import Detailed from './components/detailed_page';
import Favorites from './components/favorites';
import { connect } from 'react-redux';
import Loader from './components/loading'


class App extends React.Component{
  state= {
    news:"guardian",
    available:false
  }
  changeNews = (news) =>{
    this.setState({news})
  }

  componentDidMount(){
    let favs = window.localStorage.getItem('favoriteData')
    if (!favs){
    window.localStorage.setItem('favoriteData',[])
    }
    else{
      if(favs.length == 0){
        window.localStorage.setItem('favoriteData',[])
      }
    }
    console.log("Setting local storage")
    console.log("Fetching News data")
    let currentNews = window.localStorage.getItem('currentNews')
    if(!currentNews){
      window.localStorage.setItem('currentNews', 'guardian')
      this.props.changeNewsState('guardian')
      this.setState({
        available:true
      })
    }
    else{
      this.props.changeNewsState(currentNews)
      this.setState({
        available:true
      })
    }
  }

  render(){
    if(this.state.available){
    return (
          <Router>
            <div className="App" style={{overflowX:'hidden'}}>
            <CustomNavbar newsChange={this.changeNews}/>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/world" component={World}/>
              <Route path="/politics" component={Politics}/>
              <Route path="/business" component={Business}/>
              <Route path="/technology" component={Technology}/>
              <Route path="/sports" component={Sports}/>
              <Route path="/search/:option" component={SearchResults}/>
              <Route path="/detailedarticle/:news/:articleid" component={Detailed}/>
              <Route path="/favorites" component={Favorites}/>
            </Switch>
            </div>
          </Router>
      
    );}
    else{
      return(<Loader />)
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
  changeNewsState : (newsValue) => { dispatch({type: 'CHANGE_NEWS', newsValue: newsValue})}
  }
}

export default connect(null,mapDispatchToProps)(App);
