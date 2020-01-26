import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class NewMembershipMail {
    get key() {
        return 'NewMembershipMail';
    }

    async handle({ data }) {
        const { student, plan, end_date } = data;

        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Sua nova matrícula na GymPoint',
            template: 'newMembership',
            context: {
                student: student.name,
                plan: plan.title,
                full_price: plan.full_price,
                end_date: format(parseISO(end_date), 'dd/MM/yyyy')
            }
        });
    }
}

export default new NewMembershipMail();
