const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const handleAddBracket = (req, res, dynamoDB, bcrypt) => {
  const {
    email,
    passcode,
    password,
    firstPlayers,
    secondPlayers,
    thirdPlayers,
    fourthPlayers,
    fifthPlayers,
    sixthPlayers,
    firstScores,
    secondScores,
    thirdScores,
    fourthScores,
    fifthScores,
    sixthScores,
    id,
  } = req.body;
  console.log(
    "Received request with email:",
    email,
    "password:",
    password,
    "passcode:",
    passcode
  );
  if (!email || !passcode || !password) {
    return res.status(400).json("Incorrect bracket login data");
  }

  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      return res.status(500).json("Error hashing password");
    }

    const transactionParams = {
      TransactItems: [
        {
          Put: {
            TableName: "bracketCredentials",
            Item: {
              id: id,
              hash: hash,
              email: email,
              passcode: passcode,
            },
          },
        },
        {
          Put: {
            TableName: "bracketPlayers",
            Item: {
              id: id,
              email: email,
              passcode: passcode,
              firstPlayers: firstPlayers,
              secondPlayers: secondPlayers,
              thirdPlayers: thirdPlayers,
              fourthPlayers: fourthPlayers,
              fifthPlayers: fifthPlayers,
              sixthPlayers: sixthPlayers,
              firstScores: firstScores,
              secondScores: secondScores,
              thirdScores: thirdScores,
              fourthScores: fourthScores,
              fifthScores: fifthScores,
              sixthScores: sixthScores,
            },
          },
        },
      ],
    };

    dynamoDB.transactWrite(transactionParams, (err, data) => {
      if (err) {
        console.error("Error saving the bracket:", err);
        console.log("Cancellation Reasons:", err.CancellationReasons);
        if (err.CancellationReasons) {
          err.CancellationReasons.forEach((reason, index) => {
            console.log(`Item ${index + 1} Error:`, reason.Item);
          });
        }
        return res.status(400).json("Error saving the bracket");
      }

      res.json("Bracket saved successfully");
    });
  });
};

module.exports = {
  handleAddBracket: handleAddBracket,
};
