import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000/api/contacts'; // Connect to the backend

const CRMContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ firstname: '', lastname: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');


  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      console.log('Fetching contacts...');
      const response = await axios.get(BACKEND_URL);
      console.log('API Response:', response.data);

      if (response.data && response.data.results) {
        const formattedContacts = response.data.results.map(contact => ({
          id: contact.id,
          firstname: contact.properties.firstname || 'N/A',
          lastname: contact.properties.lastname || 'N/A',
          email: contact.properties.email || 'N/A',
        }));
        setContacts(formattedContacts);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addContact = async () => {
    if (!newContact.firstname || !newContact.lastname || !newContact.email) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post(BACKEND_URL, newContact);
      console.log('Contact added:', response.data);
      setMessage('✅ Contact added successfully!');
      fetchContacts(); 
      setNewContact({ firstname: '', lastname: '', email: '' });
    } catch (error) {
      console.error('Error adding contact:', error);
      setMessage('❌ Failed to add contact.');
    }
  };

  const handleInputChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>HubSpot CRM Contacts</h2>

      <button onClick={fetchContacts} disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch Contacts'}
      </button>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      <ul>
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <li key={contact.id}>
              {contact.firstname} {contact.lastname} - {contact.email}
            </li>
          ))
        ) : (
          <p>No contacts available.</p>
        )}
      </ul>

      <h3>Add New Contact</h3>
      <input
        type="text"
        name="firstname"
        placeholder="First Name"
        value={newContact.firstname}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="lastname"
        placeholder="Last Name"
        value={newContact.lastname}
        onChange={handleInputChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={newContact.email}
        onChange={handleInputChange}
      />
      <button onClick={addContact}>Add Contact</button>
    </div>
  );
};

export default CRMContacts;
