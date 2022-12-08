let mongoose = require('mongoose');
let lichsunhapkho = mongoose.Schema({
    thoigiannhapkho: {
        type: String,
        required: true
    },
    kho: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kho"
    },
    khoString: String,
    timeNumber: Number,
    tongsoluonghangnhap: Number,
    ngay: String,
    canbonhapkho: {
          type: String,
          required: true
    },
    ghichu: String
},  { timestamps: true });
var Lichsunhapkho = mongoose.model('Lichsunhapkho', lichsunhapkho);


module.exports = Lichsunhapkho;