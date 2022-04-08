const AuthTokenController = require('../controllers/AuthTokenController');


route.post('/api/login', AuthTokenController.create);