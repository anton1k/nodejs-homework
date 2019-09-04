const db = require('../models/db')();
let msgsregis ='';

module.exports.getRegistration = async(ctx, next) => {
  ctx.render('pages/registration', { title: 'Registration',
                              social: db.stores.file.store.social,
                              msgsregis});
} 

module.exports.sendRegistration = async(ctx, next) => {
  const nodemailer = require('nodemailer');
  const config = require('../config/config.json');

  //требуем наличия имени, обратной почты и текста
  if (!ctx.request.body.password || !ctx.request.body.email) {
    //если что-либо не указано - сообщаем об этом
    msgsregis = 'Все поля нужно запонить';
    return ctx.redirect('/registration');
  }

  //инициализируем модуль для отправки писем и указываем данные из конфига
  const transporter = nodemailer.createTransport(config.mail.smtp);

  const mailOptions = {
    from: `"C сайта" <${config.mail.smtp.auth.user}>`,
    to: ctx.request.body.email,
    subject: config.mail.subject,
    text:`
      Вы зарегистрировались
      Ваш логин: ${ctx.request.body.email}
      Ваш пароль: ${ctx.request.body.password}`
  };
  //отправляем почту
  transporter.sendMail(mailOptions, (error, info) => {
    //если есть ошибки при отправке - сообщаем об этом
    if (error) {
      msgsregis = 'Регистрация завершилась неудачей';
      return res.redirect('/registration');
    }
    
    // Пишем в фаил my-db.json
    db.set(`registration:${ctx.request.body.email}:name`, ctx.request.body.email);
    db.set(`registration:${ctx.request.body.email}:password`, ctx.request.body.password);
    db.set(`registration:${ctx.request.body.email}:admin`, ctx.request.body.admin);  
    db.save();
    
    
  });

  msgsregis = 'Вы зарегистрировались успешно';
  return ctx.redirect('/registration');
}