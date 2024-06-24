require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
app.use(express.json());
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))
const Person = require('./models/person');

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

let persons = [
    {
      id: "1",
      name: "HTML is easy",
      number: "123"
    }
  ]

  morgan.token('body', (req, res) => {
    if (req.body) {
        return JSON.stringify(req.body);
    }
    return;
});

const tinyJson = ':method :url :status :res[content-length] - :response-time ms :body';

app.use(morgan(tinyJson));

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }
  
  app.get('/api/info', (request, response) => {
    const personCount = persons.length;
    const currentDate = new Date();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
    response.send(`
      <p>There are ${personCount} persons in phonebook.</p>
      <p>${currentDate} ${timeZone}.</p>
    `);
  });

  app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons);
    })
  })

  app.get('/api/persons/:id', (request, response)  => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
      if (person) {
        response.json(person)
      } else {
      response.status(404).end()
    }
  })
  })

  app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
      .then(() => {
        response.status(204).end();
      })
  });

  app.put('/api/persons/:id', (req, res) => {
    const updatedData = req.body;
    const personIndex = persons.findIndex(person => person.id === updatedData.id);
  
    if (personIndex === -1) {
      return res.status(404).json({ error: 'Person not found' });
    }
  
    const updatedPerson = { ...persons[personIndex], ...updatedData };
    persons[personIndex] = updatedPerson;
  
    res.status(200).json(updatedPerson);
  });
  

  app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Number or Name missing' 
      })
    }

    const personExists = persons.some(person => person.name === body.name);

    if (personExists) {
      return response.status(400).json({
        error: 'Person already exists'
      });
    }

    const newPerson = new Person({
      name: body.name,
      number: body.number,
    });

    newPerson.save()
      .then(savedPerson => {
        response.json(savedPerson);
    
  })
    
  })