import Sequelize, { Model } from 'sequelize';

class Problem extends Model {
    static init(connection) {
        super.init(
            {
                description: Sequelize.STRING,
            },
            { sequelize: connection, tableName: 'delivery_problems' }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Delivery, {
            foreignKey: 'delivery_id',
            as: 'delivery',
        });
    }
}
export default Problem;
