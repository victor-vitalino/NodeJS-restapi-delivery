import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
    async index(req, res) {
        const { page = 1 } = req.query;
        const limit = 20;
        const recipients = await Recipient.findAll({
            raw: true,
            limit,
            offset: (page - 1) * limit,
        });
        return res.json(recipients);
    }

    async store(req, res) {
        // validation
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            street: Yup.string().required(),
            number: Yup.number().required(),
            complement: Yup.string().required(),
            neighborhood: Yup.string().required(),
            state: Yup.string().required(),
            city: Yup.string().required(),
            cep: Yup.number().required(),
        });
        if (!(await schema.isValid(req.body)))
            return res.status(401).json({ error: 'Validation fails!' });
        const { name, cep, number } = req.body;
        const recipientExists = await Recipient.findOne({
            where: {
                name,
                cep,
                number,
            },
        });
        if (recipientExists)
            return res.status(400).json({ error: 'Recipient already exists!' });

        const recipient = await Recipient.create(req.body);
        return res.json(recipient);
    }

    async update(req, res) {
        const { id } = req.params;
        let recipient = await Recipient.findByPk(id);
        if (!recipient)
            return res.status(400).json({ error: 'Recipient does not exists' });
        recipient = await recipient.update(req.body);

        return res.json(recipient);
    }

    async detail(req, res) {
        const { id } = req.params;
        const recipient = await Recipient.findByPk(id);
        if (!recipient)
            return res.status(400).json({ error: 'Recipient does not exists' });
        return res.json(recipient);
    }
}
export default new RecipientController();
