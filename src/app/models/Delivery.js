import Sequelize, { Model } from 'sequelize';

class Delivery extends Model {
    static init(connection) {
        super.init(
            {
                product: Sequelize.STRING,
                canceled_at: Sequelize.DATE, // (data de cancelamento, se cancelada);
                start_date: Sequelize.DATE, // (data de retirada do produto);
                end_date: Sequelize.DATE, // (data final da entrega);
            },
            {
                sequelize: connection,
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Signature, {
            foreignKey: 'signature_id',
            as: 'signature',
        });

        this.belongsTo(models.Deliveryman, {
            foreignKey: 'deliveryman_id',
            as: 'deliveryman',
        });
        this.belongsTo(models.Recipient, {
            foreignKey: 'recipient_id',
            as: 'recipient',
        });
    }
}

export default Delivery;

// signature_id (referência à uma assinatura do destinatário, que será uma imagem);
// deliveryman_id (referência ao entregador);
// recipient_id (referência ao destinatário);
