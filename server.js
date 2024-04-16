const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
// GET /notes - Return the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// GET * - Return the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET /api/notes - Read the db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read data from database.' });
    }
    res.json(JSON.parse(data));
  });
});

// POST /api/notes - Receive a new note to save on the request body, add it to the db.json file, and return the new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read data from database.' });
    }
    const notes = JSON.parse(data);
    newNote.id = notes.length + 1; // Assign a unique ID to the new note
    notes.push(newNote);
    fs.writeFile('db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to write data to database.' });
      }
      res.json(newNote);
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
