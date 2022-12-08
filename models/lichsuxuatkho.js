let mongoose = require('mongoose');

let lichsuxuatkho = mongoose.Schema({
    ngayxuatkho: String,
    donvitiepnhan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donvitructhuoc"
    },
    donvitiepnhanString: String,
    timeNumber: Number,
    donvi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donvi"
    },
    donviString: String,
    canboxuatkho: {
          type: String,
          required: true
    },
    canbotiepnhan: {
          type: String,
          required: true
    },
    ghichu: String
},  { timestamps: true });
var Lichsuxuatkho = mongoose.model('Lichsuxuatkho', lichsuxuatkho);


module.exports = Lichsuxuatkho;