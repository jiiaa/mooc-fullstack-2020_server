const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

morgan.token('body', function(req, res) {
    return JSON.stringify(req.body)
});

const morganOutput = ":method :url :status :req[header] :res[content-length] - :response-time ms :body";

const createId = () => {
    const id = Math.round(Math.random() * 1991990);
    return id;
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'Unknown endpoint'});
}

app.use(cors());
app.use(express.json());
app.use(morgan(morganOutput));

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
    
    if (person) {
        res.json(person);
    } else {
        res.status(400).json({ error: "ID not found" });
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body;
    
    if (!body.name || !body.number) {
        return res.status(400).json({ error: "content missing" });
    }

    if (persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())) {
        return res.status(400).json({ error: "Name must be unique"});
    }

    const person = {
        name: body.name,
        number: body.number,
        id: createId()
    }

    persons = persons.concat(person);
    res.json(person);
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id);
    res.status(200).end();
})

app.get('/info', (req, res) => {
    const howMany = persons.length;
    const text = `<p>Phonebook has info for ${howMany} people</p>`
    const date = new Date();
    const response = text + date;
    res.send(response);
})

app.use(unknownEndpoint);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Now listening at port ${PORT}`);
});

let persons = [
    {
        name: "Aku Ankka",
        number: "313",
        id: 1
    },
    {
        name: "Roope Ankka",
        number: "$$$$",
        id: 2
    },
    {
        name: "Mary Poppendieck",
        number: "1-250-657 6598",
        id: 3
    },
    {
        name: "Corona Virus",
        number: "777-999",
        id: 4
    },
    {
        name: "Nalle Puh",
        number: "Hunajata",
        id: 5
    }
];
