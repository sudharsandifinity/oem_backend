const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'OEM App API',
            version: '1.0.0',
            description: 'API Documentation for OEM App using Swagger',
        },
        servers: [
            {
                url: 'http://localhost:3002/api/v1',
            },
        ],
        components: {
            schemas: {
                CreateUser: {
                    type: 'object',
                    required: ['first_name', 'last_name', 'email', 'password'],
                    properties: {
                        first_name: { type: 'string', example: 'Sudharsan' },
                        last_name: { type: 'string', example: 'S' },
                        email: { type: 'string', example: 'sudharsan@yopmail.com' },
                        password: { type: 'string', example: '9876543210' },
                        status: { type: 'integer', example: 1 },
                    },
                },
                UpdateUser: {
                    type: 'object',
                    properties: {
                        first_name: { type: 'string', example: 'Sudharsan' },
                        last_name: { type: 'string', example: 'S' },
                        email: { type: 'string', example: 'sudharsan@yopmail.com' },
                        password: { type: 'string', example: '9876543210' },
                        status: { type: 'integer', example: 1 },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;