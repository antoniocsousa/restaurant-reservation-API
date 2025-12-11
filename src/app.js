import express from 'express';
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerjson from './swagger.json' with { type: 'json' };

const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerjson));
routes(app);

export default app;