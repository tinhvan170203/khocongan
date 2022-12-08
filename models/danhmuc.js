let mongoose = require('mongoose');
let danhmuc = mongoose.Schema({
   tendanhmuc: {
        type: String,
        required: true
    },
    phanloai: {
        type: String,
        required: true
    },
    thutu: {
          type: Number,
          required: true
    },
    donvitinh: {
        type: String,
        required: true
    }
},  { timestamps: true });
var Danhmuc = mongoose.model('Danhmuc', danhmuc);


module.exports = Danhmuc;