import express from 'express';
import routes from './routes';

import './database';

class App {
    constructor() {
        this.server = express();
        this.server.use(express.json());
        this.routes();
    }

    middlewares() {}

    routes() {
        this.server.use(routes);
    }
}
export default new App().server;
