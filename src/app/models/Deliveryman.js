import Sequelize, { Model } from 'sequelize';

class Deliveryman extends Model {
    static init(connection) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
            },
            { sequelize: connection }
        );
        return this;
    }

    // criando associação entre tabelas
    static associate(models) {
        this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
    }
}
export default Deliveryman;
