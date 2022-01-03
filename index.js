const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");
const app = express();
const port = process.env.PORT || 3000;

//app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(function(req, res, next){
  if (req.is('text/*')) {
    req.text = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){ req.text += chunk });
    req.on('end', next);
  } else {
    next();
  }
});
app.use(express.text());

//CREATE
app.post("/novapot", function (req, res) {
  const query = "INSERT INTO messages (text) VALUES ($1)";
  const values = [req.body.text];

  db.query(query, values, function (err, result) {
    if (err) throw err;
    const message = { id: result.insertId, text: values[0] };
    res.status(200).send(message);
  });
});

//READ
app.get("/poti", function (req, res) {
  const query = "SELECT * FROM poti";

  db.query(query, function (err, result) {
    if (err) throw err;
    const messages = result.rows;
    res.status(200).send(messages);
  });
});

//UPDATE
app.put("/like/:id/:number", function (req, res) {
  const id = parseInt(req.params.id);
  const number = parseInt(req.params.number);
  const query = "UPDATE poti SET nice = $1 WHERE id = $2";
  const values = [number, id];

  db.query(query, values, function (err, result) {
    if (err) throw err;
    const updated = [{ id: values[1], message: values[0] }];

    if (result.rowCount === 0)
      return res
        .status(404)
        .send({ msg: `No message with id ${values[1]} found!` });

    res.status(200).send(updated);
  });
});

app.put("/dislike/:id/:number", function (req, res) {
  const id = parseInt(req.params.id);
  const number = parseInt(req.params.number);
  const query = "UPDATE poti SET notnice = $1 WHERE id = $2";
  const values = [number, id];

  db.query(query, values, function (err, result) {
    if (err) throw err;
    const updated = [{ id: values[1], message: values[0] }];

    if (result.rowCount === 0)
      return res
        .status(404)
        .send({ msg: `No message with id ${values[1]} found!` });

    res.status(200).send(updated);
  });
});

app.listen(port, () => console.log(`Running server on port ${port}`));
