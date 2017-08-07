const mongoose = require('mongoose')
const Schema = mongoose.Schema

const apiSearchSchema = new Schema(
  {
    search: String,
    searchDate: Date
  },
  {timestamps: true}
)

const ModelClass = mongoose.model('apiSearch', apiSearchSchema)


module.exports = ModelClass
