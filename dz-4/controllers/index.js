const db = require('../models/db')();

let msgemail = '';

module.exports.getIndex = async(ctx, next) => {
  ctx.render('pages/index', { skills: db.stores.file.store.skills, 
                              products: db.stores.file.store.products,
                              social: db.stores.file.store.social,
                              msgemail});
}

module.exports.sendData = async(ctx, next) => {
  const nodemailer = require('nodemailer');
  const config = require('../config/config.json');

  //требуем наличия имени, обратной почты и текста
  if (!ctx.request.body.name || !ctx.request.body.email || !ctx.request.body.message) {
    //если что-либо не указано - сообщаем об этом
    msgemail = 'Все поля нужно заполнить';
    return ctx.redirect('/#form');
  }
  //инициализируем модуль для отправки писем и указываем данные из конфига
  const transporter = nodemailer.createTransport(config.mail.smtp);
  let reqName = ctx.request.body.name;
  let reqEmail = ctx.request.body.email;
  let reqMessage = ctx.request.body.message;
  

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
  transporter.sendMail(mailOptions, (error, info) => {
    //если есть ошибки при отправке - сообщаем об этом
    if (error) {
      msgemail = 'При отпраке письма произошла ошибка';
      return ctx.redirect('/#form');
    }
    
    // Пишем в фаил my-db.json
    db.set(`messages:${reqEmail}:name`, reqName);
    db.set(`messages:${reqEmail}:email`, reqEmail);
    db.set(`messages:${reqEmail}:message`, reqMessage);  
    db.save();
    console.log('Соообщение отправлено');
  });

  msgemail = 'Соообщение отправлено';
  return ctx.redirect('/#form');
}


// module.exports.myWorks = async(ctx, next) => {
//   const works = db
//     .getState()
//     .works || []

//   ctx.render('pages/my-work', {
//     items: works,
//     authorised: ctx.session.isAuthorized
//   });
// }

// module.exports.uploadWork = async(ctx, next) => {
//   const {projectName, projectUrl, text} = ctx.request.body.fields;
//   const {name, size, path} = ctx.request.body.files.file;
//   let responseError = verifyForm(projectName, projectUrl, text);
//   if (responseError) {
//     await unlink(path);
//     return ctx.body = responseError;
//   }
//   if (name === "" || size === 0) {
//     await unlink(path);
//     return (ctx.body = {
//       mes: 'Не загружена картинка проекта',
//       status: 'Error'
//     });
//   }

//   let fileName = _path.join(process.cwd(), 'public/upload', name);

//   const errUpload = await rename(path, fileName);

//   if (errUpload) {
//     return (ctx.body = {
//       mes: "При загрузке проекта произошла ошибка rename file",
//       status: "Error"
//     });
//   }
//   db
//     .get("works")
//     .push({
//       name: projectName,
//       link: projectUrl,
//       desc: text,
//       picture: _path.join('upload', name)
//     })
//     .write();
//   ctx.body = {
//     mes: "Проект успешно загружен",
//     status: "OK"
//   };
// }

// module.exports.contactMe = async(ctx, next) => {
//   ctx.render('pages/contact-me');
// }

// module.exports.login = async(ctx, next) => {
//   ctx.render('pages/login');
// }

// module.exports.auth = async(ctx, next) => {
//   const {login, password} = ctx.request.body;
//   const user = db
//     .getState()
//     .user;
//   if (user.login === login && psw.validPassword(password)) {
//     ctx.session.isAuthorized = true;
//     ctx.body = {
//       mes: "Aвторизация успешна!",
//       status: "OK"
//     };
//   } else {
//     ctx.body = {
//       mes: "Логин и/или пароль введены неверно!",
//       status: "Error"
//     };
//   }
// }