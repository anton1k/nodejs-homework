const express = require('express');
const router = express.Router();

const ctrlHome = require('./controllers/index');
const ctrlLogin = require('./controllers/login');
const ctrlRegistration = require('./controllers/registration');
const ctrlAdmin = require('./controllers/admin');

router.get('/', ctrlHome.getIndex);
router.post('/', ctrlHome.sendData);

router.get('/login', ctrlLogin.getLogin);
router.post('/login', ctrlLogin.sendLogin);

router.get('/registration', ctrlRegistration.getRegistration);
router.post('/registration', ctrlRegistration.sendRegistration);

router.get('/admin', ctrlAdmin.getAdmin);
router.post('/admin/skills', ctrlAdmin.sendSkills);
router.post('/admin/upload', ctrlAdmin.sendUpload);

module.exports = router;