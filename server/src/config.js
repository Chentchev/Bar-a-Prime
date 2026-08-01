const STARTING_BALANCE = Number(process.env.STARTING_BALANCE || 1000);
const BET_AMOUNT = Number(process.env.BET_AMOUNT || 20);
const ADMIN_PSEUDOS = (process.env.ADMIN_PSEUDOS || '')
  .split(',')
  .map((p) => p.trim().toLowerCase())
  .filter(Boolean);

module.exports = { STARTING_BALANCE, BET_AMOUNT, ADMIN_PSEUDOS };
