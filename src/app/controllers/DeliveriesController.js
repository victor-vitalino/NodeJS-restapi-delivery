import { Op } from 'sequelize';
import { parseISO, startOfToday, endOfToday, isToday } from 'date-fns';

import Delivery from '../models/Delivery';
import Signature from '../models/Signature';
import Deliveryman from '../models/Deliveryman';

class Deliveries {
    async index(req, res) {
        const { id } = req.params;
        const { delivered = false } = req.body;
        const { page = 1 } = req.query;

        /**
         * se o delivered for true ele busca o que for diferente de nulo
         * se for false busca o que for igual a nulo
         */
        const conditionDelivered = delivered ? Op.ne : Op.eq;

        const deliveryman = await Deliveryman.findByPk(id);
        if (!deliveryman)
            return res.status(400).json({ error: 'Deliveryman not found' });

        const limit = 20;
        const deliveries = await Delivery.findAll({
            limit,
            offset: (page - 1) * limit,
            where: {
                deliveryman_id: id,
                end_date: {
                    [conditionDelivered]: null,
                },
            },
        });
        return res.json(deliveries);
    }

    async update(req, res) {
        const { id, order } = req.params;
        const { start_date } = req.body;

        const parsedDate = parseISO(start_date);
        if (!isToday(parsedDate))
            return res.status(400).json({ error: 'That date has passed' });

        const deliveryman = await Deliveryman.findByPk(id);
        if (!deliveryman)
            return res.status(401).json({ error: 'Deliveryman not found' });

        const delivery = await Delivery.findByPk(order);
        if (!delivery)
            return res.status(400).json({ error: 'Delivery is not found' });

        if (delivery.end_date !== null)
            return res
                .status(400)
                .json({ error: 'Delivery already delivered' });

        if (delivery.cancelet_at !== null)
            return res.status(400).json({ error: 'Delivery is canceled' });

        const deliveries = await Delivery.findAll({
            where: {
                deliveryman_id: id,
                end_date: {
                    [Op.eq]: null,
                },
                start_date: {
                    [Op.between]: [startOfToday(), endOfToday()],
                },
                canceled_at: null,
            },
        });
        if (deliveries.length >= 5)
            return res
                .status(400)
                .json({ error: 'You already start 5 deliveries today' });

        /**
         * verificando horario de retirada
         */

        const datenow = new Date().getHours();

        if (datenow <= 0 || datenow >= 18)
            return res.status(400).json({
                error: "You can't get this package before as 08:00am",
            });

        (await delivery).update({ start_date: parsedDate });
        return res.json(delivery);
    }

    async delivered(req, res) {
        const { id, order } = req.params;
        const { end_date, signature } = req.body;

        const deliveryman = await Deliveryman.findByPk(id);
        if (!deliveryman)
            return res.status(400).json({ error: 'Deliveryman not found' });

        const delivery = await Delivery.findByPk(order);
        if (!delivery)
            return res.status(400).json({ error: 'Delivery is not found' });

        if (delivery.start_date === null)
            return res
                .status(400)
                .json({ error: 'This delivery has not started yet' });

        if (delivery.start_date > parseISO(end_date))
            return res
                .status(400)
                .json({ error: 'This date is less than the start date' });

        const signatureExists = await Signature.findByPk(signature);
        if (!signatureExists)
            return res
                .status(400)
                .json({ error: 'Subscription required to finalize delivery' });

        (await delivery).update({
            end_date,
            signature_id: signature,
        });
        return res.json(delivery);
    }
}
export default new Deliveries();
