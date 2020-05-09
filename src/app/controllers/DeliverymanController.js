import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
    async store(req, res) {
        // validatiion
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            avatar_id: Yup.number(),
            email: Yup.string().email().required(),
        });
        if (!(await schema.isValid(req.body)))
            return res.status(401).json({ error: 'Validation fail!' });

        const { email, avatar_id, name } = req.body;
        // verify Deliveryman
        const deliverymanExists = await Deliveryman.findOne({
            where: { email },
        });
        if (deliverymanExists)
            return res
                .status(401)
                .json({ error: 'Deliveryman already exists!' });

        const deliveryman = await Deliveryman.create({
            email,
            avatar_id,
            name,
        });
        return res.json(deliveryman);
    }

    async update(req, res) {
        const { id } = req.params;
        const schema = Yup.object().shape({
            name: Yup.string(),
            avatar_id: Yup.number(),
            oldEmail: Yup.string().email(),
            email: Yup.string()
                .email()
                .when('oldEmail', (oldEmail, email) =>
                    oldEmail ? email.required() : email
                ),
            confirmEmail: Yup.string()
                .email()
                .when('email', (email, confirmEmail) => {
                    return email
                        ? confirmEmail.required().oneOf([Yup.ref('email')])
                        : email;
                }),
        });
        /**
         * se o antigo email estiver preenchido o novo deve estar tbm
         * se o novo estiver preenchido o confirm tem que ser igual a ele
         */

        if (!(await schema.isValid(req.body)))
            return res.status(401).json({ error: 'Validation fail!' });

        // valid new email if exists
        if (req.body.confirmEmail) {
            const emailExists = await Deliveryman.findOne({
                where: { email: req.body.confirmEmail },
            });
            if (emailExists)
                return res
                    .status(401)
                    .json({ error: 'this email already in use' });
        }

        const deliveryman = await Deliveryman.findByPk(id);
        if (!deliveryman)
            return res.status(401).json({ error: 'Deliveryman not exists!' });

        deliveryman.update(req.body);

        return res.json(deliveryman);
    }

    async index(req, res) {
        const { page = 1 } = req.query;

        const deliverymans = await Deliveryman.findAll({
            limit: 20,
            offset: (page - 1) * 20,
            attributes: ['id', 'name', 'email', 'avatar_id'],
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['path', 'name', 'url'],
                },
            ],
        });
        return res.json(deliverymans);
    }

    async destroy(req, res) {
        const { id } = req.params;
        const deliveryman = Deliveryman.findByPk(id);
        if (!deliveryman)
            return res.status(400).json({ error: 'Delyveryman not found' });

        (await deliveryman).destroy();
        return res.json();
    }
}
export default new DeliverymanController();
