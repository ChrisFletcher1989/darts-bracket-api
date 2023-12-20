const express = require("express");
const cors = require("cors");
const knex = require("knex");
const AWS = require("aws-sdk");
const bcrypt = require("bcrypt");
const { handleSaveBracket } = require("./controllers/saveBracket");
const { handleAddBracket } = require("./controllers/addBracket");
const { handleLoadBracket } = require("./controllers/loadBracket");

AWS.config.update({
  region: "ap-northeast-1",
});
const params = {
  TableName: "bracketCredentials",
  Key: {
    id: "id",
  },
  TableName: "bracketPlayers",
  Key: {
    id: "id",
  },
};
const dynamoDB = new AWS.DynamoDB.DocumentClient();

dynamoDB.get(params, (err, data) => {
  if (err) {
    console.error("Error:", err);
  } else {
    console.log("Data:", data);
  }
});

//EDIT TO LAMBDA/AWS SQL Connect to database (below is with knex and needs editing)
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
// const db = knex({
//   client: "pg",
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: true,
//   },
// });

//Setup express and cors
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("it is working");
});

//Components
app.post("/saveBracket", (req, res) => {
  handleSaveBracket(req, res, dynamoDB, bcrypt);
});
app.post("/addBracket", (req, res) => {
  handleAddBracket(req, res, dynamoDB, bcrypt);
});
app.post("/loadBracket", (req, res) => {
  handleLoadBracket(req, res, dynamoDB);
});

//Listen for changes

app.listen(process.env.PORT || 3000, () => {
  console.log(`running OK on port ${process.env.PORT}`);
});
