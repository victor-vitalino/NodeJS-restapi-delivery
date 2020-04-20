import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import auth from '../../config/auth';

class SessionController {
    async login(req, res) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            pass: Yup.string().required(),
        });
        if (!(await schema.isValid(req.body)))
            return res.status(401).json({ error: 'Validation fails!' });

        const { email, pass } = req.body;
        const user = await User.findOne({
            where: { email },
        });
        if (!user)
            return res.status(401).json({ error: 'User does not exists' });

        if (!(await user.validPass(pass)))
            return res.status(401).json({ error: 'Password does not match.' });

        const { id, name } = user;
        return res.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, auth.secret, { expiresIn: auth.expiresIn }),
        });
    }
}
export default new SessionController();
