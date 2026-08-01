const { MIN_BET_AMOUNT, STARTING_BALANCE } = require('../config');

// Expose au frontend les reglages configurables par env, pour eviter de
// dupliquer des constantes (mise minimum, solde de depart) des deux cotes.
function getConfig(req, res) {
  res.json({ minBetAmount: MIN_BET_AMOUNT, startingBalance: STARTING_BALANCE });
}

module.exports = { getConfig };
