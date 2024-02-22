const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
require('ejs');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {}).catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.get('/student-portal', (req, res) => {
    res.render("student-portal");
});

app.get("/student-register", (req, res) => {
  res.render("student-register");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});