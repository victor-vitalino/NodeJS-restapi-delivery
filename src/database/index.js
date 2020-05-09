import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

// models
import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import File from '../app/models/File';
import Signature from '../app/models/Signature';
import Deliveryman from '../app/models/Deliveryman';
import Delivery from '../app/models/Delivery';
import Problem from '../app/models/Problem';

const models = [
    User,
    Recipient,
    File,
    Deliveryman,
    Delivery,
    Signature,
    Problem,
];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);
        models
            .map((model) => model.init(this.connection))
            .map(
                (model) =>
                    model.associate && model.associate(this.connection.models)
            );
    }
}
export default new Database();
