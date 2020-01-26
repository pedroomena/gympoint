import Sequelize, { Model } from 'sequelize';

class Membership extends Model {
    static init(sequelize) {
        super.init(
            {
                start_date: Sequelize.DATEONLY,
                end_date: Sequelize.DATEONLY,
                price: Sequelize.FLOAT,
                canceled_at: Sequelize.DATE
            },
            {
                sequelize
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Student, {
            foreignKey: 'student_id',
            as: 'student'
        });
        this.belongsTo(models.Plan, {
            foreignKey: 'plan_id',
            as: 'plan'
        });
    }
}

export default Membership;
