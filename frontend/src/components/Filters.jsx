import React from 'react'

const Filters = ({ filter, handleFilterChange }) => {
  return (
    <div>
      <label>Search user</label>
      <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

export default Filters
