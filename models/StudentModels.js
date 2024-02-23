const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const StudentSchema = new Schema({
  studentNum: {
    type: String,
    required: true,
    unique: true,
    default: () => {
      const school = "ICCT";
      const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
      return `${school}${randomDigits}`;
    },
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
  suffix: {
    type: String,
    required: false,
  },
  userRole: {
    type: String,
    enum: ["admin", "student"],
    default: "student",
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