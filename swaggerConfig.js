const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Title',
            version: '1.0.0',
            description: 'Your API Description',
        },
        servers: [
            {
                url: 'http://localhost:3000', // Change the URL based on your server setup
            },
        ],
    },
    apis: ['./controller/*.js'], // Specify the path to your controller files
};

const specs = swaggerJsdoc(options);

module.exports = specs;
