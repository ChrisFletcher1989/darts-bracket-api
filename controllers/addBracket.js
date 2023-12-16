//TO DO: Add players and scores to bracketPlayersDB

const handleAddBracket = (req, res, dynamoDB, bcrypt) => {
  const { email, passcode, password } = req.body;
  if (!email || !passcode || !password) {
    return res.status(400).json("incorrect bracket login data");
  }
  bcrypt.hash(password, null, null, function (err, hash) {});
  const hash = bcrypt.hashSync(password);
  dynamoDB
    .transaction((trx) => {
      trx
        .insert({
          hash: hash,
          email: email,
          passcode: passcode,
        })
        .into("bracketCredentials")
        .returning("passcode")
        .then((email) => {
          return trx("bracketPlayers")
            .returning("*")
            .insert({
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
            })
            .then((user) => {
              res.json(user[0]);
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err) => res.status(400).json("error saving the bracket"));
};

module.exports = {
  handleAddBracket: handleAddBracket,
};
