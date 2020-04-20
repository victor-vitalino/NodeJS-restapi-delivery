import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

// mid
import authenticate from './app/middlewares/AuthMiddleware';

const routes = Router();

routes.post('/login', SessionController.login);

// crud recipents
routes.use(authenticate);
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.get('/recipients/:id/details', RecipientController.detail);

export default routes;
