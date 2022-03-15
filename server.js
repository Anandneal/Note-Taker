const express = require("express");
const path = require("path");

const notes = require("./db/db.json");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
let note1 = notes.length;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "db/db.json"));
});

app.post("/api/notes", (req, res) => {
  let pData = req.body;
  pData.id = note1 + 1;
  note1++;
  notes.push(pData);
  fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
    if (err) throw err;
  });
  res.sendFile(path.join(__dirname, "public/notes.html"));
});
app.delete("/api/notes/:id", (req, res) => {
  const allTypeNotes = fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    let note2 = JSON.parse(data);
    let pNotes = note2.find((note) => note.id === parseint(req.params.id));
    let indexNote = note2.indexOf(pNotes);
    note2.splice(indexNote, 1);

    fs.writeFile("./db/db.json", JSON.stringify(note2), (err) => {
      if (err) throw err;
    });

    res.sendFile(path.join(__dirname, "public/notes.html"));
  });
});

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
