const express = require('express');
const router  = express.Router();
//const db      = require('../dbConnection');
//database      = db.getDb();

module.exports = () => {
  router.get('/', (req, res) => {
      const contactsCollection = database.collection('contacts');
      contactsCollection.find({}).toArray((err, docs) => {
        return res.json(docs);
      });
    });
  return router;
};