let mongoose = require("mongoose");
let hanghoaNoneSeri = mongoose.Schema(
  {
    mark: { 
        // seri, size, model 
      type: String,
    },
    loaihanghoa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loaihanghoa"
    },
    loaihanghoaString: String,
    danhmucString: String,
    trangthai: [
      {
        timeNumber: Number,
        status: Number, // 1 trong kho, 2 đã xuất, 3 đã thu hồi, 4 thanh lý
        khohientai: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Kho"
        },
        khohientaiString: String,
        idTrangthai: {
          type: String,
        }
      }
    ],
    kho: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kho"
    }, // kho hiện tại chứa hàng hóa
    khoString: String,
    status: Boolean, // ở trong kho hay đã cấp phát
    tongsoluong: { //hàng nhập mới ở trong kho
      type: Number,
      default: 0
    },
    nguoncap: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Nguoncap"
    },
    nguoncapString: String,
    nhapkhoHistory: [
      {
        lichsunhapkho:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lichsunhapkho"
        },
        timeNumber: Number,
        soluong: {
          type: Number,
          default: 0
        }
      }
    ],
    xuatkhoHistory: [
      {
        lichsuxuatkho:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lichsuxuatkho"
        },
        timeNumber: Number,
        soluong: {
          type: Number,
          default: 0
        }
      }
    ],
    thanhlyHistory: [
      {
        lichsuthanhly:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lichsuthanhly"
        },
        timeNumber: Number,
        soluong: {
          type: Number,
          default: 0
        }
      }
    ],
    hanghoachuyenkhodi: [
      {
        lichsuchuyenkho:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lichsuchuyenkho"
        },
        timeNumber: Number,
        soluong: {
          type: Number,
          default: 0
        }
      }
    ],
    hanghoachuyenkhoden: [
      {
        lichsuchuyenkho:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lichsuchuyenkho"
        },
        timeNumber: Number,
        soluong: {
          type: Number,
          default: 0
        }
      }
    ],
    hanghoathuhoi: [ // thu hồi về đúng kho khi bàn giao
      {
        lichsuthuhoi:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lichsuthuhoi"
        },
        timeNumber: Number,
        soluong: {
          type: Number,
          default: 0
        },
        donviString: String
      }
    ],
    hanghoathuhoichuyendikhokhac: [
      {
        lichsuthuhoi:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lichsuthuhoi"
        },
        timeNumber: Number,
        soluong: {
          type: Number,
          default: 0
        },
        donviString: String
      }
    ],
    hanghoathuhoichuyendentukhokhac: [
      {
        lichsuthuhoi:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lichsuthuhoi"
        },
        timeNumber: Number,
        soluong: {
          type: Number,
          default: 0
        },
        donviString: String
      }
    ]
  },
  { timestamps: true }
);
var HanghoaNoneSeri = mongoose.model("HanghoaNoneSeri", hanghoaNoneSeri);

module.exports = HanghoaNoneSeri   ;
