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

    router.post('/', (req, res) => {
      const user = req.body;
      console.log(req.body.name);
      console.log(req.body.address);
      console.log(req.body.areaCode);
      console.log(req.body.prefix);
      console.log(req.body.lineNumber);
      console.log(req.body.photoUrl);
      const contactsCollection = database.collection('contacts');
    
      contactsCollection.insertOne(user, (err, r) => {
        if(err) {
          return res.status(500).json({ error: 'Error inserting new record' });
        }
    
        const newRecord = r.ops[0];
    
        return res.status(201).json(newRecord);
      });
    })

  return router;
};