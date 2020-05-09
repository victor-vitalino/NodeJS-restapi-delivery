module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('deliveries', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            recipient_id: {
                // referencia ao destinatario
                type: Sequelize.INTEGER,
                references: { model: 'recipients', key: 'id' },
                onUpdate: 'SET NULL',
                onDelete: 'SET NULL',
                allowNull: true,
            },
            deliveryman_id: {
                // referência ao entregador
                type: Sequelize.INTEGER,
                references: { model: 'deliverymans', key: 'id' },
                onUpdate: 'SET NULL',
                onDelete: 'SET NULL',
                allowNull: true,
            },

            signature_id: {
                // (referência à uma assinatura do destinatário, que será uma imagem);
                type: Sequelize.INTEGER,
                references: { model: 'signatures', key: 'id' },
                onUpdate: 'cascade',
                onDelete: 'SET NULL',
                allowNull: true,
            },
            product: {
                // nome do produto a ser entregue);
                type: Sequelize.STRING,
                allowNull: false,
            },
            canceled_at: {
                // (data de cancelamento, se cancelada);
                type: Sequelize.DATE,
                allowNull: true,
            },
            start_date: {
                // (data de retirada do produto);
                type: Sequelize.DATE,
                allowNull: true,
            },
            end_date: {
                // (data final da entrega);
                type: Sequelize.DATE,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('deliveries');
    },
};
