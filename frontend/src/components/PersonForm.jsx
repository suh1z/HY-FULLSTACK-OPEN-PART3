import React from 'react'
import axios from 'axios'
const baseUrl = '/api/persons'

const addNote = ({ newName, newNumber, persons, setPersons, setNewName, setNewNumber, setErrorMessage, setSuccessMessage, setChangeMessage }) => {
  const existingPerson = persons.find(person => person.name && person.name.toLowerCase() === newName.toLowerCase());
  if (existingPerson) {
    if (window.confirm(`${newName} is already added to the phonebook! Do you want to update the number?`)) {
      const updatedPerson = { id: existingPerson.id, name: existingPerson.name, number: newNumber }

      axios
        .put(`${baseUrl}/${existingPerson.id}`, updatedPerson)
        .then(response => {
          setPersons(persons.map(person => person.id !== existingPerson.id ? person : response.data))
          setNewName('')
          setNewNumber('')
          setChangeMessage(`Changed ${newName}'s number successfully!`)
          setTimeout(() => {
            setChangeMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.error("Update failed:", error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  } else {
    const newPerson = { name: newName, number: newNumber }
    axios
      .post(baseUrl, newPerson)
      .then(response => {
        console.log('Response:', response.data)
        setPersons([...persons, response.data])
        setNewName('')
        setNewNumber('')
        setSuccessMessage(`Added ${newPerson.name} successfully to the Phonebook`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.error('Error adding new person:', error)
        if (error.response) {
          console.error('Server Error:', error.response.data)
          setErrorMessage(error.response.data.error)
        } else {
          console.error('Network Error:', error.message)
          setErrorMessage('Network Error: Unable to connect to the server')
        }
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }
}

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        <label>Number:</label>
        <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <button type="submit">add</button>
    </form>
  )
}

export default PersonForm
export { addNote }
