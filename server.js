const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');

let notes = fs.readFileSync('./db/db.json');
notes = JSON.parse(notes)



const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));



app.get('/', (req,res)=> res.sendFile(path.join(__dirname, '/public/index.html')));
 
app.get('/notes', (req,res)=> res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res)=> res.json(notes));

app.post('/api/notes', (req, res) => {

  
    const newN = req.body 
    newN.id = uuidv4();

   
    console.log("Adding Note: ", newN);

  
    notes.push(newN);

    //write files to db
    fs.writeFile('db/db.json', JSON.stringify(notes), (err) =>
    err ? res.send( err ) : res.json(notes)
    );

});

app.delete('/api/notes/:id', (req, res) => {

    const selectedNoteID = req.params.id;
    console.log(`Removing item with id: ${selectedNoteID}`);

    
    notes = notes.filter(note => note.id != selectedNoteID);

    res.end();
});


app.listen(PORT, () => console.log(`server started on http://localhost:${PORT}`));
