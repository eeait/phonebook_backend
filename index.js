const express = require("express")
const app = express()
const cors = require('cors')
require("dotenv").config()
const morgan = require("morgan")
const Person = require("./models/person")
const { response } = require("express")

app.use(express.static("build"))
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

//const { response } = require("express")
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
]

app.get("/api/persons", (req, res) => {
    Person.find({}).then(persons => {
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

app.get("/api/persons/:id", (req, res) => {
    Person.findById(req.params.id)
        .then(person => {
            res.json(person)
        })
        .catch(error => next(error))

})

app.put("/api/persons/:id", (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true})
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.post("/api/persons", (req, res, next) => {
    const body = req.body
    //console.log("got POST with body:", body)

    /*//console.log(persons.map(p => p.name))
    if (persons.map(p => p.name).includes(person.name)) {
        console.log("NOT UNIQUE")
        return res.status(400).json({
            error: "name has to be unique"
        })
    }

    person.id = Math.floor(Math.random() * 1000000)
    persons = persons.concat(person)*/

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
})
 
app.delete("/api/persons/:id", (req, res, next) => {
    /*OLD: const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()*/
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.use((error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message })
    }
    next(error)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})