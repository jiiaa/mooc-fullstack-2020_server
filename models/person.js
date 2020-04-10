const mongoose = require('mongoose');

const dbUrl = process.env.MONGO_URI;

console.log('Connecting to ', dbUrl);
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(result => {
        console.log('Connected to MongoDB');
    })
    .catch((error) =>{
        console.log('Error connecting to MongoDB: ', error.message);
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('Person', personSchema);