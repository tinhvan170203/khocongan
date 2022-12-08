let mongoose = require('mongoose');

let lichsuthanhly = mongoose.Schema({
    ngaythanhly: String,
    timeNumber: Number,
    canbothanhly: {
          type: String,
          required: true
    },
    ghichu: String
},  { timestamps: true });
var Lichsuthanhly = mongoose.model('Lichsuthanhly', lichsuthanhly);


module.exports = Lichsuthanhly;