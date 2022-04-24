const express = require("express")
const morgan = require("morgan")
const app = express()

app.use(express.json())
app.use(morgan(
    ":method :url :status :res[content-length] - :response-time ms :json"
))
morgan.token("json", (req, res) => {
    if (req.method === "POST") {
        //console.log(JSON.stringify(res.body))
        return JSON.stringify(req.body)
    }
})

const cors = require('cors')
const { response } = require("express")
app.use(cors())

let persons = [
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Max",
      "number": "715",
      "id": 9
    }
]

app.get("/api/persons", (req, res) => {
    res.send(persons)
})

app.get("/info", (req, res) => {
    res.send(`
        <p>This phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.post("/api/persons", (req, res) => {
    const person = req.body

    if (person.name === "" || person.number === "") {
        return res.status(400).json({
            error: "name or number missing"
        })
    }

    //console.log(persons.map(p => p.name))
    if (persons.map(p => p.name).includes(person.name)) {
        console.log("NOT UNIQUE")
        return res.status(400).json({
            error: "name has to be unique"
        })
    }

    person.id = Math.floor(Math.random() * 1000000)
    persons = persons.concat(person)

    res.json(person)
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}) 