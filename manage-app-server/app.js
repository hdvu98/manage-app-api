const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models/index');

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.log('Cannot connect to the database', err);
    process.exit();
  });

require('./routes/Member.route')(app);
app.listen(PORT, () => {
  console.log(`Server is up and running on port numner  ${PORT}`);
});
