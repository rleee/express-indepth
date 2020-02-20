/**
 * This would be route for /users
 * localhost:PORT/users/****
 */

const router = require('express').Router();

router.get('/:name', (req, res) => {
  res.send('The id specified is ' + req.params.name);
});

// can also use regex to specify the pattern of the url
router.get('/:name/:id([0-9]{3})', (req, res) => {
  res.send(
    `The name specified is ${req.params.name} and the id is ${req.params.id}`
  );
});

module.exports = router;
