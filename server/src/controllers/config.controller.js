const { BET_AMOUNT, STARTING_BALANCE } = require('../config');

// Expose au frontend les reglages configurables par env, pour eviter de
// dupliquer des constantes (mise fixe, solde de depart) des deux cotes.
function getConfig(req, res) {
  res.json({ betAmount: BET_AMOUNT, startingBalance: STARTING_BALANCE });
}

module.exports = { getConfig };
