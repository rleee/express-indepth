const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log(req.cookies);
  console.log(req.session);
  if (req.session.page_views) {
    req.session.page_views++;
    res.send('You visites this page ' + req.session.page_views + ' times');
  } else {
    req.session.page_views = 1;
    res.send('Welcome to this page for the first time');
  }
});

router.get('/clear', (req, res) => {
  res.clearCookie('cookieName');
  res.send('clear cookie');
});

module.exports = router;
