require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

const Person = require('./models/person');

morgan.token('body', function(req, res) {
    return JSON.stringify(req.body)
});

const morganOutput = ":method :url :status :req[header] :res[content-length] - :response-time ms :body";

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(morgan(morganOutput));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()));  
    })
    .catch(error => {
        console.log(error);
        res.status(404).end();
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findById(id)
        .then(response => {
            if (response) {
                res.json(response.toJSON());
            } else {
                res.status(404).end();
            }
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body;
    
    if (!body.name || !body.number) {
        return res.status(400).json({ error: "content missing" });
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number,
    });

    newPerson.save(newPerson)
        .then(savedPerson => {
            res.json(savedPerson.toJSON())
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    const body = req.body;

    const editPerson = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(id, editPerson, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndRemove(id)
        .then(response => {
            res.status(204).end();
        })
        .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
    const date = new Date();

    Person.find({}).then(persons => {
        const howMany = persons.length;
        const text = `<p>Phonebook has info for ${howMany} people.</p>`
        const response = text + date;
        res.send(response);
    })
    .catch(error => {
        console.log(error);
        res.status(404).end();
    })
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'Unknown endpoint'});
}

app.use(unknownEndpoint);

const handleError = (error, req, res, next) => {
    console.log('Error:', error.message);

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'Bad ID format' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
    next(error);
}

app.use(handleError);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Now listening at port ${PORT}`);
});

