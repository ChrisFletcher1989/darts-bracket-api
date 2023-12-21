const handleLoadBracket = (req, res, dynamoDB) => {
  const { id, passcode } = req.body;
  if (!passcode) {
    return res.status(400).json("Passcode not found");
  }

  const credentialParams = {
    TableName: "bracketCredentials",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id,
    },
  };

  dynamoDB.query(credentialParams, (err, data) => {
    if (err) {
      console.error("Error querying bracketCredentials:", err);
      return res.status(500).json("Internal Server Error");
    }

    const isValid = data.Items.length > 0;

    if (isValid) {
      const storedPasscode = data.Items[0].passcode;

      if (passcode === storedPasscode) {
        const userId = data.Items[0].id;
        const playersParams = {
          TableName: "bracketPlayers",
          KeyConditionExpression: "id = :id",
          ExpressionAttributeValues: {
            ":id": userId,
          },
        };

        dynamoDB.query(playersParams, (err, userData) => {
          if (err) {
            console.error("Error querying bracketPlayers:", err);
            return res.status(500).json("Internal Server Error");
          }

          if (userData.Items.length > 0) {
            // Omitting the hash from the response
            const { hash, ...userDataWithoutHash } = userData.Items[0];
            res.json(userDataWithoutHash);
          } else {
            res.status(400).json("User not found");
          }
        });
      } else {
        res.status(400).json("Incorrect passcode");
      }
    } else {
      res.status(400).json("User not found");
    }
  });
};

module.exports = {
  handleLoadBracket: handleLoadBracket,
};
