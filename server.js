const express = require("express");
const cors = require("cors");

//EDIT TO LAMBDA/AWS SQL Connect to database (bellow is with knex and needs editing)
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
  saveBracket.handleSaveBracket(req, res, db, bcrypt);
});
app.post("/addBracket", (req, res) => {
  addBracket.handleAddBracket(req, res, db, bcrypt);
});
app.post("/loadBracket", (req, res) => {
  loadBracket.handleLoadBracket(req, res, db);
});

//Listen for changes

app.listen(process.env.PORT || 3000, () => {
  console.log(`running OK on port ${process.env.PORT}`);
});
