import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
    async index(req, res) {
        const { student_id } = req.params;

        const help_orders = await HelpOrder.findAll({
            where: {
                student_id
            },
            attributes: ['id', 'student_id', 'question', 'answer', 'answer_at']
        });

        return res.json(help_orders);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            student_id: Yup.number()
                .integer()
                .positive()
                .required(),
            question: Yup.string().required()
        });

        const data = {
            ...req.params,
            ...req.body
        };

        if (!(await schema.isValid(data))) {
            return res.status(400).json({ error: 'Validation failed.' });
        }

        const { id, student_id, question } = await HelpOrder.create(data);

        return res.json({
            id,
            student_id,
            question
        });
    }

    async update(req, res) {
        const { id } = req.params;

        const help_order = await HelpOrder.findByPk(id);

        if (!help_order) {
            return res
                .status(400)
                .json({ erro: 'Help order does not exists.' });
        }

        if (help_order.answer) {
            return res
                .status(400)
                .json({ erro: 'This help order has already been answered.' });
        }

        const { answer } = req.body;

        const { question } = await help_order.update({
            answer,
            answer_at: new Date()
        });

        return res.json({
            id,
            question,
            answer
        });
    }
}

export default new HelpOrderController();
