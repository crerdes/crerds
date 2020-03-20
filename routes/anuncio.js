const express = require("express")
const router = express.Router()

const mongoose = require("mongoose")
require("../models/anuncios")
const Anuncio = mongoose.model("anuncios")
require("../models/categorias")
const Categoria = mongoose.model("categorias")
require("../models/usuarios")
const Contratante = mongoose.model("usuarios")
const { adm } = require("../config/checkAdm")
const { auth } = require("../config/checkAdm")

router.get('/anuncio', adm, (req, res) => {
    res.render("anuncio/main")
})

router.get('/index', (req, res) => {

    Categoria.find({ "status": 0 }).sort({ nome: 1 }).then((categorias) => {

        Anuncio.find({ "status": 0, categoria: { $in: categorias } }).sort({ dateUntil: -1 }).populate("categoria").populate("contratante").then((anuncios) => {

            Contratante.find().sort({ nome: 1 }).then((contratantes) => {
  
                res.render("anuncio/index", { 
                    anuncios: anuncios,
                    categorias: categorias,
                    contratantes: contratantes

                })
            })

        }).catch((err) => {
            req.flash("error_msg", "Houve erro lsitar categorias")
            res.redirect("/anuncio")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve erro lsitar categorias")
        res.redirect("/anuncio")
    })


})

router.get('/posts', adm, (req, res) => {
    res.render("anuncio/main")
})

router.get('/add', auth, (req, res) => {

    Categoria.find({ "status": 0 }).sort({ nome: 1 }).then((categorias) => {

        Anuncio.find({ "status": 0, categoria: { $in: categorias } }).sort({ dateUntil: -1 }).populate("categoria").populate("contratante").then((anuncios) => {

            Contratante.find().sort({ nome: 1 }).then((contratantes) => {

                res.render('anuncio/add', {
                    anuncios: anuncios,
                    categorias: categorias,
                    contratantes: contratantes,
                    dateFrom: Date.now(),
                    dateUntil: Date.now(),
                })
            })

        }).catch((err) => {
            req.flash("error_msg", "Houve erro lsitar categorias")
            res.redirect("/")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve erro lsitar categorias")
        res.redirect("/")
    })

})
/*
router.get('/main/', (req, res) => {
    var until = new Date()
    if (req.user.adm) {
        Anuncio.find({ "status": 0 }).sort({ dateUntil: -1 }).populate("categoria").populate("contratante").then((anuncios) => {

            res.render('anuncio/main', { anuncios: anuncios })

        }).catch((err) => {
            req.flash("error_msg", "Houve erro ao listar anúncios")
            res.redirect("/")
        })
    } else {
        Anuncio.find({ contratante: req.user._id, "status": 0 }).populate("categoria").populate("contratante").then((anuncios) => {

            res.render('anuncio/main', { anuncios: anuncios })

        }).catch((err) => {
            req.flash("error_msg", "Houve erro ao listar os anúncios")
            res.redirect("/")
        })
    }
}) */

router.get('/show', (req, res) => {

    Categoria.find({ "status": 0 }).then((categorias) => {

        Anuncio.find({ "status": 0, dateUntil: { $gte: new Date() }, categoria: { $in: categorias } }).sort({ dateUntil: -1 }).populate("categoria").populate("contratante").then((anuncios) => {

            if (req.user) { 

                Anuncio.find({ "status": 0, contratante: req.user._id }).populate("categoria").populate("contratante").then((meusAnuncios) => {

                        res.render('anuncio/show', { anuncios: anuncios, categorias: categorias, meusAnuncios: meusAnuncios })

                })

            } else {

                    res.render('anuncio/show', { anuncios: anuncios, categorias: categorias })

            }
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar anuncios")
        res.redirect("/")
    })
})

router.get('/edit/:id', auth, (req, res) => {

    Categoria.find({ "status": 0 }).then((categorias) => {

        Anuncio.findOne({ _id: req.params.id, categoria: { $in: categorias } }).populate("categoria").populate("contratante").then((anuncio) => {

            Contratante.find().then((contratantes) => {

                res.render('anuncio/edit', {
                    anuncio: anuncio,
                    action: "edit",
                    categorias: categorias,
                    contratantes: contratantes,
                    stateButton: ""
                })
            })
        })
    }).catch((err) => {
        req.flash("error_msg", "Anúncio não encontrado")
        res.redirect("/")
    })

}) 

router.get('/categoria/show/:id', (req, res) => {

    Categoria.find({ "status": 0 }).sort({ nome: 1 }).then((categorias) => {

        Anuncio.find({ "status": 0, categoria: req.params.id, dateUntil: { $gte: new Date() } }).populate("categoria").populate("contratante").then((anuncios) => {

            Contratante.find().sort({ nome: 1 }).then((contratantes) => {

                res.render('anuncio/show', { anuncios: anuncios, categorias: categorias, contratantes: contratantes }) 
            })
        })
    }).catch((err) => {
        req.flash("error_msg", "Anúncio não encontrado")
        res.redirect("/")
    })
})

router.get('/contratante/show/:id', auth, (req, res) => {

    Anuncio.find({ "status": 0 ,contratante: req.params.id }).populate("categoria").populate("contratante").then((anuncios) => {

        res.render('anuncio/show', { anuncios: anuncios, total: anuncios.length })

    }).catch((err) => {
        req.flash("error_msg", "Anúncio não encontrado")
        res.redirect("/")
    })

})

router.get('/delete/:id', auth, adm, (req, res) => {

    Categoria.findOne({ _id: anuncio.categoria.id, "status": 0 }).then((categorias) => {

        Anuncio.findOne({ _id: req.params.id, categoria: { $in: categorias },"status": 0 }).populate("categoria").populate("contratante").then((anuncio) => {

            Contratante.findOne({ _id: anuncio.contratante.id }).then((contratantes) => {

                res.render('anuncio/edit', {
                    anuncio: anuncio,
                    action: "delete",
                    categorias: categorias,
                    contratantes: contratantes,
                    stateButton: ""
                })

            })


        })

    }).catch((err) => {
        req.flash("error_msg", "Anúncio não encontrado")
        res.redirect("/")
    })

})

router.post('/delete/', auth, adm, (req, res) => {
    anuncio.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Apagado com sucesso")
        res.redirect("/anuncio/main")
    }).catch((err) => {
        req.flash("error_msg", "Houve erro apagar anúncio")
        res.redirect("/")
    })
})


router.post('/edit/', auth, (req, res) => {

    Anuncio.findOne({ _id: req.body.id}).then((anuncio) => { 

        anuncio.categoria = req.body.categoria
        anuncio.complemento = req.body.complemento,
        anuncio.contratante = req.body.contratante
        anuncio.dateFrom = new Date(req.body.dateFrom)
        anuncio.dateUntil = new Date(req.body.dateUntil)
        anuncio.desc = req.body.desc

        anuncio.save().then(() => {
            req.flash("success_msg", "Modificado com sucesso")
            res.redirect('/anuncio/edit/' + anuncio._id)
        }).catch((err) => {
            req.flash("error_msg", "Houve erro ao modificar Anúncio")
            res.redirect("/anuncio/main")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao modificar anúncio")
        res.redirect("/")
    })
})


router.post('/add/nova', auth, (req, res) => {

    var errors = []

    if (!req.body.categoria || typeof req.body.categoria == undefined || req.body.categoria == null) {

        errors.push({ text: "Categoria obrigatória" })
    }

    if (!req.body.contratante || typeof req.body.contratante == undefined || req.body.contratante == null) {

        errors.push({ text: "Contratante obrigatório" })
    }

    if (!req.body.dateUntil || typeof req.body.dateUntil == undefined || req.body.dateUntil == null) {

        errors.push({ text: "Data da disponibilidade inválida" })
    }

    if (errors.length > 0) {
        res.render('anuncio/add', { errors: errors })

    } else {
        //console.log(req.body.contratante)
        const novoanuncio = {
            categoria: req.body.categoria,
            complemento: req.body.complemento,
            contratante: req.body.contratante,
            dateFrom: new Date(req.body.dateFrom),
            dateUntil: new Date(req.body.dateUntil),
            desc: req.body.desc

        }

        new Anuncio(novoanuncio).save().then(() => {
            req.flash("success_msg", "Criado com sucesso")
            if (req.user.adm) {
                res.redirect('/anuncio/add')
            } else {
                res.redirect('/anuncio/add')
            }
        }).catch((err) => {
            //console.log(err)
            req.flash("error_msg", "Erro ao criar o registro..")
            res.redirect("/")
        })

    }
})

router.get('/show/change', auth, (req, res) => {

    Categoria.find({ "status": 0 }).then((categorias) => {

        Anuncio.find({ dateUntil: { $gte: Date.now() }, categoria: { $in: categorias } }).populate("categoria").populate("contratante").then((anuncios) => {

            res.render('anuncio/showUser', {
                anuncios: anuncios,
                total: anuncios.length,
                categorias: categorias
            })
        })

    }).catch((err) => {
        req.flash("error_msg", "Anúncio não encontrado")
        res.redirect("/")
    })

})

router.get('/contratante/show/user/:id', auth, (req, res) => {
    Categoria.find({ "status": 0 }).then((categorias) => {
        Anuncio.find({ contratante: req.params.id, dateUntil: { $gte: Date.now() }, categoria: { $in: categorias } }).populate("categoria").populate("contratante").then((anuncios) => {

            res.render('anuncio/showUser', {
                anuncios: anuncios,
                total: anuncios.length,
                categorias: categorias

            })
        })

    }).catch((err) => {
        req.flash("error_msg", "Anúncio não encontrado")
        res.redirect("/")
    })

})

router.post('/change', auth, (req, res) => {

    //console.log("aquiss")

    var status = null
    var id = null

    // console.log(req.body)
    if (req.body.option2) {
        status = 1
        id = req.body.option2
    }
    if (req.body.option1) {
        status = 0
        id = req.body.option1
    }
    if (req.body.option3) {
        id = req.body.option3
        //status = 0
    }

    Anuncio.findOne({ _id: id }).then((anuncio) => {

        anuncio.status = status
        
        anuncio.dateModify = new Date()

        anuncio.save().then(() => {

            Categoria.find({ "status": 0 }).then((categorias) => {

                Anuncio.find({ contratante: anuncio.contratante, dateUntil: { $gte: new Date() }, categoria: { $in: categorias }

                }).sort({ dateModify: -1 }).populate("categoria").populate("contratante").then((anuncios) => {


                    if (!req.body.option3) {
                        res.render("anuncio/showUser", {
                            anuncios: anuncios,
                            total: anuncios.length,
                            categorias: categorias 
                        })
                    } else {
                        res.redirect("/anuncio/edit/" + req.body.option3)
                    }

                })
            })
        }).catch((err) => {
            //console.log("errooo")
            req.flash("error_msg", "Houve erro ao gravar anúncio #anuncio.router.get('/user/active'002")
            res.redirect("/")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao modificar anúncios #anuncio.router.get('/user/active'001")
        res.redirect("/")
    })
})

router.get('/showUser/', auth, (req, res) => {

    Categoria.find({ "status": 0 }).then((categorias) => {

        Anuncio.findOne({ _id: req.body.id, categoria: { $in: categorias },"status": 0 }).populate("categoria").populate("contratante").then((anuncios) => {

            res.render('anuncio/showUser', { anuncios: anuncios, categorias: categorias })
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar de anúncios")
        res.redirect("/anuncio/show")
    })
})

module.exports = router
