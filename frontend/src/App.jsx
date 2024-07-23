import React, { useState, useEffect } from 'react'
import Filters from './components/Filters'
import Notification from './components/Notification'
import Persons from './components/Persons'
import PersonForm, { addNote } from './components/PersonForm'
import personService from './services/persons'
import './Notifications.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [changeMessage, setChangeMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [deleteMessage, setDeleteMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService.getAll()
      .then(data => {
        setPersons(data)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
        setErrorMessage('Error fetching data from the server')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    addNote({ newName, newNumber, persons, setPersons, setNewName, setNewNumber, setSuccessMessage, setChangeMessage, setErrorMessage })
  }

  return (
    <div>
      <Notification message={changeMessage} type="change" />
      <Notification message={successMessage} type="success" />
      <Notification message={deleteMessage} type="delete" />
      <Notification message={errorMessage} type="error" />
      <h2>Phonebook</h2>
      <Filters filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit} />
      <Persons 
        persons={persons} 
        filter={filter} 
        setPersons={setPersons}
        setDeleteMessage={setDeleteMessage}
        setErrorMessage={setErrorMessage} />
    </div>
  )
}

export default App
