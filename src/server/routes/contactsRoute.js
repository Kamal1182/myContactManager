const express = require('express');
const router  = express.Router();
const { addContactValidationRules, validate } = require('../validation/addUserValidation');
fs = require('fs');
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

      // Write the image to profiles folder
      var buffer = new Buffer(req.body.photoUrl.data, 'base64');
      fs.writeFile(process.cwd()+`/src/server/profiles/${req.body.firstName}-${req.body.lastName}.${req.body.photoUrl.extension}`, 
                    buffer, function (err,data) {
        if (err) {
          return console.log(err);
        }
      });
      /* if(req.files) {
        console.log(req.files);
        req.files.photoUrl.mv('profiles');
      } */

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