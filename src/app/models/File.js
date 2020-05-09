import Sequelize, { Model } from 'sequelize';

class File extends Model {
    static init(connection) {
        super.init(
            {
                name: Sequelize.STRING,
                path: Sequelize.STRING,
                url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return `http://localhost:3000/files/${this.path}`;
                    },
                },
            },
            { sequelize: connection }
        );
        return this;
    }
}
export default File;
