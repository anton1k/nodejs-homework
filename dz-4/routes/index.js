const Router = require('koa-router');
const router = new Router();
const koaBody = require('koa-body')

const ctrlHome = require('../controllers/index');
const ctrlLogin = require('../controllers/login');
const ctrlRegistration = require('../controllers/registration');
const ctrlAdmin = require('../controllers/admin');

router.get('/', ctrlHome.getIndex);
router.post('/', koaBody(),  ctrlHome.sendData);

router.get('/login', ctrlLogin.getLogin);
router.post('/login', koaBody(), ctrlLogin.sendLogin);

router.get('/registration', ctrlRegistration.getRegistration);
router.post('/registration', koaBody(), ctrlRegistration.sendRegistration);

router.get('/admin', ctrlAdmin.getAdmin);
router.post('/admin/skills', koaBody(), ctrlAdmin.sendSkills);
router.post('/admin/upload', koaBody({
  multipart: true,
  formidable: {
    uploadDir: process.cwd() + "/public/upload"
  }
}), ctrlAdmin.sendUpload);

module.exports = router;