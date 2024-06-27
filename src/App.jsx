import { useEffect } from 'react';
import './App.css'
import React, { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [age, setAge] = useState('');
  const [birthday, setBirthday] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [pinned, setPinned] = useState(false);
  const [favourite, setFavourite] = useState(false);

  useEffect(() => {
    const checkBirthday = () => {
      // Get the existing people data from local storage
      const existingPeople = JSON.parse(localStorage.getItem('people')) || [];

      // Get today's date
      const today = new Date();
      const todayMonth = today.getMonth() + 1; // Months are zero-based
      const todayDay = today.getDate();

      console.log('Checking for birthday people...', todayMonth, todayDay);

      // Find people with today's birthday      
      const birthdayPeople = existingPeople.filter(person => {
        const [year, personMonth, personDay] = person.birthday.split('-');
        return parseInt(personMonth) === todayMonth && parseInt(personDay) === todayDay;
      });

      // Send webhook message if there are birthday people
      if (birthdayPeople.length > 0) {
        birthdayPeople.forEach(person => {
          const message = `🎉 Happy birthday to ${person.name}! 🎉`;
          // sendWebhookMessage(message);
        })
      }
    };


    const sendWebhookMessage = async (message) => {
      // Replace the URL with your Discord webhook URL
      function sendMessage(payload, webhookUrl) {
        const data = typeof payload === 'string' ? { content: payload } : payload;
      
        return new Promise((resolve, reject) => {
          fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
            .then((response) => {
              if (!response.ok) {
                reject(new Error(`Could not send message: ${response.status}`));
              }
              resolve();
            })
            .catch((error) => {
              console.error(error);
              reject(error);
            });
        });
      }
      const webhookUrl = 'https://discord.com/api/webhooks/token/key';
      const message = 'Hello, world!';
      await sendMessage(message, webhookUrl);
    };

    // Run the checkBirthday function every 30 seconds
    const intervalId = setInterval(checkBirthday, 30000);
    console.log('Interval ID:', intervalId);

    // Clean up the interval when the component is unmounted
    return () => {
      clearInterval(intervalId);
    };
  }, []);;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new person object

    if(!name || !contact || !age || !birthday || !hobbies) {
      alert('Please fill all the fields');
      return;
    }

    const person = {
      id : Math.floor(Math.random() * 1000000),
      name,
      contact,
      age,
      birthday,
      hobbies,
      favourite,
      pinned,
    };

    // Get the existing people data from local storage
    const existingPeople = JSON.parse(localStorage.getItem('people')) || [];

    // Add the new person to the existing data
    const updatedPeople = [...existingPeople, person];

    // Store the updated people data in local storage
    localStorage.setItem('people', JSON.stringify(updatedPeople));

    // Clear the form fields
    setName('');
    setContact('');
    setAge('');
    setBirthday('');
    setHobbies('');
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold underline">Add New Person</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="name" className="block">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="contact" className="block">Contact:</label>
          <input
            type="text"
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="age" className="block">Age:</label>
          <input
            type="text"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="birthday" className="block">Birthday:</label>
          <input
            type="date" // Change the input type to "date"
            id="birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="hobbies" className="block">Hobbies:</label>
          <input
            type="text"
            id="hobbies"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Add Person</button>
      </form>
        <a href="/people">
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">View People</button>
        </a>
    </div>
  );
}