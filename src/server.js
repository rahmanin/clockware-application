const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const { response } = require("express");
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const clientRouter = require("./routes/clientRouter.js");
const adminRouter = require("./routes/adminRouter.js");
require("dotenv").config();
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "../client/build")));
app.use(cors());
app.use(bodyParser.json());
app.use(urlencodedParser);
app.use(clientRouter);
app.use(adminRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);
