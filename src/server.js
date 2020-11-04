const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const { response } = require("express");
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const clientRouter = require("./routes/clientRouter.js");
const adminRouter = require("./routes/adminRouter.js");
const fse = require('fs-extra');
const cron = require('node-cron');
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

cron.schedule('0 13 * * *', () => {
  fse.emptyDir('uploads')
    .then(() => console.log('Uploads is cleared'))
    .catch(err => console.log('Error to clear Uploads'))
})

const port = process.env.PORT || 5000;
app.listen(port);
