require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());

const HUBSPOT_API_URL = 'https://api.hubapi.com/crm/v3/objects/contacts';
const HUBSPOT_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN; 

// Route to Fetch Contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const response = await axios.get(HUBSPOT_API_URL, {
      headers: {
        Authorization: `Bearer ${HUBSPOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching contacts:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch contacts' });
  }
});

app.post('/api/contacts', async (req, res) => {
    try {
      const { firstname, lastname, email } = req.body;
  
      if (!firstname || !lastname || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const response = await axios.post(
        HUBSPOT_API_URL,
        {
          properties: {
            firstname,
            lastname,
            email,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${HUBSPOT_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      res.json({ message: 'Contact added successfully', data: response.data });
    } catch (error) {
      console.error('Error adding contact:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ error: 'Failed to add contact' });
    }
  });
  


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
