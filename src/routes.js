import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import SignatureController from './app/controllers/SignatureController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveriesController from './app/controllers/DeliveriesController';
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';
import CancellationController from './app/controllers/CancellationController';

// mid
import authenticate from './app/middlewares/AuthMiddleware';

// criação de vars
const routes = Router();
const upload = multer(multerConfig);

routes.post('/login', SessionController.login);

// crud recipents
routes.use(authenticate);
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.get('/recipients/:id/details', RecipientController.detail);

// crud avatar
routes.post('/files', upload.single('file'), FileController.store);

// signatures
routes.post('/signature', upload.single('file'), SignatureController.store);

// crud entregadores
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.get('/deliveryman/', DeliverymanController.index);
routes.delete('/deliveryman/:id', DeliverymanController.destroy);

// crud entregas

routes.post('/delivery', DeliveryController.store);
routes.get('/delivery', DeliveryController.index);
routes.put('/delivery/:id', DeliveryController.update);
routes.delete('/delivery/:id', DeliveryController.destroy);

// entregas por entregador
routes.get('/deliveryman/:id/deliveries', DeliveriesController.index);
routes.put(
    '/deliveryman/:id/deliveries/:order/pickup',
    DeliveriesController.update
);
routes.put(
    '/deliveryman/:id/deliveries/:order/delivered',
    DeliveriesController.delivered
);

routes.put(
    '/deliveryman/:id/deliveries/:order/delivered',
    DeliveriesController.delivered
);

// delivery problems

routes.get('/delivery/problems', DeliveryProblemsController.index);
routes.get('/delivery/:id/problems', DeliveryProblemsController.read);
routes.post('/delivery/:id/problems', DeliveryProblemsController.store);

// cancelation
routes.delete('/problem/:id/cancel-delivery', CancellationController.destroy);

export default routes;
