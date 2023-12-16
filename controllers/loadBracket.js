const handleLoadBracket = (req, res, dynamoDB) => {
  const { passcode } = req.body;
  if (!passcode) {
    return res.status(400).json("passcode not found");
  }
  dynamoDB
    .select("passcode")
    .from("bracketCredentials")
    .where("passcode", "=", passcode)
    .then((data) => {
      const isValid = passcode;
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
        res.status(400).json("incorrect passcode");
      }
    })
    .catch((err) => res.status(400).json("Bracket Not Found"));
};

module.exports = {
  handleLoadBracket: handleLoadBracket,
};
