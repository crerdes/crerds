const mongoose = require("mongoose")
const Schema = mongoose.Schema


const Anuncio = new Schema({
 
    categoria:{

        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true

    },

    contratante:{
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true 
    },

    dateFrom: {
        type: Date,
        default: Date.now() 
    },

    dateUntil: {
        type: Date,
        required: true,
        default: Date.now() 
    },    

    dateDeactive: {
        type: Date,
        default: Date.now() 
    },    
    
    desc: {
        type: String
    },

    status: {
        type: Number, 
        default: 0
    },    

    complemento: {
        type: String
    },   

    dateModify: {
        type: Date,
        default: Date.now() 
    }, 

})

mongoose.model("anuncios", Anuncio)


