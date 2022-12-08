let mongoose = require('mongoose');
let donvi = mongoose.Schema({
   tendonvi: {
        type: String,
        required: true
    },
    kyhieu: {
        type: String,
        required: true
    },
    thutu: {
          type: Number,
          required: true
    }
},  { timestamps: true });
var Donvi = mongoose.model('Donvi', donvi);


module.exports = Donvi;