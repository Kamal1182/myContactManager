const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

var _db;

module.exports = {

    connectToServer : function ( callback ) {
      MongoClient.connect(process.env.DB_CONN, (err, cluster) => {
        if(err) {
          console.log('Database error: ' + err);
        } else {
            _db = cluster.db('contacts-app-vm');
            console.log('Successful database connection');
            return callback( err );
        }
      })
    },

    getDb : function () { 
      return _db;  
    }

};