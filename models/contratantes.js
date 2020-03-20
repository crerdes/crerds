const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Contratante = new Schema({

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
    data: {
        type: Date,
        default: Date.now()

    }    

})

mongoose.model("contratantes", Contratante)

