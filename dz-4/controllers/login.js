const db = require('../models/db')();
let msgslogin = '';

module.exports.getLogin = async(ctx, next) => {
  ctx.render('pages/login', { title: 'Login',
                              social: db.stores.file.store.social,
                              msgslogin});
}

module.exports.sendLogin = async(ctx, next) => {
  console.log();
  
  // требуем наличия логина ш пароля
  if (!ctx.request.body.email || !ctx.request.body.password) {
    //если что-либо не указано - сообщаем об этом
    msgslogin =  'Все поля нужно запонить';
    return ctx.redirect('/login');
  }
  let deb = db.stores.file.store.registration;
  if (deb[ctx.request.body.email].name == ctx.request.body.email && 
      deb[ctx.request.body.email].password == ctx.request.body.password && 
      deb[ctx.request.body.email].admin == 'on') {
    db.set('admin', true);
    ctx.redirect('/admin');
  } else {
    msgslogin = 'Не верный логин или пароль';
    return ctx.redirect('/login');
  }
}