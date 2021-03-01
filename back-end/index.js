const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const multer = require('multer')
const upload = multer({
  dest: '../front-end/cp3/public/images/',
  limits: {
    fileSize: 10000000
  }
});

const mongoose = require('mongoose');

// connect to the database
// here the db name is museum
mongoose.connect('mongodb://localhost:27017/ratemycourse', {
  useNewUrlParser: true
});

// Create a scheme for items in the museum: a title and a path to an image.
const universitySchema = new mongoose.Schema({
  name: String,
  id: String,
  logo: String, 
  description: String,
  color: String,
});

const courseSchema = new mongoose.Schema({
  universityId: String,
  id: String,
  title: String,
  number: Number,
  name: String,
  description: String,
  credits: Number,
  professors: Array,
});

const commentSchema = new mongoose.Schema({
  courseId: String,
  author: String,
  date: String,
  comment: String,
})

// Create a model for items in the museum.
const University = mongoose.model('University', universitySchema);
const Course = mongoose.model('Course', courseSchema);
const comment = mongoose.model('Comment', commentSchema);

app.get('/api/universities', async (req, res) => {
  try {
    const universities = await University.find();
    res.send(universities);
  } catch (error) {
    console.log(error);
  }
});

// Create university
app.post('/api/university', async (req, res) => {
  try {
    if (!req.body.name || !req.body.description || !req.body.id || !req.body.logo || !req.body.color)
      throw new Error({message: 'missing variables'});

    const university = new University({
      name: req.body.name,
      description: req.description,
      id: req.body.id,
      logo: req.body.logo,
      color: req.body.color,
    });

    const univ = await University.findOne({name: university.name})
    if (univ) 
      throw new Error('University already exists');

    await university.save();
    res.status(200).send(university);
  } catch (err) {
    console.log(`err: ` + err);
    res.status(400).send({ error: err });
  }
});

// Create course
app.post('/api/course', async (req, res) => {
  try {
    if (!req.body.name || !req.body.id || !req.body.universityId || !req.body.title ||
        !req.body.number || !req.body.description || !req.body.credits)
      throw Error('missing parameters');
    
    const title = req.body.title.toUpperCase();

    const university = await University.findOne({ id: req.body.universityId});
    if (!university)
      throw Error('University does not exist');
    
    const c = await Course.findOne({ title: title, number: req.body.number });
    if (c) 
      throw Error('Course already exists');

    const course = new Course({
      universityId: req.body.universityId,
      id: req.body.id,
      title: title,
      number: req.body.number,
      name: req.body.name,
      description: req.body.description,
      credits: req.body.credits,
      professors: req.body.professors,
    });
    await course.save();
    res.status(200).send(course);
  } catch (error) {
    console.log(error);
  }
});

app.listen(3001);


