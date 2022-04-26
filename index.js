const express = require("express")

const app = express()
const cors = require("cors")
require("dotenv").config()
const morgan = require("morgan")
const Person = require("./models/person")

app.use(express.static("build"))
app.use(express.json())
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :json")
)

// eslint-disable-next-line consistent-return
morgan.token("json", (req, res) => {
  if (req.method === "POST") {
    // console.log(JSON.stringify(res.body))
    return JSON.stringify(req.body)
  }
})

app.use(cors())

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

app.get("/info", (req, res) => {
  Person.collection.countDocuments().then((countDocuments) => {
    res.send(`
      <p>This phonebook has info for ${countDocuments} people</p>
      <p>${new Date()}</p>
    `)
  })
})

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person)
    })
    .catch((error) => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
  const { body } = req

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.post("/api/persons", (req, res, next) => {
  const { body } = req

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    // eslint-disable-next-line no-unused-vars
    .then((result) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

// eslint-disable-next-line consistent-return
app.use((error, req, res, next) => {
  // console.log(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message })
  }
  next(error)
})

const { PORT } = process.env
app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
})
