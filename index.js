const express = require("express");
const cors = require("cors");
const AWS = require("aws-sdk");
const awsServerlessExpress = require("aws-serverless-express");
const bcrypt = require("bcryptjs");
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

// Export the Lambda handler function
const server = awsServerlessExpress.createServer(app);
exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
