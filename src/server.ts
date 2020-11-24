import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";

import clientRouter from "./routes/clientRouter";
import adminRouter from "./routes/adminRouter";
import fse from 'fs-extra';
import cron from 'node-cron';

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
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
app.listen(port, () => {
  console.log(`SERVER IS RUNNING ON ${port}`)
});
