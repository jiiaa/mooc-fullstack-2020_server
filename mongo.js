const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Give password as argument');
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://mooc-fullstack:${password}@cluster0-8icza.mongodb.net/persons?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema);
const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})

if (process.argv.length === 5) {
    person.save().then(response => {
        console.log(`Added ${response.name} ${response.number} to the phonebook`);
        mongoose.connection.close();
    })
}

if (process.argv.length === 3) {
    Person.find({}, 'name number').then(result => {
        console.log("Phonebook:");
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close();
    })
}
