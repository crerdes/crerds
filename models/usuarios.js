const mongoose = require("mongoose")
const Schema = mongoose.Schema


const Usuario = new Schema({
    nome: {
        type: String
    },
    email:{

        type: String,
        required: true

    },
    contato: {
        type: String
    },   
    adm: {
        type: Number,
        default: 0
    },
    senha:{
        type: String,
        required: true
    },
    desc: {
        type: String,
        require: true
    },
    data: {
        type: Date,
        default: Date.now()

    }        

})

mongoose.model("usuarios", Usuario)

