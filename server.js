const express = require("express");
const cors = require("cors");
const knex = require("knex");
const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
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
  saveBracket.handleSaveBracket(req, res, dynamoDB, bcrypt);
});
app.post("/addBracket", (req, res) => {
  addBracket.handleAddBracket(req, res, dynamoDB, bcrypt);
});
app.post("/loadBracket", (req, res) => {
  loadBracket.handleLoadBracket(req, res, dynamoDB);
});

//Listen for changes

app.listen(process.env.PORT || 3000, () => {
  console.log(`running OK on port ${process.env.PORT}`);
});
