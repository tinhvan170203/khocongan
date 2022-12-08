let mongoose = require('mongoose');
let kho = mongoose.Schema({
   tenkho: {
        type: String,
        required: true
    },
    tenchitiet: {
        type: String,
        required: true
    },
    thutu: {
          type: Number,
          required: true
    },
    vitri: {
        type: String,
        required: true
    }
},  { timestamps: true });
var Kho = mongoose.model('Kho', kho);


module.exports = Kho;