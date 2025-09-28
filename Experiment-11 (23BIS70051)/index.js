const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let cards = [
    { id: 1, suit: 'hearts', value: 'ace', collection: 'standard' },
    { id: 2, suit: 'spades', value: 'king', collection: 'vintage' }
];

// GET all cards
app.get('/api/cards', (req, res) => {
    res.json(cards);
});

// GET card by ID
app.get('/api/cards/:id', (req, res) => {
    const card = cards.find(c => c.id === parseInt(req.params.id));
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json(card);
});

// POST new card (auto ID)
app.post('/api/cards', (req, res) => {
    const { suit, value, collection } = req.body;
    if (!suit || !value) {
        return res.status(400).json({ error: 'Missing required fields (suit, value)' });
    }

    const newCard = {
        id: cards.length ? Math.max(...cards.map(c => c.id)) + 1 : 1,
        suit,
        value,
        collection: collection || "default"
    };

    cards.push(newCard);
    res.status(201).json(newCard);
});

// POST new card with custom ID
app.post('/api/cards/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { suit, value, collection } = req.body;

    if (!suit || !value) {
        return res.status(400).json({ error: 'Missing required fields (suit, value)' });
    }

    // If ID already exists → reject
    if (cards.find(c => c.id === id)) {
        return res.status(400).json({ error: `Card with id ${id} already exists` });
    }

    const newCard = {
        id,
        suit,
        value,
        collection: collection || "default"
    };

    cards.push(newCard);
    res.status(201).json(newCard);
});

// UPDATE card by ID
app.put('/api/cards/:id', (req, res) => {
    const card = cards.find(c => c.id === parseInt(req.params.id));
    if (!card) return res.status(404).json({ error: 'Card not found' });

    const { suit, value, collection } = req.body;
    if (suit) card.suit = suit;
    if (value) card.value = value;
    if (collection) card.collection = collection;

    res.json(card);
});

// DELETE card by ID
app.delete('/api/cards/:id', (req, res) => {
    const index = cards.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Card not found' });

    const deleted = cards.splice(index, 1);
    res.json({ message: "Deleted successfully", card: deleted[0] });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/api/cards`));
