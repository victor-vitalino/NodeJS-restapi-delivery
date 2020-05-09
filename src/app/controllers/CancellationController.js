import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Problem from '../models/Problem';
import Recipient from '../models/Recipient';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class CancellationController {
    async destroy(req, res) {
        const { id } = req.params;
        const problem = await Problem.findByPk(id, { raw: true });
        if (!problem)
            return res.status(400).json({ error: 'Problem not found' });

        const delivery = await Delivery.findByPk(problem.delivery_id);
        if (delivery.end_date)
            return res
                .status(400)
                .json({ error: 'This delivery already delivered' });

        if (delivery.canceled_at)
            return res
                .status(400)
                .json({ error: 'This delivery already Canceled' });
        (await delivery).update({
            canceled_at: Date(),
        });
        const deliveryman = await Deliveryman.findByPk(
            delivery.deliveryman_id,
            {
                raw: true,
            }
        );
        const recipient = await Recipient.findByPk(delivery.recipient_id, {
            raw: true,
        });

        await Queue.add(CancellationMail.key, {
            delivery,
            deliveryman,
            recipient,
        });

        return res.json({ delivery, problem });
    }
}
export default new CancellationController();
