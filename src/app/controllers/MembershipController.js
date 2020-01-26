import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';

import Membership from '../models/Membership';
import Student from '../models/Student';
import Plan from '../models/Plan';

import NewMembershipMail from '../jobs/NewMembershipMail';
import Queue from '../../lib/Queue';

class MembershipController {
    async index(req, res) {
        const memberships = await Membership.findAll({
            where: {
                canceled_at: null
            },
            attributes: [
                'id',
                'student_id',
                'plan_id',
                'start_date',
                'end_date',
                'price'
            ]
        });

        return res.json(memberships);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            student_id: Yup.number()
                .integer()
                .positive()
                .required(),
            plan_id: Yup.number()
                .integer()
                .positive()
                .required(),
            start_date: Yup.date().required()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed.' });
        }

        const { student_id, plan_id, start_date } = req.body;

        /**
         * Check if student exists
         */

        const student = await Student.findByPk(student_id);

        if (!student) {
            return res.json({ error: 'Student does not exists.' });
        }

        /**
         * Check if plan exists
         */

        const plan = await Plan.findByPk(plan_id);

        if (!plan) {
            return res.json({ error: 'Plan does not exists.' });
        }

        const price = plan.full_price;
        const end_date = addMonths(parseISO(start_date), plan.duration);

        const { id } = await Membership.create({
            ...req.body,
            ...{ end_date, price }
        });

        await Queue.add(NewMembershipMail.key, { student, plan, end_date });

        return res.json({
            id,
            student_id,
            plan_id,
            start_date,
            end_date,
            price
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            student_id: Yup.number()
                .integer()
                .positive(),
            plan_id: Yup.number()
                .integer()
                .positive(),
            start_date: Yup.date()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed.' });
        }

        const { id } = req.params;

        const membership = await Membership.findByPk(id);

        if (!membership) {
            return res
                .status(400)
                .json({ error: 'Membership does not exists.' });
        }

        const { student_id } = req.body;
        let { start_date, plan_id } = req.body;
        let { end_date, price } = membership;

        const plan_changed = plan_id && plan_id !== membership.pland_id;
        const start_date_changed =
            start_date && start_date !== membership.start_date;
        const student_changed =
            student_id && student_id !== membership.student_id;

        if (student_changed) {
            const student = await Student.findByPk(student_id);

            if (!student) {
                return res
                    .status(400)
                    .json({ error: 'Student does not exists.' });
            }
        }

        if (!start_date) {
            start_date = membership.start_date;
        }

        if (!plan_id) {
            plan_id = membership.plan_id;
        }

        if (plan_changed || start_date_changed) {
            const plan = await Plan.findByPk(plan_id);

            if (!plan) {
                return res.json({ error: 'Plan does not exists.' });
            }

            end_date = addMonths(parseISO(start_date), plan.duration);
            price = plan.full_price;
        }

        const data = await membership.update({
            student_id,
            plan_id,
            start_date,
            end_date,
            price
        });
        end_date = data.end_date;
        return res.json({
            id,
            student_id,
            plan_id,
            start_date,
            end_date,
            price
        });
    }

    async delete(req, res) {
        const { id } = req.params;

        const membership = await Membership.findByPk(id);

        if (!membership) {
            return res
                .status(400)
                .json({ error: 'Membership does not exists.' });
        }

        membership.canceled_at = new Date();
        membership.save();

        return res.json(membership);
    }
}

export default new MembershipController();
