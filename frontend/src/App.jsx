import { useState, useEffect } from 'react'
import axios from 'axios'
import './Notifications.css';
const baseUrl = '/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const Filters = ({ filter, handleFilterChange }) => {
  return (
    <div>
      <label>Search user</label>
      <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={`notification ${type}`}>
    <div className="icon"></div>
      {message}
    </div>
  );
};

const deletePerson = ({persons, person, setPersons, setDeleteMessage, setErrorMessage}) => {
  if (!person) {
    console.error("No person provided for deletion");
  }
  if (window.confirm(`Delete ${person.name}?`)) {
    axios
      .delete(`${baseUrl}/${person.id}`)
      .then(() => {
        setPersons(persons.filter(p => p.id !== person.id));
        setDeleteMessage(`Deleted ${person.name} successfully from the Phonebook`);
        setTimeout(() => {
          setDeleteMessage(null);
        }, 2000);
      })
  }
};

const Persons = ({ persons, filter, setPersons, deletePerson, setDeleteMessage}) => {
  const filteredPersons = filter === ''
    ? persons
    : persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      );

  return (
    <div>
      <h3>Numbers</h3>
      <ul>
        {filteredPersons.map((person, index) => (
          <li key={index}>{person.name} {person.number}
          <button onClick={() => deletePerson({ person, persons, setPersons, setDeleteMessage })}>delete</button>         
          </li>
        ))}
      </ul>
    </div>
  );
};


const addNote = ({ newName, newNumber, persons, setPersons, setNewName, setNewNumber, setErrorMessage, setSuccessMessage, setChangeMessage }) => {
  const existingPerson = persons.find(person => person.name && person.name.toLowerCase() === newName.toLowerCase());
  if (existingPerson) {
    if (window.confirm(`${newName} is already added to the phonebook! Do you want to update the number?`)) {
      const updatedPerson = { id: existingPerson.id, name: existingPerson.name, number: newNumber };

      axios
        .put(`${baseUrl}/${existingPerson.id}`, updatedPerson)
        .then(response => {
          setPersons(persons.map(person => person.id !== existingPerson.id ? person : response.data));
          setNewName('');
          setNewNumber('');
          setChangeMessage(`Changed ${newName}'s number successfully!`);
          setTimeout(() => {
            setChangeMessage(null);
          }, 2000);
        })
        .catch(error => {
          console.error("Update failed:", error);
          setErrorMessage(`${newName} has been removed already.`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 2000);
        });
    }
  } else {
    const newPerson = { name: newName, number: newNumber };
    axios
      .post(baseUrl, newPerson)
      .then(response => {
        console.log('Response:', response.data);
        setPersons([...persons, response.data]);
        setNewName('');
        setNewNumber('');
        setSuccessMessage(`Added ${newPerson.name} successfully to the Phonebook`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);
      })
      .catch(error => {
        console.error('Error adding new person:', error);
        if (error.response) {
          console.error('Server Error:', error.response.data);
          setErrorMessage(error.response.data.error);
        } else {
          console.error('Network Error:', error.message);
          setErrorMessage('Network Error: Unable to connect to the server');
        }
        setTimeout(() => {
          setErrorMessage(null);
        }, 2000);
      });
  }
};

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
  );
};

const App = () => {
  const [persons, setPersons] = useState([]); 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notes, setNotes] = useState([])
  const [changeMessage, setChangeMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    getAll()
      .then(data => {
        setPersons(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setErrorMessage('Error fetching data from the server');
      });
  }, []);
      
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addNote({ newName, newNumber, persons, setPersons, setNewName, 
      setNewNumber, setSuccessMessage, setChangeMessage, setErrorMessage });
  };
  
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
        handleSubmit={handleSubmit}/>
      <Persons 
        persons={persons} 
        filter={filter} 
        deletePerson={deletePerson} 
        setPersons={setPersons}
        setDeleteMessage={setDeleteMessage}
        setErrorMessage={setErrorMessage}  />
      </div>
  );
};

export default App;
