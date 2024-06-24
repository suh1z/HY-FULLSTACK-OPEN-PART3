require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')


app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

let persons = [
  {
    id: '1',
    name: 'HTML is easy',
    number: '123'
  }
]

morgan.token('body', (req) => {
  if (req.body) {
    return JSON.stringify(req.body)
  }
  return
})

const tinyJson = ':method :url :status :res[content-length] - :response-time ms :body'

app.use(morgan(tinyJson))

app.get('/api/info', (request, response) => {
  const personCount = persons.length
  const currentDate = new Date()
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  response.send(`
    <p>There are ${personCount} persons in phonebook.</p>
    <p>${currentDate} ${timeZone}.</p>
  `)
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next)  => {
  Person.findById(request.params.id).then(person => {
    response.json(person)

  })
    .catch(error => next(error))
})

/* eslint-disable no-unused-vars */
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
/* eslint-enable no-unused-vars */

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  const updatedData = { name, number }

  Person.findByIdAndUpdate(request.params.id, updatedData,
    { new: true, runValidators: true, context: 'query' })

    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  Person.findOne({ name: body.name }).then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({ error: 'Person already exists' })
    }
    const newPerson = new Person({
      name: body.name,
      number: body.number,
    })

    newPerson.save()
      .then(savedPerson => {
        response.json(savedPerson)
      })
      .catch(error => next(error))
  })
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)