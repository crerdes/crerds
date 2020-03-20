module.exports ={

    auth: function(req,res,next){

        if(req.isAuthenticated()){
            return next()
        }
        //next()
        req.flash("error_msg", "Acesso sua conta primeiramente")
        res.redirect("/")
    },
    adm: function(req,res,next){

        if(req.isAuthenticated() && req.user.adm > 0 ){
            return next()
        }
        //next()
        req.flash("error_msg", "Necessário acesso administrativo")
        res.redirect("/")
    }
}