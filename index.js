const express = require("express");
const app = express();
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
app.use(cors());

app.use(express.json());
let persons = [
  {
    id: "1",
    name: "Sam",
    age: "26",
    hobbies: [],
  },
]; //This is your in memory database

app.set("db", persons);
//TODO: Implement crud of person

// Get all person
app.get("/person", (req, res) => {
  res.status(200).send(persons);
});

// Get person by id
app.get("/person/:id", (req, res) => {
  try {
    const person = persons.find((p) => p.id === req.params.id);
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.status(200).json(person);
  } catch (error) {
    console.log("Erro geting person by id: " + error);
    res.status(500).send("Internal server error");
  }
});

// Post new person

app.post("/person", (req, res) => {
  try {
    const { name, age, hobbies } = req.body;

    if (!name || !age || !Array.isArray(hobbies)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    if (isNaN(age)) {
      return res.status(400).json({ error: "Age must be a number" });
    }

    const newPerson = {
      id: uuidv4(),
      name,
      age,
      hobbies,
    };

    persons.push(newPerson);
    res.status(200).json(newPerson);
  } catch (error) {
    console.log("Error creating new Person: " + error);
    res.status(500).send("Internal server error");
  }
});

// put person by id

app.put("/person/:id", (req, res) => {
  try {
    const { name, age, hobbies } = req.body;
    const person = persons.find((p) => p.id === req.params.id);
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    if (!name || !age || !Array.isArray(hobbies)) {
      return res.status(400).json({ error: "Invalid input data" });
    }
    person.name = name;
    person.age = age;
    person.hobbies = hobbies;
    res.status(200).json(person);
  } catch (error) {
    console.log("Error update person by id : " + error);
    res.status(500).send("Internal server error");
  }
});

// Delete
app.delete("/person/:id", (req, res) => {
  try {
    const personIndex = persons.findIndex((p) => p.id === req.params.id);
    if (personIndex === -1) {
      return res.status(404).json({ error: "Person not found" });
    }

    persons.splice(personIndex, 1);
    res.status(200).json({ message: "Person deleted successfully" });
  } catch (error) {
    console.log("Error deleting Person: " + error);
    res.status(500).send("Internal server error");
  }
});

// Handle non endpoints
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

if (require.main === module) {
  app.listen(3000);
}
module.exports = app;
