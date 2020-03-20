const mongoose = require("mongoose")
const Schema = mongoose.Schema


const Contratado = new Schema({

    nome:{
        type: String,
        require: true
    },
    
    email: {
        type: String,
        require: true
    },

    contato: {
        type: String,
        require: true
    },

    desc: {
        type: String,
        require: true
    },

})

mongoose.model("contratados", Contratado)

