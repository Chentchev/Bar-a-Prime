require('dotenv').config();
const app = require('./app');
const db = require('./db');

const PORT = process.env.PORT || 3001;

db.init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Bar a Prime API sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erreur d'initialisation de la base de donnees :", err.message);
    process.exit(1);
  });
