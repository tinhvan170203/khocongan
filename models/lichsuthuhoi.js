let mongoose = require('mongoose');

let lichsuthuhoi = mongoose.Schema({
    ngaythuhoi: String,
    timeNumber: Number,
    donvi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donvi"
    },
    donviString: String,
    canbothuhoi: {
          type: String,
          required: true
    },
    canbobangiao: {
          type: String,
          required: true
    },
    ghichu: String,
    khothuhoi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kho"
    },
    khothuhoiString: String
},  { timestamps: true });
var Lichsuthuhoi = mongoose.model('Lichsuthuhoi', lichsuthuhoi);


module.exports = Lichsuthuhoi;