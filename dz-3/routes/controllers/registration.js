const db = require('../../models/db')();

module.exports.getRegistration = function (req, res) {
  res.render('pages/registration', { title: 'Registration',
                              social: db.stores.file.store.social,
                              msgsregis: req.flash('msgsregis') });
}

module.exports.sendRegistration = function (req, res) {
  const nodemailer = require('nodemailer');
  const config = require('../../config.json');

  //требуем наличия имени, обратной почты и текста
  if (!req.body.password || !req.body.email) {
    //если что-либо не указано - сообщаем об этом
    req.flash('msgsregis', 'Все поля нужно запонить');
    res.redirect('/registration');
  }

  //инициализируем модуль для отправки писем и указываем данные из конфига
  const transporter = nodemailer.createTransport(config.mail.smtp);

  const mailOptions = {
    from: `"C сайта" <${config.mail.smtp.auth.user}>`,
    to: req.body.email,
    subject: config.mail.subject,
    text:`
      Вы зарегистрировались
      Ваш логин: ${req.body.email}
      Ваш пароль: ${req.body.password}`
  };
  //отправляем почту
  transporter.sendMail(mailOptions, function(error, info) {
    //если есть ошибки при отправке - сообщаем об этом
    if (error) {
      req.flash('msgsregis', 'Регистрация завершилась неудачей');
      res.redirect('/registration');
    }
    
    // Пишем в фаил my-db.json
    db.set(`registration:${req.body.email}:name`, req.body.email);
    db.set(`registration:${req.body.email}:password`, req.body.password);
    db.set(`registration:${req.body.email}:admin`, req.body.admin);  
    db.save();
    
    req.flash('msgsregis', 'Вы зарегистрировались успешно');
    res.redirect('/registration');
  });
}