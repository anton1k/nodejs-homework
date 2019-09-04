const db = require('../../models/db')();

module.exports.getLogin = function (req, res) {
  res.render('pages/login', { title: 'Login',
                              social: db.stores.file.store.social,
                              msgslogin: req.flash('msgslogin')});
}

module.exports.sendLogin = function (req, res) {
  // требуем наличия логина ш пароля
  if (!req.body.email || !req.body.password) {
    //если что-либо не указано - сообщаем об этом
    req.flash('msgslogin', 'Все поля нужно запонить');
    res.redirect('/login');
  }
  let deb = db.stores.file.store.registration;
  if (deb[req.body.email].name == req.body.email && 
      deb[req.body.email].password == req.body.password && 
      deb[req.body.email].admin == 'on') {
    db.set('admin', true);
    res.redirect('/admin');
  } else {
    req.flash('msgslogin', 'Не верный логин или пароль');
    res.redirect('/login');
  }
}