const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const Bing = require('node-bing-api')({accKey: 'YOUR_KEY_HERE'})
const apiSearch = require('./models/apiSearch')
const PORT = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/apiSearch')

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

  let sOffset

  if(offset) {
    if(offset === 1) {
      offset = 0
      sOffset = 1
    } else if(offset > 1) {
      sOffset = offset + 1
    }
  }

  Bing.images(search, {
    top: (10 * sOffset),
    skip: (10 * offset)
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
