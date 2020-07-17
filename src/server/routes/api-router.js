const express  = require('express');
const checkJwt = require('express-jwt');
const router   = express.Router();
const contactsRoute = require('./contactsRoute');
const authenticateRoute = require('./authenticateRoute');
//const db       = require('../dbConnection');
//database = db.getDb();

module.exports = () => {
  
  router.use(
    checkJwt({ secret: process.env.JWT_SECRET }).unless({ path: '/api/authenticate' })
  );
  
  router.use((err, req, res, next) => {
    if(err.name === 'UnauthorizedError') {
      res.status(401).send({ errors : err.message});
    }
  })
  
  router.use('/contacts', contactsRoute());
  
  router.use('/authenticate', authenticateRoute());

  return router;
}