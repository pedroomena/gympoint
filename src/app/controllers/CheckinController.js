import * as Yup from 'yup';
import { Op } from 'sequelize';
import { subDays } from 'date-fns';
import Checkin from '../models/Checkin';

class CheckinController {
    async index(req, res) {
        const { student_id } = req.params;

        const checkins = await Checkin.findAll({
            where: {
                student_id
            },
            attributes: ['id', 'student_id', 'created_at']
        });

        return res.json(checkins);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            student_id: Yup.number()
                .integer()
                .positive()
                .required()
        });

        if (!(await schema.isValid(req.params))) {
            return res.status(400).json({ error: 'Validation failed.' });
        }

        const checkins_count = await Checkin.count({
            where: {
                student_id: req.params.student_id,
                created_at: {
                    [Op.gte]: subDays(new Date(), 7)
                }
            }
        });

        if (checkins_count === 5) {
            return res.status(400).json({
                erro: 'You already checked in 5 times in the past 7 days.'
            });
        }

        const { id, student_id } = await Checkin.create(req.params);

        return res.json({
            id,
            student_id
        });
    }
}

export default new CheckinController();
