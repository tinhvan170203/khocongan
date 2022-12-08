let mongoose = require('mongoose');
let nguoncap = mongoose.Schema({
   tennguoncap: {
        type: String,
        required: true
    },
    chitiet: {
        type: String,
        required: true
    },
    thutu: {
          type: Number,
          required: true
    }
},  { timestamps: true });
var Nguoncap = mongoose.model('Nguoncap', nguoncap);


module.exports = Nguoncap;