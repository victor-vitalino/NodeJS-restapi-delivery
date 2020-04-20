import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
    static init(connection) {
        super.init(
            {
                name: Sequelize.STRING,
                pass: Sequelize.VIRTUAL,
                password_hash: Sequelize.STRING,
                email: Sequelize.STRING,
            },
            { sequelize: connection }
        );
        this.addHook('beforeSave', async (user) => {
            if (user.pass) {
                user.password_hash = await bcrypt.hash(user.pass, 8);
            }
        });

        return this;
    }

    validPass(pass) {
        return bcrypt.compare(pass, this.password_hash);
    }
}
export default User;
