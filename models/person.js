const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
/* eslint-disable no-unused-vars */
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
/* eslint-enable no-unused-vars */

const phoneNumberValidator = {
  validator: function(value) {
    return /^(\d{2,3})-(\d{7,})$/.test(value)
  },
  message: props => `${props.value} number not valid! Format should be XX-XXXXXXXXX or XXX-XXXXXXXXX.`
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: phoneNumberValidator,
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)