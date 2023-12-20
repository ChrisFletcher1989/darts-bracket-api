const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const bcrypt = require("bcrypt");

AWS.config.update({
  region: "ap-northeast-1",
});

const handleSaveBracket = (req, res, dynamoDB, bcrypt) => {
  const {
    email,
    passcode,
    password,
    id,
    // Add other optional properties here...
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
  } = req.body;

  if (!email || !passcode || !password || !id) {
    return res.status(400).json("Incorrect bracket login data");
  }

  const credentialParams = {
    TableName: "bracketCredentials",
    Key: {
      id: id,
    },
  };

  dynamoDB.get(credentialParams, (err, data) => {
    if (err) {
      console.error("Error retrieving bracketCredentials:", err);
      return res.status(500).json("Internal Server Error");
    }

    if (!data.Item) {
      return res.status(400).json("Bracket Not Found");
    }

    bcrypt.compare(password, data.Item.hash, function (err, result) {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json("Internal Server Error");
      }

      const isValid = result;

      if (isValid) {
        bcrypt.hash(password, 10, function (err, hash) {
          if (err) {
            return res.status(500).json("Error hashing password");
          }

          const updateExpressionParts = [
            "SET #h = :hash",
            "email = :email",
            "passcode = :passcode",
          ];
          const expressionAttributeValues = {
            ":hash": hash,
            ":email": email,
            ":passcode": passcode,
          };

          const addOptionalProperty = (propertyName, attributeValue) => {
            if (attributeValue !== undefined) {
              updateExpressionParts.push(`${propertyName} = :${propertyName}`);
              expressionAttributeValues[`:${propertyName}`] = attributeValue;
            }
          };

          addOptionalProperty("firstPlayers", firstPlayers);
          addOptionalProperty("secondPlayers", secondPlayers);
          addOptionalProperty("thirdPlayers", thirdPlayers);
          addOptionalProperty("fourthPlayers", fourthPlayers);
          addOptionalProperty("fifthPlayers", fifthPlayers);
          addOptionalProperty("sixthPlayers", sixthPlayers);
          addOptionalProperty("firstScores", firstScores);
          addOptionalProperty("secondScores", secondScores);
          addOptionalProperty("thirdScores", thirdScores);
          addOptionalProperty("fourthScores", fourthScores);
          addOptionalProperty("fifthScores", fifthScores);
          addOptionalProperty("sixthScores", sixthScores);

          const updateExpression = updateExpressionParts.join(", ");

          const transactionParams = {
            TransactItems: [
              {
                Update: {
                  TableName: "bracketCredentials",
                  Key: {
                    id: id,
                  },
                  UpdateExpression: updateExpression,
                  ExpressionAttributeValues: expressionAttributeValues,
                  ExpressionAttributeNames: {
                    "#h": "hash",
                  },
                },
              },
              {
                Update: {
                  TableName: "bracketPlayers",
                  Key: {
                    id: id,
                  },
                  UpdateExpression: updateExpression,
                  ExpressionAttributeValues: expressionAttributeValues,
                  ExpressionAttributeNames: {
                    "#h": "hash",
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
      } else {
        res.status(400).json("Incorrect username or password");
      }
    });
  });
};

module.exports = {
  handleSaveBracket: handleSaveBracket,
};
