const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const batchRouter = require('./api/routers/batch');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/batch', batchRouter);

// handle all errors
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500);
    res.json({
        message: error.message,
        data: error.data
    });
});


app.listen(PORT);