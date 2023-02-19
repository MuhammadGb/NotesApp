const express = require("express");
require("dotenv").config(); // loads the environment variables into process.env
const path = require("path");
const cors = require("cors");

const notesRouter = require("./routers/notes");
const usersRouter = require("./routers/users");
const { handleError } = require("./utils/error");
const auth = require("./middleware/auth.js");

// Configuring the database
const mongoose = require("mongoose");
const localUrl = "mongodb://localhost:27017/simple-notes";

const app = express();

//Enable cors
app.use(cors());

app.use((req, res, next) => {
  const { method, path } = req;
  console.log(
    `New request to: ${method} ${path} at ${new Date().toISOString()}`,
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(auth.initialize());

app.get("/", (req, res) => {
  res.redirect("/api/v1/notes");
});

// Mongoose Connection
mongoose.Promise = global.Promise;
const { MONGO_URI } = process.env;
const URL = MONGO_URI || localUrl;

// Connecting to the database
mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/users", usersRouter);

app.use(handleError);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});
