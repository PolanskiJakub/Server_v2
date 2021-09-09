var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController')

//GET request to display stats
router.get('/stats', user_controller.stats_get);


//POST request to send some information about game
router.post('/stats/countGame', user_controller.stats_post);

router.post('/register',user_controller.register);

router.post('/login',user_controller.login);

router.post('/user/:id/sendDeleteEmail',user_controller.deleteEmail);

router.delete('/user/:id',user_controller.delete);


module.exports = router;

// DELETE /api/user/{user.id}?token={user.token}&deleteToken={user.deleteToken} - 204