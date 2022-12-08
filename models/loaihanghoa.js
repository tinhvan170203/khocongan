let mongoose = require("mongoose");
let loaihanghoa = mongoose.Schema(
  {
    tenloaihanghoa: {
      type: String,
      required: true,
    },
    danhmuc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Danhmuc"
    },
    nuocSX: String,
    thutu: {
      type: Number
    }
  },
  { timestamps: true }
);
var Loaihanghoa = mongoose.model("Loaihanghoa", loaihanghoa);

module.exports = Loaihanghoa;
