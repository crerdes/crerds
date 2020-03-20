const mongoose = require("mongoose")
const Schema = mongoose.Schema


const Categoria = new Schema({

    nome: {
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

    },

    dateDeactive: {
        type: Date,
    },    
    
    status: {
        type: Number,
        default: 0
    },    

    dateModify: {
        type: Date,
        default: Date.now()  
    }
})

mongoose.model("categorias", Categoria)

