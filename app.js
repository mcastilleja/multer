const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

// Crea el storage engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
        cb( null, file.fieldname + '-' + Date.now() + path.extname(file.originalname) );
    },
});

// Iniciamos a Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb)
    }
}).single('myImage');

// Checamos el tipo de archivo que se va a subir
const checkFileType = (file, cb) => {
    // Extensiones permitidas
    const fileTypes = /jpeg|jpg|png|gif/

    // Verificamos la extension
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase)

    // Verificamos el MIME Type o tipo de archivo aun que se renombre un .exe a .jpg
    const mimetype = fileTypes.test(file.mimetype)

    if( extname && mimetype ){
        return cb(null, true)
    } else {
        cb('Error: Sólo se admiten imagenes')
    }
}

// Inicializamos la app
const app = express();

// Definimos EJS como el engine
app.set('view engine', 'ejs');

// Carpeta public
app.use(express.static('./public'));

// Llamando el render del index
app.get('/', (req, res) => res.render('index'));
// Respuesta del upload
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err,
            })
        } else {
            if (req.file == undefined) {
                res.render('index', {
                    msg: 'Error no seleccionaste ningun archivo',
                })
            } else {
                res.render('index', {
                    msg: 'El archivo subio correctamente',
                    file: `uploads/${req.file.filename}`,
                })
            }
        }
    });
});

const port = 3000;

app.listen(port, () => console.log(`Servidor iniciado en el puerto ${port}`));
