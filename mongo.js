const mongoose = require("mongoose")
//console.log(process.argv)

const password = process.argv[2]

let add = false
if (process.argv.length === 5) {
    fullName = process.argv[3]
    phoneNumber = process.argv[4]
    add = true
}

const url =
    `mongodb+srv://fullstack:${password}@cluster0.qoq5d.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model("Person", personSchema)

if (add) {
    const person = new Person({
        name: fullName,
        number: phoneNumber,
    })
    person.save().then((result) => {
        console.log(`Succeessfully added ${fullName} (${phoneNumber}).`)
        mongoose.connection.close()
    })
} else {
    console.log("Phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} (${person.number})`)
        })
        mongoose.connection.close()
    })
}