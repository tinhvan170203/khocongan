let mongoose = require('mongoose');

let lichsuchuyenkho = mongoose.Schema({
    ngaychuyenkho: {
        type: String,
        required: true
    },
    khochuyendi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kho"
    },
    khochuyenden: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kho"
    },
    khochuyendiString: String,
    khochuyendenString: String,
    timeNumber: Number,
    canbochuyenkho: {
          type: String,
          required: true
    },
    ghichu: String
},  { timestamps: true });
var Lichsuchuyenkho = mongoose.model('Lichsuchuyenkho', lichsuchuyenkho);


module.exports = Lichsuchuyenkho;