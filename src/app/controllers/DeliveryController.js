import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Signature from '../models/Signature';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

import Queue from '../../lib/Queue';
import NewDeliveryMail from '../jobs/NewDeliveryMail';

class DeliveryController {
    async index(req, res) {
        const { page = 1 } = req.query;
        const deliveries = await Delivery.findAll({
            limit: 20,
            offset: (page - 1) * 20,
            attributes: [
                'id',
                'product',
                'canceled_at',
                'start_date',
                'end_date',
            ],
            include: [
                {
                    model: Recipient,
                    as: 'recipient',
                    attributes: [
                        'id',
                        'name',
                        'street',
                        'number',
                        'complement',
                        'neighborhood',
                        'state',
                        'city',
                        'cep',
                    ],
                },
                {
                    model: Deliveryman,
                    as: 'deliveryman',
                    attributes: ['id', 'name', 'email'],
                },
                {
                    model: Signature,
                    as: 'signature',
                    attributes: ['id', 'url', 'path'],
                },
            ],
        });
        return res.json(deliveries);
    }

    async store(req, res) {
        // start validation
        const { recipient_id, deliveryman_id } = req.body;
        const schema = Yup.object().shape({
            recipient_id: Yup.number().required(),
            deliveryman_id: Yup.number().required(),
            product: Yup.string().required(),
        });
        if (!(await schema.isValid(req.body)))
            return res.status(400).json({ error: 'Validation fails!' });

        // verify if exists
        const recipient = await Recipient.findByPk(recipient_id);
        if (!recipient)
            return res.status(400).json({ error: 'Recipient not found' });

        const deliveryman = await Deliveryman.findByPk(deliveryman_id);
        if (!deliveryman)
            return res.status(400).json({ error: 'Deliveryman not found' });

        // criando entrega
        const delivery = await Delivery.create(req.body);

        await Queue.add(NewDeliveryMail.key, {
            deliveryman,
            delivery,
            recipient,
        });

        return res.json(delivery);
    }

    async update(req, res) {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: 'Id is not provided!' });

        const delivery = await Delivery.findByPk(id);
        if (!delivery)
            return res.status(400).json({ error: 'Delivery not found!' });

        (await delivery).update(req.body);

        return res.json(delivery);
    }

    async destroy(req, res) {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: 'Id is not provided!' });

        try {
            (await Delivery).destroy({ where: { id } });
            return res.json();
        } catch (error) {
            return res.status(400).json({ error });
        }
    }
}

export default new DeliveryController();
