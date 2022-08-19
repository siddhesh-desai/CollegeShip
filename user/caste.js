const T = require("tesseract.js")

T.recognize('./castesan.jpeg', 'eng', {logger: e => console.log(e)})
   .then(out => console.log(out.data.text))