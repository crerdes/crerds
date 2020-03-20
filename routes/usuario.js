const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/usuarios")
const Usuario = mongoose.model("usuarios")
require("../models/categorias")
const Categoria = mongoose.model("categorias")
const bcrypt = require("bcryptjs")
const passport = require("passport")

const {adm} = require("../config/checkAdm")

router.get('/usuario', (req, res) => {
    res.render("usuario/main")
})

router.get('/posts', (req, res) => {
    res.render("usuario/main")
})

router.get('/add', (req, res) => {
        res.render('usuario/add', { usuario: req.user })
 
})

router.get('/main/', (req, res) => {
    Usuario.find().sort({ nome: 1 }).then((usuarios) => {
        res.render('usuario/main', { usuarios: usuarios })
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar usuarios")
        res.redirect("/usuario/main")
    })
})

router.get('/edit/:id', (req, res) => {
    Usuario.findOne({ _id: req.params.id }).then((usuario) => {
        res.render('usuario/edit', {
            usuario: usuario,
            action: "edit",
            stateButton: ""
        })
    }).catch((err) => {
        req.flash("error_msg", "usuario não encontrado")
        res.redirect("/usuario/main")
    })

})

router.get('/delete/:id', (req, res) => {
    Usuario.findOne({ _id: req.params.id }).then((usuario) => {
        res.render('usuario/edit', {
            usuario: usuario,
            action: "delete",
            stateButton: "readonly"
        })
    }).catch((err) => {
        req.flash("error_msg", "usuario não encontrada")
        res.redirect("/usuario")
    })

})

router.post('/delete/', (req, res) => {
    Usuario.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Profissão apagada com sucesso")
        res.redirect("/usuario/main")
    }).catch((err) => {
        req.flash("error_msg", "Houve erro apagar profissão")
        res.redirect("/usuario")
    })
})


router.post('/edit/', (req, res) => {

    Usuario.findOne({ _id: req.body.id }).then((usuario) => {

        var errors = []

        if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {

            errors.push({ text: "Nome inválido" })
        }
        if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {

            errors.push({ text: "E-mail inválido" })
        }
        if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null || req.body.senha != req.body.senhaCheck) {


            errors.push({ text: "Senha inválida" })
        }

        if (errors.length > 0) {

            res.render('usuario/edit', { errors: errors, usuario: usuario })

        } else {

            usuario.nome = req.body.nome
            usuario.email = req.body.email                   
            usuario.contato = req.body.contato

            if (req.body.adm){
                usuario.adm = 1. 

            }else{
                usuario.adm = 0.  
            }

            ////console.log(usuario.adm)

            Usuario.findOne({ email: req.body.email }).then((usuarioCheck) => {

                if (usuarioCheck && usuarioCheck._id != req.body.id) {
                    req.flash("error_msg", "E-mail " + req.body.email + " existente")
                    res.redirect("/usuario/main")
                } else {                   

                    
                }

            })

            if (usuario.senha != req.body.senha) {

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(req.body.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", "Erro ao gerar a senha")
                            res.redirect("/usuario/main")
                        } else {
                            usuario.senha = hash
                        }
                    })
                })

            }                  
            usuario.save().then(() => {
                req.flash("success_msg", "Usuário modificado com sucesso")
                res.redirect('/usuario/main')
               // //console.log(usuario)
            }).catch((err) => {
               // //console.log(err)
                req.flash("error_msg", "Erro ao modificar Usuário")
                res.redirect("/usuario/main")
            })

        }

    }).catch((err) => {
        ////console.log(err)
        req.flash("error_msg", "Erro ao criar o registro")
        res.redirect("/usuario/main")
    })

    /* 
    Usuario.findOne({_id: req.body.id}).then((usuario)=>{

        usuario.nome     = req.body.nome
        usuario.contato  = req.body.contato
        usuario.email    = req.body.email
        usuario.desc     = req.body.desc
        usuario.data     = Date.now()

        Usuario.save().then(()=>{
            req.flash("success_msg", "usuario Editada com sucesso")
            res.redirect("/usuario/main")
        }).catch((err)=>{
            req.flash("error_msg", "Houve erro  usuario")
            res.redirect("/usuario/main")
        })        

    }).catch((err)=>{
        req.flash("error_msg", "Houve erro ao modificar usuario")
        res.redirect("/usuario")
    }) */
})


router.post('/add/nova', (req, res) => {

    var errors = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {

        errors.push({ text: "Nome inválido" })
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {

        errors.push({ text: "E-mail inválido" })
    }
    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null || req.body.senha != req.body.senhaCheck) {


        errors.push({ text: "Senha inválida" })
    }

    if (errors.length > 0) {

        res.render('usuario/add', { errors: errors })

    } else {

        Usuario.findOne({ email: req.body.email }).then((usuario) => {

            if (usuario) {
                req.flash("error_msg", "E-mail " + req.body.email + " existente")
                res.redirect("/usuario/main")

            } else {


                var adm = null

                if (req.body.adm){
                    adm = 1. 
    
                }else{
                    adm = 0.  
                }
    

                const novoUsuario = {
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    contato: req.body.contato,
                    adm: adm
                }

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", "Erro ao gerar a senha")
                            res.redirect("/usuario/main")
                        } else {
                            novoUsuario.senha = hash
                        }
                    })
                })

                new Usuario(novoUsuario).save().then(() => {           

                    if(novoUsuario.adm){
                        req.flash("success_msg", "Registro criado com sucesso")
                        res.redirect('/usuario/main')
                    }else{
                        req.flash("success_msg", "Registro criado com sucesso - Acesse sua conta")
                        res.redirect('/')
                    }
                    
                }).catch((err) => {
                    //console.log(err)
                    req.flash("error_msg", "Erro ao criar o registro")
                    res.redirect("/usuario/main")
                })
            }

        }).catch((err) => {
            //console.log(err)
            req.flash("error_msg", "Erro ao criar o registro")
            res.redirect("/usuario/main")
        })


    }
})

router.get("/login",(req,res)=>{
    Categoria.find().then((categorias) => {
    res.render("usuario/login",{categorias:categorias})
    })
})

router.get("/logout",(req,res,next)=>{
    req.logOut()
    res.clearCookie('rqwerqwe341sr3414123');
    req.flash("success_msg", "Acesso finalizado")
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.redirect("/")
})

router.post("/login", (req,res,next) =>{

    passport.authenticate("local",{
        successRedirect: "/anuncio/index",
        failureRedirect: "/usuario/login",
        failureFlash: true

    })(req,res,next)
})

module.exports = router
