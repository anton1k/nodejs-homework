const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const db = require('../../models/db')();

module.exports.getAdmin = function (req, res) {
  let admin = db.stores.file.store.admin;
  if (admin) {
    res.render('pages/admin', { title: 'Admin', 
                                msgskill: req.flash('msgskill'),
                                uplproduct: req.flash('uplproduct') });
  }
  return res.json({msg:'У вас нет доступа к этому разделу сайта!', status: 'Error'});
}

module.exports.sendSkills = function (req, res) {

  if (req.body.age) {
    db.set("skills:age:number", req.body.age);
  }
  if (req.body.concerts) {
     db.set("skills:concerts:number", req.body.concerts);
  }
  if (req.body.cities) {
    db.set("skills:cities:number", req.body.cities);
  }
  if (req.body.years) {
    db.set("skills:years:number", req.body.years);
  }
  db.save();
  req.flash('msgskill', 'Данные обнавлены успешно');
  res.redirect('/admin');
}

module.exports.sendUpload = function (req, res, next) {
  let keys = 1;
  let str = JSON.stringify(db.stores.file.store.products);
  let obj = JSON.parse(str);

  for (let iterator in obj) {
    keys++;
  }

  let form = new formidable.IncomingForm();
  let upload = path.join('./public/assets/img/', 'products');
  let fileName;

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }

  form.uploadDir = path.join(process.cwd(), upload);

  form.parse(req, function (err, fields, files) {
    if (err) {
      return next(err);
    }
    if ((files.photo.name === '' || files.photo.size === 0)  && !fields.price && !fields.name) {
      fs.unlink(files.photo.path);
      req.flash('uplproduct', 'Все поля нужно заполнить');
      res.redirect('/admin');
    }
    
    fileName = path.join(upload, files.photo.name);

    fs.rename(files.photo.path, fileName, function (err) {
      if (err) {
        console.error(err);
        fs.unlink(fileName);
        fs.rename(files.photo.path, fileName);
      }
    
      // Пишем в фаил my-db.json
      db.set(`products:item${keys}:src`, `./assets/img/products/${files.photo.name}`);
      db.set(`products:item${keys}:name`, fields.name);
      db.set(`products:item${keys}:price`, fields.price);  
      db.save();
      
      req.flash('uplproduct', 'Продукт успешно добавлен');
      res.redirect('/admin');
    }); 
     
  });
}