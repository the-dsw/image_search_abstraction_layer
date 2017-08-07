const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const Bing = require('node-bing-api')({accKey: 'db63791f74064c3ca3a65570902162f5'})
const apiSearch = require('./models/apiSearch')
const PORT = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

mongoose.connect('mongodb://image:image@ds137540.mlab.com:37540/apisearch')

app.get('/api/latest', (req, res, next)=> {
  apiSearch.find({}, (err, data)=> {
    res.json(data)
  })
})

app.get('/api/imagesearch/:search*', (req, res, next)=> {
  let { search } = req.params
  let { offset } = req.query

  let data = new apiSearch({
    search,
    searchDate: new Date()
  })

  data.save(err => {
    if(err) res.send('error saving to db')

  })



  Bing.images(search, {
    top: 10

  }, function(error, rew, body) {
    let bingArray = []

    for(let i = 0; i < 10; i++) {
      bingArray.push({
        url: body.value[i].webSearchUrl,
        snippet: body.value[i].name,
        thumbnail: body.value[i].thumbnailUrl,
        context: body.value[i].hostPageDisplayUrl
      })
    }

    res.json(bingArray)
  })

})



app.listen(PORT, ()=> {
  console.log('server listen on port ' + PORT)
})
