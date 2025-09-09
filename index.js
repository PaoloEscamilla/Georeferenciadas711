const express = require('express');
const routerApi = require('./routes/rutas');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hola desde mi server Express!');
});

app.get("/nuevaruta", (req, res) => {
  res.send("Hola desde la nueva ruta");
})

routerApi(app);

app.get("/categories/:categoryId/products/:productId", (req, res) => {
  const {categoryId, productId} = req.params;
  res.json({
    categoryId,
    productId
  });
})

app.get("/users", (req, res) => {
  const {username, lastname} = req.query;
  if(username && lastname) {
    res.json({
      username,
      lastname
    });
  } else {
    res.status(400).json({error: "Faltan parametros query"});
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});


