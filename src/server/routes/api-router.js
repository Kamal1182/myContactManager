const express  = require('express');
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcrypt');
const checkJwt = require('express-jwt');
const router   = express.Router();
const contactsRoute = require('./contacts')
//const db       = require('../dbConnection');
//database = db.getDb();

module.exports = () => {
  
  router.use(
    checkJwt({ secret: process.env.JWT_SECRET }).unless({ path: '/api/authenticate' })
  );
  
  router.use((err, req, res, next) => {
    if(err.name === 'UnauthorizedError') {
      res.status(401).send({ error: err.message});
    }
  })
  
  router.use('/contacts', contactsRoute());

  /* router.get('/contacts', (req, res) => {
    const contactsCollection = database.collection('contacts');
  
    contactsCollection.find({}).toArray((err, docs) => {
      return res.json(docs);
    });
  }); */
  
  router.post('/contacts', (req, res) => {
    const user = req.body;
    console.log(req.body.name);
    console.log(req.body.address);
    console.log(req.body.areaCode);
    console.log(req.body.prefix);
    console.log(req.body.lineNumber);
    console.log(req.body.photoUrl);
    /* const contactsCollection = database.collection('contacts');
  
    contactsCollection.insertOne(user, (err, r) => {
      if(err) {
        return res.status(500).json({ error: 'Error inserting new record' });
      }
  
      const newRecord = r.ops[0];
  
      return res.status(201).json(newRecord);
    }); */
  })

  router.post('/authenticate', (req, res) => {
    const user = req.body;

    const userCollection = database.collection('users');

    userCollection.findOne({username: user.username}, (err, result) => {
      if(!result) {
        return res.status(404).json({ error: 'user not found' });
      }

      if(!bcrypt.compareSync(user.password, result.password)) {
        return res.status(401).json({ error: 'incorrect password' });
      }

      const payload = {
        username: user.username,
        admin: user.admin
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' });

      return res.status(200).json({
        message: 'successfully authenticated',
        token: token
      });
    })
  })

  return router;
}