import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

//import swaggerUi from "swagger-ui-express";
//import yaml from "yamljs";
//import { fileURLToPath } from "url";
//import path from "path";

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

//// Configuración de __dirname en ES Modules
//const filename = fileURLToPath(import.meta.url);
//const dirname = path.dirname(filename);

//const swaggerDocument = yaml.load(path.join(dirname, "../swagger.yaml"));

//export default [swaggerUi.serve, swaggerUi.setup(swaggerDocument)];