import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

const options = {
    definition: {
      openapi: '3.0.3',
      info: {
        title: 'NodeApp API',
        version: '1.0.0',
        description: 'API con autenticación JWT',
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            descripcion: 'JWT Authorization header. Example: "Authorization: {token}"'
          },
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
    },
    //apis: ['./controllers/**/*.js'],
    apis: ['./swagger.yaml'],
  };

const specification = swaggerJSDoc(options)

export default [swaggerUI.serve, swaggerUI.setup(specification)]