//Carregando 
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const hbshelpers = require("handlebars-helpers");
const multihelpers = hbshelpers();
//**************************************************** */
//Start
//**************************************************** */
const app = express()
const contratante = require("./routes/usuario")
const anuncio = require("./routes/anuncio")
const categoria = require("./routes/categoria")
const usuario = require("./routes/usuario")
const passport = require("passport")
require("./config/auth")(passport) 

//**************************************************** */
//Configurações
//**************************************************** */

//Session
app.use(session({
    secret: "rqwerqwe341sr3414123" + Date(),
    resave: true,
    cookie: { maxAge: 3600000 },
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

//falsh
app.use(flash())


//Middleware
app.use((req, res, next) => { 

    ////console.log(req.user)

    // req.sessionOptions.maxAge = 24 * 60 * 60 * 1000 // 24 hours,
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    res.locals.bt_login = null

    res.locals.sidebar = 'mCustomScrollbar _mCS_1 mCS-autoHide mCS_no_scrollbar active'
    res.locals.active = 'active'


    //console.log(req.path)

    if (req.path.includes('/delete/')) {
        res.locals.bt_delete = 'X'
    }

    if (req.path.includes('/login')) {
        res.locals.bt_login = 'X'
        res.locals.bt_nuser = 'X'
        // req.user = null
        //res.locals.user = null
    }

    if (req.user == null && !req.path.includes('/add')) {
        res.locals.bt_login = 'X'
        //res.locals.bt_nuser = 'X'
    }

    if (req.path.includes('/show')||req.path.includes('/change')) {
        res.locals.bt_anuncios = 'X'
        res.locals.bt_search = 'X'
    }

    if (req.path.includes('/add') ||
        req.path.includes('/nova') ||
        req.path.includes('/edit')) {
        res.locals.bt_save = 'X'
    }

    if (req.path == '/admin/categorias' ||
        req.path.includes('/main')) {
        res.locals.bt_create = 'X'
        res.locals.bt_search = 'X'
        if (req.path == '/admin/categorias') {
            //temporário
            res.locals.bt_create_href = '/admin/categorias/add'

        } else {
            var path = req.path
            path = req.path
            path = path.replace("main", "add")
            console.log(path)
            res.locals.bt_create_href = path
        }

    }
    //console.log(req.path )
    if (req.path.includes('/logout') || req.path == '/') {
        //res.locals.bt_modify = 'X'
        res.locals.bt_search = 'X'
    }

    if (req.path.includes('/modify')) {
        res.locals.bt_modify = 'X'
        res.locals.bt_search = ''
    }

    next()
})

// Body Parse
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Handle Bars
app.engine('handlebars', handlebars({ defaultLayout: 'main', helpers: multihelpers }))
app.set('view engine', 'handlebars')


const http = require('http');

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello Umbler!');
});

const lmong = "mongodb://localhost/data1";

// Mongooose
mongoose.connect(lmong).then(() => {
    console.log("Sucesso ao conectar-se ao mongo")
}).catch((err) => {
    console.log(err+"Erro ao conectar-se ao mongo")
})

// Public 
app.use(express.static(path.join(__dirname, "public")))
//**************************************************** */
//Rotas
//**************************************************** */
app.use('/contratante', contratante)
app.use('/anuncio', anuncio)
app.use('/categoria', categoria)
app.use('/usuario', usuario)

require("./models/anuncios") 
const Anuncio = mongoose.model("anuncios")

require("./models/categorias")
const Categoria = mongoose.model("categorias")

app.get("/", function (req, res) {
    var until = new Date()
    if (req.user) {
        res.render("anuncio/index")
    } else {
      
       Categoria.find({ "status": 0 }).sort({ nome: 1 }).then((categorias) => {

        Anuncio.find({ "status": 0, dateUntil: { $gte: new Date() }, categoria: { $in: categorias } }).sort({ dateUntil: -1 }).populate("categoria").populate("contratante").then((anuncios) => {

                res.render("anuncio/show", { anuncios: anuncios, categorias: categorias })
            })
        })
    }
}) 


//**************************************************** */
//Outros
//**************************************************** */

//server.listen(port, () =>console.log("Umbler server at port:",port));
const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});





