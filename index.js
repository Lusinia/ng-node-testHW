const express = require('express');
const toursRouter = require('./routes/tours');
const cors = require('cors');
const morgan = require('morgan');
const low = require('lowdb');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const PORT = process.env.PORT || 4000;

const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");

const db = low(adapter);

db.defaults({tours: []}).write();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'Express API'
        },
        servers: [
            {
                url: 'http://localhost:4000'
            }
        ],
    },
    apis: ['./routes/*.js']
}

const specs = swaggerJsDoc(options);

const app = express()

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs) )
app.db = db;
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/tours', toursRouter);


app.listen(PORT, () => console.log(`Server port ${PORT}`))
