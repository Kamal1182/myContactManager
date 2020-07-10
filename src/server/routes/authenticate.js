const express = require('express');
const router  = express.Router();
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcrypt');
//const db      = require('../dbConnection');
//database      = db.getDb();

module.exports = () => {
  router.post('/', (req, res) => {
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
};