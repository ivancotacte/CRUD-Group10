const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const generator = require("generate-password");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const MongoDBSession = require("connect-mongodb-session")(session);
require("dotenv").config();
require("ejs");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "db_ICCTPortal",
  })
  .then(() => {})
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

const sessionStore = new MongoDBSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
  dbName: process.env.DB_NAME,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  }),
);

const StudentModels = require("./models/StudentModels");
const { sendEmail } = require("./models/emailSender");

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    return next();
  } else {
    res.redirect("/student-portal");
  }
};

app.get("/dashboard", isAuth, async (req, res) => {
  try {
    const emailAddress = req.session.emailAddress;

    const user = await StudentModels.findOne({ emailAddress });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("dashboard", { user });
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    return res.redirect("/student-portal");
  });
});


app.get("/student-portal", (req, res) => {
  res.render("student-portal", { errors: "" });
});

app.post("/student-portal", async (req, res) => {
  const { emailAddress, password } = req.body;

    const user = await StudentModels.findOne({ emailAddress });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .render("student-portal", {
          errors: [{ msg: "Invalid email or password" }]
        });
    }

  req.session.emailAddress = emailAddress;

  req.session.isAuth = true;
  res.redirect("/dashboard");
});

app.get("/student-register", (req, res) => {
  res.render("student-register");
});

app.post("/student-register", async (req, res) => {
  const { firstName, middleName, lastName, suffix, emailAddress, contactNum } = req.body;

  let studentEmail = await StudentModels.findOne({ emailAddress });
  if (studentEmail) {
    return res.status(400).json({ message: "Email address already exists." });
  }

  const randomPassword = generator.generate({ length: 15, numbers: true });
  const hashedPassword = await bcrypt.hash(randomPassword, 10);
  
  const studentInfo = new StudentModels({
    firstName,
    middleName,
    lastName,
    suffix,
    password: hashedPassword,
    userRole: "student",
    emailAddress,
    contactNum,
  });

  sendEmail(emailAddress, randomPassword);

  await studentInfo.save();
  res.redirect("/student-portal");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});