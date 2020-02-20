const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const middleware = require('./middlewares/consoleLog');
const thingsRoute = require('./routes/things');
const usersRoute = require('./routes/users');
const cookieRoute = require('./routes/cookie');
const authRoute = require('./routes/auth');
const KEY = require('./config/keys');

mongoose.connect(KEY.mongoURI);
const app = express();
const upload = multer();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.use(middleware.consoleLog);
app.use(session({ secret: KEY.session })); // set session in server, set it in cookie, parse it to req.session
app.use(cookieParser()); // parsing the cookie to req.cookie
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(upload.array()); // for parsing multipart/form-data (usually bigger files like image/audio)

app.get('/', (req, res) => {
  res.render('first_view', {
    title: 'Kimekk',
    url: 'kantuik.com',
    user: { name: 'Ayahatsi', age: 25 }
  });
});

//Routes
app.use('/things', thingsRoute);
app.use('/users', usersRoute);
app.use('/cookie', cookieRoute);
app.use('/auth', authRoute);

// 404 route
app.get('*', (req, res) => {
  res.send('Sorry, this is an invalid URL.');
});

app.listen(8000, () => {
  console.log('listening 8000');
});
