// Express 4 ne rattrape pas les rejets de promesse dans les handlers async :
// sans ce wrapper, une erreur async passerait sous silence (requete qui
// reste en attente) au lieu de tomber dans errorHandler.
module.exports = function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
};
