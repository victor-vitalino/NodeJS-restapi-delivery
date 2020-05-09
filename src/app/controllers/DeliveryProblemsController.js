import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Problem from '../models/Problem';

class DeliveryProblemController {
    async index(req, res) {
        const problems = await Problem.findAll();
        return res.json(problems);
    }

    async read(req, res) {
        const { id } = req.params;
        const deliveryExists = await Delivery.findByPk(id);
        if (!deliveryExists)
            return res.status(400).json({ error: 'Delivery not found' });

        const problems = await Problem.findAll({
            where: {
                delivery_id: id,
            },
        });
        return res.json(problems);
    }

    async store(req, res) {
        const { id } = req.params;

        const schema = Yup.object().shape({
            description: Yup.string().required(),
        });
        if (!(await schema.isValid(req.body)))
            return res.status(400).json({ error: 'Validation fails' });

        const deliveryExists = await Delivery.findByPk(id);
        if (!deliveryExists)
            return res.status(400).json({ error: 'Delivery not found' });

        const { description } = req.body;
        const problem = await Problem.create({ description, delivery_id: id });
        return res.json(problem);
    }
}
export default new DeliveryProblemController();
