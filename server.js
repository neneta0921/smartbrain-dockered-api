const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

// app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: '123',
      name: 'Dan',
      email: 'dan@gmail.com',
      password: 'cooking',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Jane',
      email: 'jane@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'dan@gmail.com'
    }
  ]
}
// console.log(database.users[0].email, database.users[0].password)
// console.log(database.users[0].id)

app.get('/', (req, res) => {
  res.send(database.users)
})

app.post('/signin', (req, res) => {
  // Load hash from your password DB.
  bcrypt.compare("nenene", '$2a$10$6qPbjh8vzIIXZaNAgMybxOG6U2jN/V94MdITJPVYVIN4BAVWrvOQO', function(err, res) {
    console.log('first guess', res)
  });
  bcrypt.compare("veggies", '$2a$10$6qPbjh8vzIIXZaNAgMybxOG6U2jN/V94MdITJPVYVIN4BAVWrvOQO', function(err, res) {
    console.log('second guess', res)// res = false
  });
  if (req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password) {
        // res.json('success');
        res.json(database.users[0]);
  } else {
    res.status(400).json('error logging in');
  }
})

app.post('/register', (req, res) => {
  const {email, name, password} = req.body;
  bcrypt.hash(password, null, null, function(err, hash) {
    console.log(hash);
  });
  database.users.push({
    id: 125,
    name: name,
    email: email,
    entries: 0,
    joined: new Date()
  })
  res.json(database.users[database.users.length - 1]);
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    // console.log(typeof(user.id), typeof(id))
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  })
  if (!found) {
    res.status(400).json('no such user');
  }
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++
      return res.json(user.entries);
    }
  })
  if (!found) {
    res.status(400).json('not found');
  }
})

// bcrypt.hash("bacon", null, null, function(err, hash) {
//   // Store hash in your password DB.
// });
//
// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//   // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//   // res = false
// });

app.listen(3000, () => {
  console.log('app is running on port 3000')
})