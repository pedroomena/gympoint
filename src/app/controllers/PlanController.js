import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
    async index(req, res) {
        const plans = await Plan.findAll({
            attributes: ['id', 'title', 'duration', 'price', 'is_active']
        });

        return res.json(plans);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            duration: Yup.number()
                .integer()
                .positive()
                .required(),
            price: Yup.number().required()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed.' });
        }

        const { id, title, duration, price } = await Plan.create(req.body);

        return res.json({
            id,
            title,
            duration,
            price
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string(),
            duration: Yup.number()
                .integer()
                .positive(),
            price: Yup.number(),
            is_active: Yup.boolean()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed.' });
        }

        const { id } = req.params;

        const plan = await Plan.findByPk(id);

        if (!plan) {
            return res.status(400).json({ error: 'Plan does not exists.' });
        }

        const { title, duration, price, is_active } = await plan.update(
            req.body
        );

        return res.json({
            id,
            title,
            duration,
            price,
            is_active
        });
    }

    async delete(req, res) {
        const { id } = req.params;

        const plan = await Plan.findByPk(id);

        if (!plan) {
            return res.status(400).json({ error: 'Plan does not exists.' });
        }

        plan.is_active = false;
        plan.save();

        return res.json(plan);
    }
}

export default new PlanController();
