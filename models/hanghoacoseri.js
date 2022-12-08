let mongoose = require("mongoose");
let hanghoaCoSeri = mongoose.Schema(
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
    kho: {
      type: mongoose.Schema.Types.ObjectId, // đây là kho nhập đầu tiên.
      ref: "Kho"
    },
    trangthai: [
      {
        timeNumber: Number,
        status: Number, // 1 trong kho, 2 đã xuất
        khohientai: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Kho"
        },
        khohientaiString: String,
        idTrangthai: {
          type: String
        }
      }
    ],
    khoString: String, // đây là kho nhập lần đầu từ khi nhận hàng hóa về.
    status: Boolean,
    nguoncap: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Nguoncap"
    },
    nguoncapString: String,
    tongsoluong: {
      type: Number,
      default: 0
    },
    nhapkhoHistory: [
      {
        lichsunhapkho:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lichsunhapkho"
        },
        timeNumber: Number,
        soluong: Number,
    
      }
    ],
    xuatkhoHistory: [
      {
        lichsuxuatkho:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lichsuxuatkho"
        },
        soluong: Number,
    
      },
    ],
    thanhlyHistory: [
      {
        lichsuthanhly:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lichsuthanhly"
        },
        soluong: Number,
    
      },
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
        },
    
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
        },
    
      }
    ],
    hanghoathuhoi: [
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
var HanghoaCoSeri = mongoose.model("HanghoaCoSeri", hanghoaCoSeri);

module.exports = HanghoaCoSeri;
