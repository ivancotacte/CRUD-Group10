const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const StudentSchema = new Schema({
  studentNum: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  contactNum: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Students", StudentSchema);