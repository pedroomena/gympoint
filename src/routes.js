import { Router } from 'express';

import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import PlanController from './app/controllers/PlanController';
import MembershipController from './app/controllers/MembershipController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// SESSIONS
routes.post('/sessions', SessionController.store);

// CHECKINS
routes.post('/students/:student_id/checkins', CheckinController.store);

// HELP ORDERS
routes.post('/students/:student_id/help-orders', HelpOrderController.store);

//
// ENDPOINTS RESTRITOS
//
routes.use(authMiddleware);

// STUDENTS
routes.get('/students', StudentController.index);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

// CHECKINS
routes.get('/students/:student_id/checkins', CheckinController.index);

// PLANS
routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

// MEMBERSHIP
routes.get('/memberships', MembershipController.index);
routes.post('/memberships', MembershipController.store);
routes.put('/memberships/:id', MembershipController.update);
routes.delete('/memberships/:id', MembershipController.delete);

// HELP ORDERS
routes.get('/students/:student_id/help-orders', HelpOrderController.index);
routes.post('/help-orders/:id/answer', HelpOrderController.update);

export default routes;
