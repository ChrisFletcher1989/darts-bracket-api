const handleLoadBracket = (req, res, dynamoDB) => {
  const { id, passcode } = req.body;
  if (!passcode) {
    return res.status(400).json("Passcode not found");
  }

  const params = {
    TableName: "bracketPlayers",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id,
    },
  };

  dynamoDB.query(params, (err, data) => {
    if (err) {
      console.error("Error querying bracketCredentials:", err);
      return res.status(500).json("Internal Server Error");
    }

    const isValid = data.Items.length > 0;

    if (isValid) {
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
          res.json(userData.Items[0]);
        } else {
          res.status(400).json("User not found");
        }
      });
    } else {
      res.status(400).json("Incorrect passcode");
    }
  });
};

module.exports = {
  handleLoadBracket: handleLoadBracket,
};
