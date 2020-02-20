const router = require('express').Router();

// test variable to store temporary userid and pass
var Users = [];

// Signup form
router.get('/signup', (req, res) => {
  console.log('/signup ', req.session);
  res.render('auth', { showForm: 'signup' });
});

// Signup process
router.post('/signup', (req, res) => {
  if (!req.body.userid || !req.body.pass) {
    res.status('400');
    res.send('Invalid credentials');
    return;
  } else {
    Users.filter(user => {
      if (user.userid === req.body.userid) {
        res.send('User exists');
        return;
      }
    });
  }

  var newUser = { userid: req.body.userid, pass: req.body.pass };
  Users.push(newUser);
  req.session.user = newUser; // add new created user to session
  console.log('/post singup ', req.session);
  res.redirect('/auth/protected');
});

router.get('/protected', checkSignIn, (req, res) => {
  console.log('/protected ', req.session);
  res.render('protected_page', { userid: req.session.user.userid });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    console.log('logged out ', req.session);
  });
  res.redirect('/auth/login');
});

router.get('/login', (req, res) => {
  console.log('login: ', req.session);
  res.render('auth', { showForm: 'login' });
});

router.post('/login', (req, res) => {
  Users.filter(user => {
    if (user.userid === req.body.userid && user.pass === req.body.pass) {
      req.session.user = { userid: req.body.userid, pass: req.body.pass }; // add login user to session
      res.redirect('/auth/protected');
    }
  });
  res.send('Invalid credentials');
});

function checkSignIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
}

module.exports = router;
