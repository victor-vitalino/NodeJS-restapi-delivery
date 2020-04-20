// aqui vao as configurações de conexao do sequelize
module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: '',
    password: '',
    database: '',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
};
