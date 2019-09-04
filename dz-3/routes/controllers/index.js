const db = require('../../models/db')();

module.exports.getIndex = function (req, res) {
  
  res.render('pages/index', { title: 'Main',
                              skills: db.stores.file.store.skills,
                              products: db.stores.file.store.products,
                              social: db.stores.file.store.social,
                              msgemail: req.flash('msgemail')});
}

module.exports.sendData = function (req, res) {
  const nodemailer = require('nodemailer');
  const config = require('../../config.json');

  //требуем наличия имени, обратной почты и текста
  if (!req.body.name || !req.body.email || !req.body.message) {
    //если что-либо не указано - сообщаем об этом
    req.flash('msgemail', 'Все поля нужно заполнить');
    res.redirect('/#form');
  }
  //инициализируем модуль для отправки писем и указываем данные из конфига
  const transporter = nodemailer.createTransport(config.mail.smtp);
  let reqName = req.body.name;
  let reqEmail = req.body.email;
  let reqMessage = req.body.message;

  const mailOptions = {
    from: `"${reqName}" <${reqEmail}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text:`
      Отправил: ${reqName}
      Сообщение: ${reqMessage.trim().slice(0, 500)}
      Отправлено с: <${reqEmail}>`
  };
  //отправляем почту
  transporter.sendMail(mailOptions, function(error, info) {
    //если есть ошибки при отправке - сообщаем об этом
    if (error) {
      req.flash('msgemail', 'При отпраке письма произошла ошибка');
      res.redirect('/#form');
    }
    req.flash('msgemail', 'Соообщение отправлено');
    res.redirect('/#form');

    // Пишем в фаил my-db.json
    db.set(`messages:${reqEmail}:name`, reqName);
    db.set(`messages:${reqEmail}:email`, reqEmail);
    db.set(`messages:${reqEmail}:message`, reqMessage);  
    db.save();

  });
}