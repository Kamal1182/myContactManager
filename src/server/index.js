const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 3000;
const createExpressApp = require('./create-express-app');

require('dotenv').config();

MongoClient.connect(process.env.DB_CONN, (err, cluster) => {
    if(err) {
      console.log('Database error: ' + err);
    } else {
      database = cluster.db('contacts-app-vm');
      console.log('Successful database connection');
    }
  
    createExpressApp(database)
      .listen(port, () => {
        console.log(`listening on http://localhost:${port}`)});
  })
  
/* const www = process.env.WWW || './';

app.use(express.static(www));
console.log(`serving ${www}`);
app.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
}); */