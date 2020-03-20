const express = require("express")
const router = express.Router()

const mongoose = require("mongoose")
require("../models/categorias")
const Categoria = mongoose.model("categorias")
const { adm } = require("../config/checkAdm")
const { auth } = require("../config/checkAdm")

router.get('/', adm, (req, res) => {
    res.render("categoria/index")
})

router.get('/posts', adm, (req, res) => {
    res.render("categoria/show")
})

router.get('/categoria/add', adm, (req, res) => {
    res.render('categoria/add')
})

/* MENU CATEGORIAS DE ANÚNCIOS */
router.get('/show/', adm, (req, res) => {
    Categoria.find().sort({ nome: 1 }).then((categorias) => {
        res.render('categoria/show', { categorias: categorias })
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar categorais")
        res.redirect("/")
    })
})

/* BOTÃO 'MODIFICAR' DA VIEW SHOW */
router.get('/edit/:id', adm, (req, res) => {
    Categoria.findOne({ _id: req.params.id }).then((categoria) => {
        Categoria.find().sort({ dateModify: -1 }).then((categorias) => {
            res.render('categoria/edit', {
                categoria: categoria,
                categorias: categorias
            })
        })
    }).catch((err) => {
        req.flash("error_msg", "Categoria não encontrada")
        res.redirect("/")
    })

})

/* router.get('/categorias/delete/:id',adm,(req,res) => {
    Categoria.findOne({_id:req.params.id}).then((categoria) =>{
        req.flash("bt_save", "X")
        res.render('categoria/editacategoria', {categoria: categoria,
                                            action: "delete",
                                            stateButton: "readonly"})
    }).catch((err) =>{
        req.flash("error_msg", "Categoria não encontrada")
        res.redirect("/categoria")
    })
    
}) */

/* router.post('/editacategoria/delete/',adm,(req,res)=>{
    Categoria.remove({_id: req.body.id}).then(() =>{
        req.flash("success_msg", "Profissão apagada com sucesso")
        res.redirect("/categoria/categorias")
    }).catch((err)=>{
        req.flash("error_msg", "Houve erro apagar profissão")
        res.redirect("/categoria")
    })
}) */


router.post('/edit', adm, (req, res) => {
    console.log("aqui")
    Categoria.findOne({ _id: req.body.id }).then((categoria) => {

        categoria.nome = req.body.nome
        categoria.desc = req.body.desc
        categoria.dateModify = Date.now()

        categoria.save().then(() => {
            req.flash("success_msg", "Modificada com sucesso")
            res.redirect("/categoria/edit/" + categoria._id)
        }).catch((err) => {
            req.flash("error_msg", "Houve erro ao modificar categoria")
            res.redirect("/categoria/edit")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao modificar categoria")
        res.redirect("/categoria")
    })
})


router.post('/categoria/nova', adm, (req, res) => {

    var errors = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {

        errors.push({ text: "Nome inválido" })
    }

    if (!req.body.desc || typeof req.body.desc == undefined || req.body.desc == null) {

        errors.push({ text: "Descrição inválida" })
    }

    if (errors.length > 0) {
        res.render('categoria/add', { errors: errors })

    } else {

        const novaCategoria = {
            nome: req.body.nome,
            desc: req.body.desc
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Criado com sucesso")
            res.redirect('/categoria/add')
        }).catch(() => {
            req.flash("error_msg", "Erro ao criar o registro")
            res.redirect("/")
        })

    }
})

router.post('/change', auth, (req, res) => {

    //console.log(req.body)

    var status = null
    var id = null
    var dateDeactive = null

    if (req.body.option2) {
        status = 1
        id = req.body.option2
        dateDeactive = new Date()
    }
    if (req.body.option1) {
        status = 0
        id = req.body.option1
    }
    if (req.body.option3) {
        id = req.body.option3
        // status = 0
    }

    Categoria.findOne({ _id: id }).then((categoria) => {

        if (!req.body.option3) {
            categoria.status = status
        }
        categoria.dateModify = new Date()

        if (dateDeactive && status === 1) {
            categoria.dateDeactive = dateDeactive
        }

        // console.log("aqui")

        categoria.save().then(() => {

            Categoria.find().then((categorias) => {

                if (!req.body.option3) {
                    req.flash("success_msg", "Modificado com sucesso")
                    res.render("categoria/show", {
                        categorias: categorias
                    })
                } else {
                    res.redirect("/categoria/edit/" + req.body.option3)
                }

            })

        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Houve erro ao gravar categoria")
            res.redirect("/")
        })

    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Houve erro ao modificar categoria")
        res.redirect("/")
    })
})

module.exports = router

