const express = require('express');
const axios = require('axios');
const cors = require('cors')
const fs = require('fs')


// Creating an application

const app = express();

const PORT = process.env.PORT  || 5000 ;
// Creating route handlers..
app.use(cors())

app.get('/getNewsData', function(req,res){
  fs.readFile('./news.txt', {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    } else {
        console.log(err);
    }
  })
});

app.use(express.json());
app.post('/setNewsdata', function(req,res){
  let dataToWrite = req.body.news
  fs.writeFile("./news.txt",dataToWrite, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
    res.end()
});

})

app.get('/guardian', function(req, res){
  console.log("Inside app-get")
  axios.get('http://content.guardianapis.com/search?api-key=[GUARDIAN-API]&section=(sport|business|technology|politics)&show-blocks=all')
    .then(function (responseData) {
      res.send(responseData.data.response.results);
    })
    .catch(function (error) {
      console.log(error);
    })
  });

  app.get('/nytimes', function(req, res){
    axios.get('https://api.nytimes.com/svc/topstories/v2/home.json?api-key=[NYTIMES-API]')
      .then(function (responseData) {
        res.send(responseData.data.results);
      })
      .catch(function (error) {
        console.log(error);
      })
    });
  
    app.get('/nytimes/:search', function(req, res){
      let section = req.params.search;
      let url = 'https://api.nytimes.com/svc/topstories/v2/' + section +'.json?api-key=[NYTIMES-API]'
      axios.get(url)
        .then(function (responseData) {
          res.send(responseData.data.results);
        })
        .catch(function (error) {
          console.log(error);
        })
      });


app.get('/guardian/:search', function(req, res){
  let section = req.params.search;
  let url = 'http://content.guardianapis.com/' + section + '?api-key=[GUARDIAN-API]&show-blocks=all';
  axios.get(url)
    .then(function (responseData) {
      res.send(responseData.data.response.results);
    })
    .catch(function (error) {
      console.log(error);
    })
  });


app.get('/searchResults/:qword', function(req, res){
  let word = req.params.qword;
  let url = 'https://content.guardianapis.com/search?q=' + word + '&api-key=[GUARDIAN-API]&show-blocks=all';
  axios.get(url)
    .then(function (responseData) {
      res.send(responseData.data.response.results);
    })
    .catch(function (error) {
      console.log(error);
    })
  });


app.get('/searchResults/nytimes/:qword', function(req, res){
  let word = req.params.qword;
  let url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q="+ word +"&api-key=[NYTIMES-API]"
  axios.get(url)
    .then(function (responseData) {
      res.send(responseData.data.response);
    })
    .catch(function (error) {
      console.log(error);
    })
  });



  app.get(/^\/article\/(.*)/, function(req, res){
    let x = req.originalUrl
    let article_id = x.slice(9)
    console.log("Article ID Node",article_id)
    let url = 'https://content.guardianapis.com/' + article_id + '?api-key=[GUARDIAN-API]&show-blocks=all';
    axios.get(url)
      .then(function (responseData) {
        res.send(responseData.data.response.content);
      })
      .catch(function (error) {
        console.log(error);
      })
    });
  
    app.get(/^\/nyarticle\/(.*)/, function(req, res){
      let x = req.originalUrl
      let article_id = x.slice(11)
      console.log("Article ID Node",article_id)
      let url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:(%22"+ article_id +"%22)&api-key=[NYTIMES-API]"
      axios.get(url)
        .then(function (responseData) {
          res.send(responseData.data.response.docs);
        })
        .catch(function (error) {
          console.log(error);
        })
      });


app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`))