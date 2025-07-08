import express from 'express';
import {createItem, deleteItem, readItems, updateItem} from './sqlite_tutorial.js';

const app = express();
app.use(express.json());
const port = 3000;

app.get('/items', (req, res) => {
    readItems((err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        }
        else {
            res.status(200).send(rows);
        }
    })
})

app.post('/items', (req, res) => {
    const {name, description} = req.body;
    createItem(name, description, (err, data) => {
        if (err){
            res.status(500).send(err.message);
        }
        else {
            res.status(201).send(`Item is added ID: ${data.id}`)
        }
    })
})

app.put('/items/:id', (req, res) => {
    const {name, description} = req.body
    updateItem(req.params.id, name, description, (err)=>{
        if (err){
            res.status(500).send(err.message);
        }
        else {
            res.status(200).send(`Updated item ${req.params.id}`)
        }
    })
})

app.delete('/items/:id', (req, res) => {
    deleteItem(req.params.id, (err)=>{
        if (err){
            res.status(500).send(err.message);
        }
        else {
            res.status(200).send(`Deleted item ${req.params.id}`)
        }
    })
})

app.listen(port, () => {
    return console.log(`Server started: http://localhost:${port}`);
  });
  