const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {}).catch((err) => console.log(err));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});