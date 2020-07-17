const express = require('express');
const router  = express.Router();
const { addContactValidationRules, validate } = require('../validation/addUserValidation');
//const db      = require('../dbConnection');
//database      = db.getDb();

module.exports = () => {
  router.get('/', (req, res) => {
      const contactsCollection = database.collection('contacts');
      contactsCollection.find({}).toArray((err, docs) => {
        return res.json(docs);
      });
    });

    router.post('/', addContactValidationRules(),validate, (req, res, next) => {
      const user = req.body;

      const contactsCollection = database.collection('contacts');
    
      contactsCollection.insertOne(user, (err, r) => {
        if(err) {
          return res.status(500).json({ error: 'Error inserting new contact' });
        }
    
        const newRecord = r.ops[0];
    
        return res.status(201).json(newRecord);
      });
    })

  return router;
};