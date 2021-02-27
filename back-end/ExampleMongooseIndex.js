const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
// here the db name is museum
mongoose.connect('mongodb://localhost:27017/museum', {
  useNewUrlParser: true
});

// Create a scheme for items in the museum: a title and a path to an image.
const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
});

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);

/** req. body vs params vs query
 * params is the for the url. Example: /api/items:id then you use params.id
 * query if for the part of the url after ?
 * body is for the rest.
 */


 // CREATE
// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/items', async (req, res) => {
  const item = new Item({
    title: req.body.title,
    path: req.body.path,
  });
  try {
    await item.save();
    console.log(`saved: ${req.body.title}`);
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// FIND
// Get a list of all of the items in the museum.
app.get('/api/items', async (req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// DELETE
app.delete('/api/items/:id', async (req, res) => {
  try {
    await Item.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// EDIT
app.put('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findOne({
      _id: req.params.id
    })
    item.title = req.body.title;
    await item.save();

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));


