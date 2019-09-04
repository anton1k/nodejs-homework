const http = require('http');
const port = 3000;
const interval = process.argv[2] || 1000;
const clear = process.argv[3] || 5000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
      let date;
      let int = setInterval(() => {
        date = new Date();
        console.log(date.toUTCString());
      }, interval);
      
      setTimeout(() => {
        clearInterval(int);
        res.write(`Time stop: ${date.toUTCString()} 
                  Date: ${date.getFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}
                  Time: ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}
                  `);
        res.end();
      }, clear);  
    } else {
        res.end('No Get');
    }   
});

server.listen(port, () => console.log(`Srver running on port: ${port}`));
