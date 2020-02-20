/**
 * This would be route for /things
 * localhost:PORT/things/****
 */

const express = require('express');
const router = express.Router();
const Person = require('../models/Person');

router.get('/', (req, res) => {
  res.send('GET route on things');
});

router.post('/', async (req, res) => {
  const personInfo = validatePersonInfo(req.body);
  if (personInfo.type == 'error') {
    res.render('show_message', {
      message: personInfo.message,
      type: personInfo.type
    });
    return;
  }

  const checkPerson = await checkPersonExists(personInfo.payload);
  if (checkPerson.type == 'error') {
    res.render('show_message', checkPerson);
    return;
  }

  const newPerson = createNewPerson(personInfo.payload);
  const savedPerson = await savePerson(newPerson);
  res.render('show_message', savedPerson);
});

router.get('/all', async (req, res) => {
  const data = await Person.find();
  res.json(data);
});

router.put('/:id', async (req, res) => {
  const data = await Person.findByIdAndUpdate(req.params.id, req.body);
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  const data = await Person.findByIdAndRemove(req.params.id);
  console.log(data);
});

//
// FUNCTIONS
//
function validatePersonInfo(personInfo) {
  if (!personInfo.name || !personInfo.age || !personInfo.nationality) {
    return {
      message: 'One of the field are empty',
      type: 'error'
    };
  }

  const numVal = parseInt(personInfo.age);
  if (isNaN(numVal)) {
    return {
      message: 'Age is not number',
      type: 'error'
    };
  }

  return {
    message: 'no issue',
    type: 'proceed',
    payload: {
      name: personInfo.name,
      age: numVal,
      nationality: personInfo.nationality
    }
  };
}

function createNewPerson(formPerson) {
  return new Person({
    name: formPerson.name,
    age: formPerson.age,
    nationality: formPerson.nationality
  });
}

async function savePerson(newPerson) {
  const data = await newPerson.save();
  if (data.err) {
    return {
      message: 'Database error',
      type: 'error'
    };
  } else {
    return {
      message: 'New person added',
      type: 'success',
      payload: data
    };
  }
}

async function checkPersonExists(personInfo) {
  const data = await Person.findOne({ name: personInfo.name });
  if (data == null) {
    return {
      message: 'no match found',
      type: 'proceed'
    };
  } else if (data.name == personInfo.name) {
    return {
      message: 'person exists',
      type: 'error'
    };
  }
}

module.exports = router;
