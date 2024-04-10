// import satellite from 'satellite.js';
// const n2yo = require('n2yo.js');

// const n2yo_access = new n2yo('G9HA59-MN6CFW-W7HT8M-58EZ');

const express = require('express');
app = express()





app.get('/', (req, res) => {
        res.send("Hello"); 
});

const host = '127.0.0.1';
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

