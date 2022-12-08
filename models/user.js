let mongoose = require("mongoose");
let user = mongoose.Schema({
  tentaikhoan: {
    type: String,
    require: true,
    unique: true,
  },
  matkhau: String,
  tenhienthi: String,
  role: {
    type: String,
    default: "user",
  },
});


var User = mongoose.model("User", user);

module.exports = User;
