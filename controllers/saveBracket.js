const handleSaveBracket = (req, res, dynamoDB, bcrypt) => {
  const { email, password, passcode } = req.body;
  if (!email || !password || !passcode) {
    return res.status(400).json("Incorrect bracket credentials");
  }

  dynamoDB
    .select("email", "hash", "passcode")
    .from("bracketCredentials")
    .where("passcode", "=", passcode && "hash", "=", hash)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      console.log(isValid);
      if (isValid) {
        dynamoDB
          .select("*")
          .from("bracketPlayers")
          .where("passcode", "=", passcode)
          .then((user) => {
            res.json(user[0]);
          });
      } else if (isValid === false) {
        res.status(400).json("incorrect username or password");
      }
    })
    .catch((err) => res.status(400).json("Bracket Not Found"));
};

module.exports = {
  handleSaveBracket: handleSaveBracket,
};
