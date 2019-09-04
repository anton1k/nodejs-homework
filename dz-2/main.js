const fs = require('fs');
const path = require('path');

const argv = process.argv[2];
const argv2 = process.argv[3];
const argv3 = process.argv[4];

let base = argv2 ? `./${argv2}` : './input';
let folderName = argv ? `./${argv}` : './isready';

// Создаем директорию, если ее нет
function isReady(params) {
  if (!fs.existsSync(params)){
    fs.mkdirSync(params);
  }
};

// Удалаем исходную папку вместе с файлами, если это нужно
function rimraf(dir_path) {
  if (fs.existsSync(dir_path)) {
      fs.readdirSync(dir_path).forEach(function(entry) {
          var entry_path = path.join(dir_path, entry);
          if (fs.lstatSync(entry_path).isDirectory()) {
              rimraf(entry_path);
          } else {
              fs.unlinkSync(entry_path);
          }
      });
      fs.rmdirSync(dir_path);
  }
};

function del() {
  if (argv2 && argv3 == 1) {
    rimraf(argv2);
    console.log('Delete');
  }

};

// Сортировка файлов

const sortDir = (base, level) => {
  return new Promise ((resolve) => {  
    const files = fs.readdirSync(base);
    
    files.forEach((item) => {
      let localBase = path.join(base, item);
      let state = fs.statSync(localBase);
      
      isReady(folderName);

      if (state.isDirectory()) {
        sortDir(localBase, level + 1);  
      } else {
        let is = path.join(folderName, item[0]); 

        isReady(is);
        
        let rs = fs.createReadStream(path.resolve(base, item));
        let ws = fs.createWriteStream(path.join(is, item));
        
        rs.pipe(ws);

      }  
    });
    resolve();
});
};

// Асинхронное выполнение функций, чтобы если надо удалить исходную папку, то она бы точно удалилась после того как основной код отработат

// sortDir(base, 0).then(del()); // Promises

let getData = async () => {
  try {
    await sortDir(base, 0);
    await del();
  } catch (error) {
    console.log(error);
  }
};

getData();
