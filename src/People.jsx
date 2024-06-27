import { useEffect } from 'react';
import './App.css'
import React, { useState } from 'react';

export default function People() {
  const [people, setPeople] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Get the existing people data from local storage
    const existingPeople = JSON.parse(localStorage.getItem('people')) || [];
    // const existingPeople = [];
    console.log("existingPeople", existingPeople)
    // Set the people data in the state
    setPeople(existingPeople);
  }, []);

  // Function to handle pinning a person
  const handlePin = (personId, wantToPin) => {
    // Find the person in the list
    const updatedPeople = people.map((person) => {
      if (person.id === personId) {
        return { ...person, pinned: wantToPin};
      }
      return person;
    });

    console.log("updatedPeople", updatedPeople);
    localStorage.setItem('people', JSON.stringify(updatedPeople));
    // Update the people list
    setPeople(updatedPeople);
  };

  const toggleFav = (personId) => {
    const updatedPeople = people.map((person) => {
      if (person.id === personId) {
        return { ...person, favorite: !person.favorite };
      }
      return person;
    });
    setPeople(updatedPeople);
  }

  // Function to handle editing a person
  const handleEdit = (personId) => {
    // Find the person in the list
    const updatedPeople = people.map((person) => {
      if (person.id === personId) {
        // Implement the logic to edit the person
        localStorage.setItem('editedPeople', JSON.stringify(person));
        // Remove "/peoples" from the current URL
        const currentURL = window.location.href;
        const updatedURL = currentURL.replace("/people", "");
        handleDelete(personId);
        window.location.href = updatedURL;
        // return person; // Return the updated person object
      }
      return person;
    });
    // Update the people list
    setPeople(updatedPeople);
  };

  // Function to handle deleting a person
  const handleDelete = (personId) => {
    // Filter out the person with the given id
    const updatedPeople = people.filter((person) => person.id !== personId);
    setPeople(updatedPeople);
    localStorage.setItem('people', JSON.stringify(updatedPeople));
  };

  // Function to handle toggling the filter
  const handleFilter = (filterType) => {
    setFilter(filterType);
  };

  // Filter the people list based on the selected filter
  const filteredPeople = people.filter((person) => {
    if (filter === 'all') {
      return true;
    } else if (filter === 'favorite') {
      return person.favorite;
    } else if (filter === 'nonFavorite') {
      return !person.favorite;
    }
    return true;
  });

  return (
    <>
      <ul className="space-y-4"></ul>
      <ul className="space-y-4">
        {filteredPeople.map((person) => (
          <li key={person.id} className="flex items-center justify-between">
            <span>
              <strong>Name:</strong> {person.name}<br />
              <strong>Contact:</strong> {person.contact}<br />
              <strong>Age:</strong> {person.age}<br />
              <strong>Birthday:</strong> {person.birthday}<br />
              <strong>Hobbies:</strong> {person.hobbies}<br />
            </span>
            <div>
              {person.pinned ? "📌" : ""}
              <button className="px-4 py-2 rounded bg-yellow-500 text-white mr-2" onClick={() => toggleFav(person.id)}>{ person.favorite ? "Remove from Favourite" : "Add to Favorite"}</button>
              <select className="px-2 py-2 rounded bg-gray-200" onChange={(e) => {
                if (e.target.value === 'delete') {
                  handleDelete(person.id);
                } else if (e.target.value === 'edit') {
                  handleEdit(person.id);
                } else if (e.target.value === 'pin') {
                  handlePin(person.id, true);
                } else if (e.target.value === 'unpin'){
                  handlePin(person.id, false);
                }
              }}>
                <option value="options"> Select </option>
                <option value="pin"> Pin </option>
                <option value="unpin"> Unpin </option>
                <option value="edit">Edit</option>
                <option value="delete">Delete</option>
              </select>
            </div>
          </li>
        ))}
      </ul>
      
      {/* Add the filter buttons */}
      <div className="mt-4 space-x-2">
        <button className="px-4 py-2 rounded bg-blue-500 text-white" onClick={() => handleFilter('all')}>All People</button>
        <button className="px-4 py-2 rounded bg-blue-500 text-white" onClick={() => handleFilter('favorite')}>Favorite People</button>
        <button className="px-4 py-2 rounded bg-blue-500 text-white" onClick={() => handleFilter('nonFavorite')}>Non-Favorite People</button>
      </div>
    </>
  );
}
