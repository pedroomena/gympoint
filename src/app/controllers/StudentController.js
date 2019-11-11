import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            weight: Yup.number()
                .integer()
                .required()
                .positive(),
            height: Yup.number()
                .integer()
                .required()
                .positive()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed.' });
        }

        const userExists = await Student.findOne({
            where: { email: req.body.email }
        });

        if (userExists) {
            return res.status(400).json({ error: 'Student already exists.' });
        }

        const { id, name, email, age, weight, height } = await Student.create(
            req.body
        );

        return res.json({
            id,
            name,
            email,
            age,
            weight,
            height
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            weight: Yup.number()
                .integer()
                .positive(),
            height: Yup.number()
                .integer()
                .positive()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed.' });
        }

        const { id } = req.params;
        let { email } = req.body;

        const student = await Student.findByPk(id);

        if (!student) {
            return res.status(400).json({ error: 'Student does not exists.' });
        }

        if (email && email !== student.email) {
            const studentExists = await Student.findOne({
                where: { email }
            });

            if (studentExists) {
                return res
                    .status(400)
                    .json({ error: 'Student already exists.' });
            }
        }

        // todo: ver como lidar com vars que mudam
        const { name, age, weight, height } = await student.update(req.body);
        email = student.email;

        return res.json({
            id,
            name,
            email,
            age,
            weight,
            height
        });
    }
}

export default new StudentController();
