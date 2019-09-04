const fs = require('fs');
const _path = require('path');
const db = require('../models/db')();
const util = require('util');

const rename = util.promisify(fs.rename);
const unlink = util.promisify(fs.unlink);

let msgskill = '';
let uplproduct = '';

module.exports.getAdmin = async (ctx, next) => {
  let admin = db.stores.file.store.admin;
  console.log(admin);

  if (admin) {
    return ctx.render('pages/admin', {
      title: 'Admin',
      msgskill,
      uplproduct
    });
  }
  ctx.body = {
    msg: 'У вас нет доступа к этому разделу сайта!',
    status: 'Error'
  };
}

module.exports.sendSkills = async (ctx, next) => {

  if (ctx.request.body.age) {
    db.set("skills:age:number", ctx.request.body.age);
  }
  if (ctx.request.body.concerts) {
    db.set("skills:concerts:number", ctx.request.body.concerts);
  }
  if (ctx.request.body.cities) {
    db.set("skills:cities:number", ctx.request.body.cities);
  }
  if (ctx.request.body.years) {
    db.set("skills:years:number", ctx.request.body.years);
  }
  db.save();
  msgskill = 'Данные обнавлены успешно';
  return ctx.redirect('/admin');
}

module.exports.sendUpload = async (ctx, next) => {
  let keys = 1;
  let str = JSON.stringify(db.stores.file.store.products);
  let obj = JSON.parse(str);

  for (let iterator in obj) {
    keys++;
  }

  const text = ctx.request.body.fields.name;
  const price = ctx.request.body.fields.price;
  const {
    name,
    size,
    path
  } = ctx.request.body.files.photo;


  if ((name === '' || size === 0) || !price || !text) {
    await unlink(path);
    uplproduct = 'Все поля нужно заполнить';
    return ctx.redirect('/admin');
  }

  let fileName = _path.join(process.cwd(), 'public/assets/img/products', name);

  const errUpload = await rename(path, fileName);

  if (errUpload) {
    uplproduct = 'При загрузке проекта произошла ошибка rename file';
    return ctx.redirect('/admin');
  }

  // Пишем в фаил my-db.json
  db.set(`products:item${keys}:src`, `./assets/img/products/${name}`);
  db.set(`products:item${keys}:name`, text);
  db.set(`products:item${keys}:price`, price);
  db.save();

  uplproduct = 'Продукт успешно добавлен';
  return ctx.redirect('/admin');
}