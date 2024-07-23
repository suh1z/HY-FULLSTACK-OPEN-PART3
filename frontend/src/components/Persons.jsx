import React from 'react'
import axios from 'axios'
const baseUrl = '/api/persons'

const deletePerson = ({ persons, person, setPersons, setDeleteMessage, setErrorMessage }) => {
  if (!person) {
    console.error("No person provided for deletion")
    return
  }
  if (window.confirm(`Delete ${person.name}?`)) {
    axios
      .delete(`${baseUrl}/${person.id}`)
      .then(() => {
        setPersons(persons.filter(p => p.id !== person.id))
        setDeleteMessage(`Deleted ${person.name} successfully from the Phonebook`)
        setTimeout(() => {
          setDeleteMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.error('Error deleting person:', error)
        setErrorMessage('Error deleting person from the server')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }
}

const Persons = ({ persons, filter, setPersons, setDeleteMessage, setErrorMessage }) => {
  const filteredPersons = filter === ''
    ? persons
    : persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )

  return (
    <div>
      <h3>Numbers</h3>
      <ul>
        {filteredPersons.map((person, index) => (
          <li key={index}>{person.name} {person.number}
            <button onClick={() => deletePerson({ person, persons, setPersons, setDeleteMessage, setErrorMessage })}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Persons