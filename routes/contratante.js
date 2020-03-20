const express = require("express")
const router = express.Router()

const mongoose = require("mongoose")
require("../models/usuarios")
const Contratante = mongoose.model("usuarios")

router.get('/contratante', (req, res) => { 
    res.render("contratante/main")
})

router.get('/posts', (req, res) => {
    res.render("contratante/main")
})

router.get('/add', (req, res) => {
    res.render('contratante/add')
})

router.get('/main/', (req, res) => {
    Contratante.find().sort({nome: 1}).then((contratantes) => {
        res.render('contratante/main', {contratantes: contratantes})
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar contratantes")
        res.redirect("/contratante/main")
    })    
})  

router.get('/edit/:id',(req,res) => {
    Contratante.findOne({_id:req.params.id}).then((contratante) =>{
        res.render('contratante/edit', {contratante: contratante,
                                        action: "edit",
                                        stateButton: ""})
    }).catch((err) =>{
        req.flash("error_msg", "Contratante não encontrado")
        res.redirect("/contratante/main")
    })
    
})

router.get('/delete/:id',(req,res) => {
    Contratante.findOne({_id:req.params.id}).then((contratante) =>{
        res.render('contratante/edit', {contratante: contratante,
                                            action: "delete",
                                            stateButton: "readonly"})
    }).catch((err) =>{
        req.flash("error_msg", "Contratante não encontrada")
        res.redirect("/contratante")
    })
    
})

router.post('/delete/',(req,res)=>{
    Contratante.remove({_id: req.body.id}).then(() =>{
        req.flash("success_msg", "Profissão apagada com sucesso")
        res.redirect("/contratante/main")
    }).catch((err)=>{
        req.flash("error_msg", "Houve erro apagar profissão")
        res.redirect("/contratante")
    })
})


router.post('/edit/', (req, res) => {
    Contratante.findOne({_id: req.body.id}).then((contratante)=>{

        contratante.nome     = req.body.nome
        contratante.contato  = req.body.contato
        contratante.email    = req.body.email
        contratante.desc     = req.body.desc
        contratante.data     = Date.now()

        contratante.save().then(()=>{
            req.flash("success_msg", "Contratante Editada com sucesso")
            res.redirect("/contratante/main")
        }).catch((err)=>{
            req.flash("error_msg", "Houve erro  contratante")
            res.redirect("/contratante/main")
        })        

    }).catch((err)=>{
        req.flash("error_msg", "Houve erro ao modificar contratante")
        res.redirect("/contratante")
    })
})


router.post('/add/nova', (req, res) => {

    var errors = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null ) {

        errors.push({ text: "Nome inválido" })
    }

    if (!req.body.contato || typeof req.body.contato == undefined || req.body.contato == null ) {

        errors.push({ text: "contato inválido" })
    }

    if (!req.body.desc || typeof req.body.desc == undefined || req.body.desc == null ) {

        errors.push({ text: "Descrição inválida" })
    }

    if (errors.length > 0) {
        res.render('contratante/add', { errors: errors })

    } else { 

        const novoContratante = {
            nome:       req.body.nome,
            email:      req.body.email,            
            contato:    req.body.contato,
            desc:       req.body.desc
        }

        new Contratante(novoContratante).save().then(() => {
            req.flash("success_msg", "Registro criado com sucesso")
            res.redirect('/contratante/main')
        }).catch((err) => {
          //  //console.log(err)
            req.flash("error_msg", "Erro ao criar o registro")
            res.redirect("/contratante/main")
        })

    }
})

module.exports = router
