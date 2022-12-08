const User = require("../models/user");
const mongoose = require("mongoose");
const Donvi = require("../models/donvi");
let jwt = require("jsonwebtoken");
const Donvitructhuoc = require("../models/donvitructhuoc");
const Nguoncap = require("../models/nguoncap");
const Kho = require("../models/kho");
const Danhmuc = require("../models/danhmuc");
const Loaihanghoa = require("../models/loaihanghoa");
const Lichsunhapkho = require("../models/lichsunhapkho");
const HanghoaNoneSeri = require("../models/hanghoanoneseri");
const HanghoaCoSeri = require("../models/hanghoacoseri");
const { concat } = require("lodash");
const Lichsuchuyenkho = require("../models/lichsuchuyenkho");
const Lichsuxuatkho = require("../models/lichsuxuatkho");
const Lichsuthanhly = require("../models/lichsuthanhly");
const Lichsuthuhoi = require("../models/lichsuthuhoi");

module.exports = {
  loginPage: async (req, res) => {
    let tentaikhoan = "";
    res.render("./admin/login", {
      message: req.flash("mess"),
      tentaikhoan,
    });
  },
  login: async (req, res) => {
    const { tentaikhoan, matkhau } = req.body;
    const user = await User.findOne(
      { tentaikhoan },
      { tentaikhoan: 1, matkhau: 1, role: 1 }
    );
    if (!user) {
      res.status(202).json("Đăng nhập thất bại. Tài khoản không tồn tại !");
      return;
    }
    if (user.matkhau !== matkhau) {
      res.status(203).json("Đăng nhập thất bại. Mật khẩu không chính xác !");
      return;
    }
    let token = jwt.sign(
      { tentaikhoan: user.tentaikhoan, _id: user._id },
      "vuvantinh"
    );
    if(user.role === 'user'){
      res.cookie("khoPH10", token,{
        expires: new Date(Date.now() + 900000000000) // expires in 24 hours
         });
      res.status(200).json(`/trangchu`);
    }else{
      res.cookie("khoPH10", token,{
        expires: new Date(Date.now() + 900000000000) // expires in 24 hours
         });
      res.status(200).json(`/quan-tri/${user._id}/tai-khoan`);
    }
  },

  logout: async (req, res) => {
    res.cookie("khoPH10", "", { maxAge: 1 });
    req.flash("mess", "Đăng xuất thành công!");
    res.redirect("/quan-tri/login");
  },

  doimatkhauPage: async (req, res) => {
    try {
      let tentaikhoan = "";
      res.render("./admin/doimatkhau", {
        message: req.flash("mess"),
        tentaikhoan,
      });
    } catch (error) {
      console.log(error.message);
    }
  },
  doimatkhau: async (req, res) => {
    const { tentaikhoan, matkhaucu, matkhaumoi } = req.body;
    const user = await User.findOne({ tentaikhoan });
    if (!user) {
      res.status(202).json("Tài khoản không tồn tại !");
      return;
    }
    if (user.matkhau !== matkhaucu) {
      res.status(203).json("Mật khẩu cũ không chính xác !");
      return;
    }
    user.matkhau = matkhaumoi;
    await user.save();
    res.cookie("khoPH10", "", { maxAge: 1 });
    res.status(200).json("Đổi mật khẩu thành công...");
  },

  getTaikhoanPage: async (req, res) => {
    let user = req.user;
    try {
      res.render("./admin/taikhoan", {
        user,
      });
    } catch (error) {
      console.log(err.message);
    }
  },
  addTaikhoan: async (req, res) => {
    const newAccount = new User(req.body);
    newAccount.matkhau = "@123";
    try {
      await newAccount.save();
      res.status(200).json(newAccount.tentaikhoan);
    } catch (error) {
      console.log(error.message);
    }
  },
  fetchedTaikhoan: async (req, res) => {
    try {
      const taikhoanList = await User.find().sort({ tentaikhoan: 1 });
      res.status(200).json(taikhoanList);
    } catch (error) {
      console.log(error.message);
    }
  },
  editTaikhoan: async (req, res) => {
    const id1 = req.params.id1;
    try {
      await User.findByIdAndUpdate(id1, req.body);
      res.status(200).json("Update thành công");
    } catch (error) {
      console.log(error.massage);
    }
  },
  deleteTaikhoan: async (req, res) => {
    const id1 = req.params.id1;
    try {
      await User.findByIdAndDelete(id1);
      res.status(200).json("Delete thành công");
    } catch (error) {
      console.log(error.message)
    }
  },

  donviPage: async (req, res) => {
    let user = req.user;
    res.render("./admin/donvi", {
      user,
    });
  },

  addDonvi: async (req, res) => {
    let newDonvi = new Donvi(req.body);
    try {
      await newDonvi.save();
      res.status(200).json(newDonvi.tendonvi);
    } catch (error) {
      console.log(error.message);
    }
  },

  fetchedDonvi: async (req, res) => {
    try {
      const donviList = await Donvi.find().sort({ thutu: 1 });
      res.status(200).json(donviList);
    } catch (error) {
      console.log(error.message);
    }
  },

  editDonvi: async (req, res) => {
    let id1 = req.params.id1;
    try {
      await Donvi.findByIdAndUpdate(id1, req.body);
      res.send("Update thành công");
    } catch (error) {
      console.log(error.message);
    }
  },

  deleteDonvi: async (req, res) => {
    let id1 = req.params.id1;
    try {
      await Donvi.findByIdAndDelete(id1);
      res.status(200).json("Xóa thành công");
    } catch (error) {
      console.log(error.message);
    }
  },
  getDonvitructhuocPage: async (req, res) => {
    let user = req.user;
    let donviList = await Donvi.find().sort({ thutu: 1 });

    try {
      res.render("./admin/donvitructhuoc", {
        user,
        donviList,
      });
    } catch (error) {
      console.log(err.message);
    }
  },
  addDonvitructhuoc: async (req, res) => {
    try {
      let newItem = new Donvitructhuoc(req.body);
      await newItem.save();
      res.status(200).json("Thêm mới thành công");
    } catch (err) {
      console.log(err.message);
    }
  },
  deleteDonvitructhuoc: async (req, res) => {
    let id2 = req.params.id2;
    try {
      await Donvitructhuoc.findByIdAndDelete(id2);
      res.status(200).json("Xóa thành công");
    } catch (error) {
      console.log(error.message);
    }
  },
  fetchDonvitructhuoc: async (req, res) => {
    let id1 =req.params.id1;
    try {
      let list =  await Donvitructhuoc.find({donvi: id1}).sort({thutu: 1});
      res.status(200).json(list)
    } catch (error) {
      console.log(error.message)
    }
  },
  editDonvitructhuoc: async (req, res) => {
    let id2 = req.params.id2;
    try {
      await Donvitructhuoc.findByIdAndUpdate(id2, {
        $set: req.body
      })
    res.status(200).json('update thành công')  
    } catch (error) {
        console.log(error.message)
    }
  },



  getNguoncapPage: async (req, res) => {
    let user = req.user;
    try {
      res.render("./admin/nguoncap", {
        user,
      });
    } catch (error) {
      console.log(error.message)
    }
  },
  addNguoncap: async (req, res) => {
    let newNguoncap = new Nguoncap(req.body);
    try {
      await newNguoncap.save();
      res.status(200).json(newNguoncap.tennguoncap);
    } catch (error) {
      console.log(error.message);
    }
  },

  fetchedNguoncap: async (req, res) => {
    try {
      const nguoncapList = await Nguoncap.find().sort({ thutu: 1 });
      res.status(200).json(nguoncapList);
    } catch (error) {
      console.log(error.message);
    }
  },

  editNguoncap: async (req, res) => {
    let id1 = req.params.id1;
    try {
      await Nguoncap.findByIdAndUpdate(id1, req.body);
      res.send("Update thành công");
    } catch (error) {
      console.log(error.message);
    }
  },

  deleteNguoncap: async (req, res) => {
    let id1 = req.params.id1;
    try {
      await Nguoncap.findByIdAndDelete(id1);
      res.status(200).json("Xóa thành công");
    } catch (error) {
      console.log(error.message);
    }
  },
  getKhoPage: async (req, res) => {
    res.render("./admin/tenkho", {
      user: req.user,
    });
  },
  addKho: async (req, res) => {
    let newKho = new Kho(req.body);
    try {
      await newKho.save();
      res.status(200).json(newKho.tenkho);
    } catch (error) {
      console.log(error.message);
    }
  },

  fetchedKho: async (req, res) => {
    try {
      const khoList = await Kho.find().sort({ thutu: 1 });
      res.status(200).json(khoList);
    } catch (error) {
      console.log(error.message);
    }
  },

  editKho: async (req, res) => {
    let id1 = req.params.id1;
    try {
      await Kho.findByIdAndUpdate(id1, req.body);
      res.send("Update thành công");
    } catch (error) {
      console.log(error.message);
    }
  },

  deleteKho: async (req, res) => {
    let id1 = req.params.id1;
    try {
      await Kho.findByIdAndDelete(id1);
      res.status(200).json("Xóa thành công");
    } catch (error) {
      console.log(error.message);
    }
  },
  danhmucPage: async (req, res) => {
    res.render("./admin/danhmuc", {
      user: req.user,
    });
  },
  addDanhmuc: async (req, res) => {
    let newDanhmuc = new Danhmuc(req.body);
    try {
      await newDanhmuc.save();
      res.status(200).json(newDanhmuc.tendanhmuc);
    } catch (error) {
      console.log(error.message);
    }
  },

  fetchedDanhmuc: async (req, res) => {
    try {
      const danhmucList = await Danhmuc.find().sort({ thutu: 1 });
      res.status(200).json(danhmucList);
    } catch (error) {
      console.log(error.message);
    }
  },

  editDanhmuc: async (req, res) => {
    let id1 = req.params.id1;
    try {
      await Danhmuc.findByIdAndUpdate(id1, req.body);
      res.send("Update thành công");
    } catch (error) {
      console.log(error.message);
    }
  },

  deleteDanhmuc: async (req, res) => {
    let id1 = req.params.id1;
    try {
      await Danhmuc.findByIdAndDelete(id1);
      res.status(200).json("Xóa thành công");
    } catch (error) {
      console.log(error.message);
    }
  },
  getLoaihanghoaPage: async (req, res) => {
    try {
      let danhmucList = await Danhmuc.find().sort({ thutu: 1 });
      let user = req.user;
      res.render("./admin/loaihanghoa", {
        user,
        danhmucList,
      });
    } catch (error) {}
  },
  addLoaihanghoa: async (req, res) => {
    let newLoaihanghoa = new Loaihanghoa(req.body);
    try {
      await newLoaihanghoa.save();
      res.status(200).json(newLoaihanghoa.tenloaihanghoa);
    } catch (error) {
      console.log(error.message);
    }
  },

  fetchedLoaihanghoa: async (req, res) => {
    try {
      const loaihanghoaList = await Loaihanghoa.find()
        .populate("danhmuc")
        .sort({ thutu: 1 });
      res.status(200).json(loaihanghoaList);
    } catch (error) {
      console.log(error.message);
    }
  },

  editLoaihanghoa: async (req, res) => {
    let id1 = req.params.id1;
    try {
      await Loaihanghoa.findByIdAndUpdate(id1, req.body);
      res.send("Update thành công");
    } catch (error) {
      console.log(error.message);
    }
  },

  deleteLoaihanghoa: async (req, res) => {
    let id1 = req.params.id1;
    try {
      await Loaihanghoa.findByIdAndDelete(id1);
      res.status(200).json("Xóa thành công");
    } catch (error) {
      console.log(error.message);
    }
  },
  // getDanhmuctrongkhoPage: async (req, res) => {
  //   try {
  //     let khoList = await Kho.find().sort({thutu: 1})
  //     let danhmucList = await Danhmuc.find().sort({thutu: 1});
  // let data = [];
  // for (item of danhmucList) {
  //   let hanghoas = await Loaihanghoa.find(
  //     { danhmuc: item._id },
  //     { _id: 1, tenloaihanghoa: 1 }
  //   );
  //   data.push({ danhmuc: item.tendanhmuc, hanghoas });
  // }
  //     res.render('./admin/danhmuchangtrongkho',{
  //       user: req.user,
  //       khoList,
  //       data
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // },

  // saveLoaihanghoaTrongkho: async (req, res) => {
  //   try {
  //     let arr = req.body;
  //     let {id_kho} = req.params
  //     for(let item of arr){
  //       let loaihanghoa = await Loaihanghoa.findById(item);
  //       console.log(loaihanghoa)

  //     }
  //   } catch (error) {

  //   }
  // }
  getNhapkhoPage: async (req, res) => {
    try {
      let khoList = await Kho.find().sort({ thutu: 1 });
      let loaihanghoaList = await Loaihanghoa.find()
        .populate("danhmuc")
        .sort({ thutu: 1 });
      let nguoncapList = await Nguoncap.find().sort({ thutu: -1 });

      res.render("./admin/nhapkho", {
        user: req.user,
        khoList,
        loaihanghoaList,
        nguoncapList,
      });
    } catch (error) {
      console.log(error.message);
    }
  },

  importKho: async (req, res) => {
    try {
      let thoigiannhapkho = req.body.kho.thoigiannhapkho;
      let timeNumber = Number(
        thoigiannhapkho.slice(0, 4) +
          thoigiannhapkho.slice(5, 7) +
          thoigiannhapkho.slice(8, 10) +
          thoigiannhapkho.slice(11, 13) +
          thoigiannhapkho.slice(14, 16)
      ); // timeNumber định dạng ở đây là yyyymmddhhmm

      let ngay = thoigiannhapkho.slice(0, 10); //ngày nhập kho

      let newLichsunhapkho = new Lichsunhapkho({
        // lịch sử nhập kho mới
        thoigiannhapkho: thoigiannhapkho,
        kho: req.body.kho.kho,
        khoString: req.body.kho.kho,
        canbonhapkho: req.body.kho.canbonhapkho,
        timeNumber,
        ngay,
        ghichu: req.body.kho.ghichu
      });

      let hanghoaList = req.body.hanghoa; // danh sách hàng hóa thêm vào [...]

      let tongsoluonghangnhap = 0; // tạo biến 
      for (hanghoa of hanghoaList) {
        // TH1: hàng hóa có Seri, mã vạch được quản lý thì luôn luôn tạo 1 bản ghi mới và tổng số lượng nhập luôn là 1
        if (
          hanghoa.phanloai ==
          "Có số seri, mã vạch và được cấp phát, quản lý, thu hồi và thanh lý"
        ) {
          let id2 = hanghoa.loaihanghoa
          let loaihanghoa = await Loaihanghoa.findById(id2).populate('danhmuc');

          let newHanghoa = new HanghoaCoSeri({
            loaihanghoa: hanghoa.loaihanghoa,
            mark: hanghoa.mark,
            kho: req.body.kho.kho,
            khoString: req.body.kho.kho, // kho đầu tiên khi nhập về CAT
            nguoncap: hanghoa.nguoncap,
            status: true,
            tongsoluong: 1,
            loaihanghoaString: hanghoa.loaihanghoa,
            nguoncapString: hanghoa.nguoncap,
            danhmucString: loaihanghoa.danhmuc._id.toString()
          });

          newHanghoa.nhapkhoHistory.push({
            // lịch sử nhập kho của hàng hóa được push thêm vào
            lichsunhapkho: newLichsunhapkho._id,
            soluong: 1,
            timeNumber
          });

          newHanghoa.trangthai.push({
            khohientai: req.body.kho.kho,
            khohientaiString: req.body.kho.kho,
            status: 1, // trạng thái 1 là trong kho
            timeNumber
          });

          tongsoluonghangnhap += 1;
          await newHanghoa.save();
        } else {

          // TH: hàng hóa không có seri, mã vạch đã có trong kho thì cộng tổng số lượng vào thôi
          let id2 = hanghoa.loaihanghoa
          let loaihanghoa = await Loaihanghoa.findById(id2).populate('danhmuc');

          let checkedHanghoa = await HanghoaNoneSeri.findOne({
            // kiểm tra xem loại hàng hóa với mark,nguồn cấp, có ở trong kho đó hay chưa
            loaihanghoa: hanghoa.loaihanghoa,
            mark: hanghoa.mark,
            kho: req.body.kho.kho,
            nguoncap: hanghoa.nguoncap,
          });

          // nếu chưa có hàng hóa loại này trong kho thì tiến hành thêm mới
          if (!checkedHanghoa) {
            let newHanghoa = new HanghoaNoneSeri({
              loaihanghoa: hanghoa.loaihanghoa,
              mark: hanghoa.mark,
              kho: req.body.kho.kho,
              khoString: req.body.kho.kho,
              nguoncap: hanghoa.nguoncap,
              tongsoluong: Number(hanghoa.soluong), // số lượng bằng số lượng nhập hàng vào
              loaihanghoaString: hanghoa.loaihanghoa,
              nguoncapString: hanghoa.nguoncap,
              danhmucString: loaihanghoa.danhmuc._id.toString()
            });

            newHanghoa.nhapkhoHistory.push({
              // lich sử nhập kho hàng hóa sẽ push them lich sử nhập kho vào
              lichsunhapkho: newLichsunhapkho._id,
              soluong: Number(hanghoa.soluong),
              timeNumber
            });

            newHanghoa.trangthai.push({
              khohientai: req.body.kho.kho,
              khohientaiString: req.body.kho.kho,
              status: 1,
              timeNumber
            });

            tongsoluonghangnhap += Number(hanghoa.soluong); // tổng số lượng nhập kho của cả lần đó

            await newHanghoa.save();
          } else {
            //đã có loại hàng hóa đó trong kho...
            checkedHanghoa.tongsoluong += Number(hanghoa.soluong); // tổng số lượng loại hàng hóa đó được cộng thêm
            //kiểm tra xem hàng hóa cùng loại khi nhập kho hay không
            //nếu cùng thì lichx sử nhập kho của hàng hóa chỉ là 1 và cộng tổng số lượng

            // kiểm tra xem hàng hóa đó có lịch sử nhập kho này hay chưa do có vòng lặp tạo ra trước đó nếu tạo mới sẽ push lich sử nhập kho r
            let checkedLoaihang = checkedHanghoa.nhapkhoHistory.find(
              (i) =>
                i.lichsunhapkho.toString() === newLichsunhapkho._id.toString()
            );

            if (checkedLoaihang === undefined) {
              // Trường hợp thêm mới chưa có trong kho hàng đó thì push lich sử nhập kho
              checkedHanghoa.nhapkhoHistory.push({
                lichsunhapkho: newLichsunhapkho._id,
                soluong: Number(hanghoa.soluong),
                timeNumber
              });

              checkedHanghoa.trangthai.push({
                khohientai: req.body.kho.kho,
                khohientaiString: req.body.kho.kho,
                status: 1,
                timeNumber
              });
            } else {
              // TH loại hàng giống nhau đã được lặp trước đó
              checkedLoaihang.soluong += Number(hanghoa.soluong);
            }

            checkedHanghoa.status = true; // TH hàng hóa số lượng trong kho còn 0 thì thay đổi status
            tongsoluonghangnhap += Number(hanghoa.soluong);
            await checkedHanghoa.save();
          }
        }
      }
      newLichsunhapkho.tongsoluonghangnhap = tongsoluonghangnhap; // tổng hàng hóa nhập kho
      await newLichsunhapkho.save();
      res.status(200).json("Nhập kho thành công....");
    } catch (error) {
      console.log(error.message);
    }
  },

  nhatkyNhapkhoPage: async (req, res) => {
    try {
      let khoList = await Kho.find().sort({ thutu: 1 });

      const timeElapsed = new Date();
      let day = ("0" + timeElapsed.getDate()).slice(-2);

      let month = ("0" + (timeElapsed.getMonth() + 1)).slice(-2);
      let year = timeElapsed.getFullYear();

      today = `${year}-${month}-${day}`;
      res.render("./admin/lichsunhapkho", {
        user: req.user,
        khoList,
        today,
      });
    } catch (error) {
      console.log(error.message)
    }
  },

  fetchedNhatkyNhapkho: async (req, res) => {
    let { khoString, canbonhapkho, tungay, denngay } = req.query;

    try {
      let lichsunhapkhoList = await Lichsunhapkho.find({
        canbonhapkho: { $regex: canbonhapkho, $options: "$ i" },
        khoString: { $regex: khoString, $options: "$ i" },
        ngay: {
          $gte: tungay,
          $lte: denngay,
        }
      })
        .populate("kho")
        .sort({ timeNumber: -1 });

      let tongsohang = 0;
      lichsunhapkhoList.forEach((i) => (tongsohang += i.tongsoluonghangnhap));

      res.status(200).json({ lichsunhapkhoList, tongsohang });
    } catch (error) {
      console.log(error.message);
    }
  },
  deleteLichsuNhapkho: async (req, res) => {
    let id1 = req.params.id1;
    try {
      await HanghoaNoneSeri.updateOne({"nhapkhoHistory.lichsunhapkho": id1},{$pull: { nhapkhoHistory: { lichsunhapkho: id1 } }}) 
      await HanghoaCoSeri.findOneAndDelete({"nhapkhoHistory.lichsunhapkho": id1}) ;
      await Lichsunhapkho.findByIdAndDelete(id1);
      res.status(200).json('xóa thành công')
    } catch (error) {
      
    }
  },

  getChinhsuaNhapkhoPage: async (req, res) => {
    try {
      let idLichsuNhapkho = req.params.id1; //id1: id lịch sử nhập kho;
      let item = await Lichsunhapkho.findById(idLichsuNhapkho).populate("kho");

      let { thoigiannhapkho, canbonhapkho,ghichu } = item;
      //chỉ lấy ra duy nhất 1 phần tử của lịch sử nhập kho nhatkyHistory
      let hanghoaCoSeri = await HanghoaCoSeri.find(
        { "nhapkhoHistory.lichsunhapkho": idLichsuNhapkho },
        {
          "nhapkhoHistory.$": 1,
          mark: 1,
          tongsoluong: 1,
          nguoncap: 1,
          loaihanghoa: 1,
        }
      )
        .populate("nguoncap")
        .populate("loaihanghoa");

      let hanghoaNoneSeri = await HanghoaNoneSeri.find(
        { "nhapkhoHistory.lichsunhapkho": idLichsuNhapkho },
        {
          "nhapkhoHistory.$": 1,
          mark: 1,
          tongsoluong: 1,
          nguoncap: 1,
          loaihanghoa: 1,
        }
      )
        .populate("nguoncap")
        .populate("loaihanghoa");

      let loaihanghoaList = await Loaihanghoa.find()
        .populate("danhmuc")
        .sort({ thutu: 1 });
      let nguoncapList = await Nguoncap.find().sort({ thutu: -1 });

      res.render("./admin/chinhsuanhapkho", {
        hanghoaNoneSeri,
        hanghoaCoSeri,
        user: req.user,
        loaihanghoaList,
        nguoncapList,
        thoigiannhapkho,
        canbonhapkho,
        ghichu,
        kho: item.kho,
        idLichsuNhapkho,
      });
    } catch (error) {
      console.log(error.message);
    }
  },

  chinhsuaNhapkho: async (req, res) => {
    let idLichsuNhapkho = req.params.id1; //id1: id lịch sử nhập kho;

    let ngay = req.body.kho.thoigiannhapkho.slice(0, 10);
    let thoigiannhapkho = req.body.kho.thoigiannhapkho;
    let timeNumber = Number(
      thoigiannhapkho.slice(0, 4) +
        thoigiannhapkho.slice(5, 7) +
        thoigiannhapkho.slice(8, 10) +
        thoigiannhapkho.slice(11, 13) +
        thoigiannhapkho.slice(14, 16)
    );

    try {
      let item = await Lichsunhapkho.findById(idLichsuNhapkho).populate("kho"); // item là nhật ký nhập kho
      item.thoigiannhapkho = req.body.kho.thoigiannhapkho;
      item.canbonhapkho = req.body.kho.canbonhapkho;
      item.ngay = ngay;
      item.timeNumber = timeNumber;
      item.ghichu = req.body.kho.ghichu;

      let {
        hanghoacapnhat,
        hanghoabosung,
        idHanghoaDeleteNoneSeri,
        idHanghoaDeleteCoSeri,
      } = req.body;
      // console.log(hanghoacapnhat)
      //Với hàng hóa cập nhật thì tìm hàng hóa cập nhật và thay đổi số lượng hàng hóa
      //tổng số lượng hàng hóa trong kho thay đổi = tổng số lượng đang có trong kho - số lượng nhập trước khi cập nhật + số lượng hàng hóa khi cập nhật
      for (i of hanghoacapnhat) {
        if (i.phanloai === "no-seri") {
          //TH hàng hóa k có seri
          let hanghoa = await HanghoaNoneSeri.findOne(
            { _id: i.idItem, "nhapkhoHistory.lichsunhapkho": idLichsuNhapkho },
            { "nhapkhoHistory.$": 1, tongsoluong: 1 }
          );

          let tongsoluong =
            hanghoa.tongsoluong -
            hanghoa.nhapkhoHistory[0].soluong +
            Number(i.soluong);

          item.tongsoluonghangnhap =
            item.tongsoluonghangnhap -
            hanghoa.nhapkhoHistory[0].soluong +
            Number(i.soluong);
          try {
            //Khi update mongoose ma phan tu edit la con cua array  thì phải dùng Model.update như dưới
            await HanghoaNoneSeri.updateOne(
              {
                _id: i.idItem,
                "nhapkhoHistory.lichsunhapkho": idLichsuNhapkho,
              },
              {
                $set: {
                  "nhapkhoHistory.$.soluong": Number(i.soluong),
                  "nhapkhoHistory.$.timeNumber": Number(timeNumber),
                  tongsoluong: tongsoluong,
                },
              },
              { new: true }
            );
          } catch (error) {
            console.log(error);
          }
        } else {
          // TH hàng cập nhật có seri thì chỉ thay đổi mark là seri model
          try {
            //Khi update mongoose ma phan tu edit la con cua array  thì phải dùng Model.update như dưới
            await HanghoaCoSeri.updateOne(
              {
                _id: i.idItem,
                "nhapkhoHistory.lichsunhapkho": idLichsuNhapkho,
              },
              {
                $set: {
                  mark: i.mark,
                  "nhapkhoHistory.$.timeNumber": Number(timeNumber),
                },
              },
              { new: true }
            );
          } catch (error) {
            console.log(error);
          }
        }
      }

      let tongsoluonghangbosung = 0;

      for (hanghoa of hanghoabosung) {
        if (
          hanghoa.phanloai ==
          "Có số seri, mã vạch và được cấp phát, quản lý, thu hồi và thanh lý"
        ) {

          let id2 = hanghoa.loaihanghoa
          let loaihanghoa = await Loaihanghoa.findById(id2).populate('danhmuc');

          let newHanghoa = new HanghoaCoSeri({
            loaihanghoa: hanghoa.loaihanghoa,
            mark: hanghoa.mark,
            kho: item.kho,
            khoString: item.khoString,
            nguoncap: hanghoa.nguoncap,
            status: true,
            tongsoluong: 1,
            loaihanghoaString: hanghoa.loaihanghoa,
            nguoncapString: hanghoa.nguoncap,
            danhmucString: loaihanghoa.danhmuc._id
          });

          newHanghoa.nhapkhoHistory.push({
            lichsunhapkho: item._id,
            soluong: 1,
            timeNumber,
          });

          newHanghoa.trangthai.push({
            khohientai: item.kho,
            khohientaiString: item.khoString,
            status: 1, // trạng thái 1 là trong kho
            timeNumber
          });

          tongsoluonghangbosung += 1;
          await newHanghoa.save();
        } else {
          // TH: hàng hóa không có seri, mã vạch đã có trong kho thì cộng tổng số lượng vào thôi
          let id2 = hanghoa.loaihanghoa
          let loaihanghoa = await Loaihanghoa.findById(id2).populate('danhmuc');

          let checkedHanghoa = await HanghoaNoneSeri.findOne({
            loaihanghoa: hanghoa.loaihanghoa,
            mark: hanghoa.mark,
            kho: item.kho,
            nguoncap: hanghoa.nguoncap,
          });
          // nếu chưa có hàng hóa loại này trong kho thì tiến hành thêm mới
          if (!checkedHanghoa) {
            let newHanghoa = new HanghoaNoneSeri({
              loaihanghoa: hanghoa.loaihanghoa,
              mark: hanghoa.mark,
              kho: item.kho,
              khoString: item.khoString,
              nguoncap: hanghoa.nguoncap,
              status: true,
              tongsoluong: Number(hanghoa.soluong),
              loaihanghoaString: hanghoa.loaihanghoa,
              nguoncapString: hanghoa.nguoncap,
              danhmucString: loaihanghoa.danhmuc._id.toString()
            });

            newHanghoa.nhapkhoHistory.push({
              lichsunhapkho: item._id,
              soluong: Number(hanghoa.soluong),
              timeNumber,
            });
            
            newHanghoa.trangthai.push({
              khohientai: item.kho,
              khohientaiString: item.khoString,
              status: 1,
              timeNumber
            });
            
            tongsoluonghangbosung += Number(hanghoa.soluong);

            await newHanghoa.save();
          } else {
            //đã có loại hàng hóa đó trong kho...
            checkedHanghoa.tongsoluong += Number(hanghoa.soluong);

            //kiểm tra xem hàng hóa cùng loại khi nhập kho hay không
            //nếu cùng thì lichx sử nhập kho của hàng hóa chỉ là 1 và cộng tổng số lượng
            let checkedLoaihang = checkedHanghoa.nhapkhoHistory.find(
              (i) => i.lichsunhapkho.toString() === item._id.toString()
            );

            if (checkedLoaihang === undefined) {
              checkedHanghoa.nhapkhoHistory.push({
                lichsunhapkho: item._id,
                soluong: Number(hanghoa.soluong),
                timeNumber,
              });

              checkedHanghoa.trangthai.push({
                khohientai: item.kho,
                khohientaiString: item.khoString,
                status: 1,
                timeNumber
              });

            } else {
              checkedLoaihang.soluong += Number(hanghoa.soluong);
            }
            checkedHanghoa.status = true; // TH hàng hóa số lượng trong kho còn 0 thì thay đổi status
            tongsoluonghangbosung += Number(hanghoa.soluong);
            await checkedHanghoa.save();
          }
        }
      }

      for (i of idHanghoaDeleteCoSeri) {
        try {
          await HanghoaCoSeri.findByIdAndDelete(i);

          item.tongsoluonghangnhap = item.tongsoluonghangnhap - 1;
        } catch (error) {
          console.log(error.message);
        }
      }

      for (i of idHanghoaDeleteNoneSeri) {
        try {
          let hanghoa = await HanghoaNoneSeri.findOne(
            { _id: i, "nhapkhoHistory.lichsunhapkho": idLichsuNhapkho },
            { "nhapkhoHistory.$": 1, tongsoluong: 1 }
          );

          let tongsoluong =
            hanghoa.tongsoluong - hanghoa.nhapkhoHistory[0].soluong;
          item.tongsoluonghangnhap =
            item.tongsoluonghangnhap - hanghoa.nhapkhoHistory[0].soluong;
          await HanghoaNoneSeri.updateOne(
            { _id: i },
            {
              $set: {
                tongsoluong: tongsoluong,
              },
              $pull: { nhapkhoHistory: { lichsunhapkho: idLichsuNhapkho } },
            }
          );
        } catch (error) {
          console.log(error.message);
        }
      }

      item.tongsoluonghangnhap += tongsoluonghangbosung;
      await item.save();
      res.status(200).json("Chỉnh sửa nhập kho thành công !");
    } catch (error) {
      console.log(error.message);
    }
  },

  getChuyenkhoPage: async (req, res) => {
    try {
      let khoList = await Kho.find().sort({ thutu: 1 });
      res.render("./admin/chuyenkho", {
        user: req.user,
        khoList,
      });
    } catch (error) {
      console.log(error.message);
    }
  },

  getHangtrongkhoChuyendi: async (req, res) => {
    // hàng có trong kho tại 1 thời điểm = tổng số lượng hàng nhập cho tới t đó - hàng xuất kho - hàng chuyển kho tới t đó
    try {
      // lấy tổng hàng đã nhập vào kho tới thời điểm t
      let { thoigianchuyenkho, khochuyendi } = req.query;
  
      let timeNumber = Number(
        thoigianchuyenkho.slice(0, 4) +
          thoigianchuyenkho.slice(5, 7) +
          thoigianchuyenkho.slice(8, 10) +
          thoigianchuyenkho.slice(11, 13) +
          thoigianchuyenkho.slice(14, 16) 
      );
       

      let hanghoaNoneSeriNhapkho = await HanghoaNoneSeri.aggregate([
        {
          $addFields: {
            trangthai: {
              $let: {
                vars: {
                  p: {
                    $filter: {
                      input: "$trangthai",
                      cond: { 
                        $and:[
                          { $eq: ["$$this.khohientaiString", khochuyendi] }, // lấy ra hàng hóa có tạng thái khohientai = id kho và timeNumber nhỏ hơn ngày chuyển kho
                          { $lte: [ "$$this.timeNumber", timeNumber] }
                       ]                     
                    }
                    }
                  }
                },
                in: {
                  $arrayElemAt: [
                    "$$p",
                    { 
                      $indexOfArray: [
                        "$$p.timeNumber", 
                        { $max: "$$p.timeNumber" } // lấy ra timeNumber max trong trường trangthai để biết trạng thái gần nhất của sản phẩm đó trong kho nào?, xuất kho hay không?
                      ] 
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $project: {
            _id: 1,
            mark: 1,
            loaihanghoa: 1,
            nguoncap: 1,
            trangthai: 1,
            xuatkhoHistory: 1,
            nhapkhoHistory: 1,
            thanhlyHistory: 1,
            hanghoachuyenkhoden: 1,
            hanghoachuyenkhodi: 1,
            hanghoathuhoi: 1,
            hanghoathuhoichuyendikhokhac: 1,
            hanghoathuhoichuyendentukhokhac: 1
          },
        },
        {
          $lookup: { // tương tự populate
            from: "nguoncaps",
            localField: "nguoncap",
            foreignField: "_id",
            as: "nguoncap",
          },
        },
        {
          $lookup: {
            from: "loaihanghoas",
            localField: "loaihanghoa",
            foreignField: "_id",
            as: "loaihanghoa",
          },
        },
        {
          $unwind: "$nguoncap", // biến đổi sau khi populate sẽ là kiểu {} thay vì []
        },
        {
          $unwind: "$loaihanghoa",
        },
      ]);

      // Kiểm tra trường status trangthai nếu = 1; đang ở trong kho đó
      // = 2 đã xuất kho.
      // = 3 đã thanh lý.
  

      //Tính tổng số hàng xuất kho tới thời điểm t
      // Tính tổng số hàng chuyển kho tới thời điểm t

      // TH hàng hóa có seri số lượng là 1 thì phải quan tâm đến thời điểm đó hàng hóa đó đang ở kho nào hay đã xuất kho cho đơn vị rồi
      // tương đương với id kho với từng thời điểm xuất kho và chuyển kho đó.


      let hanghoaNoneSeriInKho = [];
      for (item of hanghoaNoneSeriNhapkho) {

        if(item.trangthai !== undefined && item.trangthai.status === 1
          ||item.trangthai !== undefined && item.trangthai.status === 3){
          let matchedArrNhapkho = item.nhapkhoHistory.filter(
            (i) => i.timeNumber <= timeNumber
          );
          let hangnhapkho = 0;
          matchedArrNhapkho.forEach((e) => (hangnhapkho += e.soluong));
  
  
          let matchedArr = item.xuatkhoHistory.filter(
            (i) => i.timeNumber < timeNumber
          );
          // console.log(item.xuatkhoHistory)
          let hangxuatkho = 0;
          matchedArr.forEach((e) => (hangxuatkho += e.soluong));

          // console.log(item)
          let matchedThanhlyArr = item.thanhlyHistory.filter(
            (i) => i.timeNumber < timeNumber
          );
          
          let hangthanhly = 0;
          matchedThanhlyArr.forEach((e) => (hangthanhly += e.soluong));
  
          let matchedThuhoiArr = item.hanghoathuhoi.filter(
            (i) => i.timeNumber < timeNumber
          );
          let hangthuhoi = 0;
          matchedThuhoiArr.forEach((e) => (hangthuhoi += e.soluong));
  
          // let matchedThuhoichuyendikhokhacArr = item.hanghoathuhoichuyendikhokhac.filter(
          //   (i) => i.timeNumber < timeNumber
          // );
          // let hangthuhoichuyendikhokhac = 0;
          // matchedThuhoichuyendikhokhacArr.forEach((e) => (hangthuhoichuyendikhokhac += e.soluong));

          let matchedThuhoichuyendentukhokhacArr = item.hanghoathuhoichuyendentukhokhac.filter(
            (i) => i.timeNumber < timeNumber
          );
          let hangthuhoichuyendentukhokhac = 0;
          matchedThuhoichuyendentukhokhacArr.forEach((e) => (hangthuhoichuyendentukhokhac += e.soluong));
  
          let matchedChuyendiArr = item.hanghoachuyenkhodi.filter(
            i => i.timeNumber < timeNumber
          );
          let hangchuyenkhodi = 0;
          matchedChuyendiArr.forEach((e) => (hangchuyenkhodi += e.soluong));
   
  
          let matchedChuyendenArr = item.hanghoachuyenkhoden.filter(
            (i) => i.timeNumber < timeNumber
          );
          let hangchuyenkhoden = 0;
          matchedChuyendenArr.forEach((e) => (hangchuyenkhoden += e.soluong));
  
          let hanghoacotrongkho =
            hangnhapkho + hangchuyenkhoden + hangthuhoi + hangthuhoichuyendentukhokhac  - hangxuatkho - hangchuyenkhodi - hangthanhly;
            // hanghoaNoneSeriInKho.push({...item, hanghoacotrongkho})
          if(hanghoacotrongkho > 0) { // nếu số lượng hàng hóa đó phải lớn hơn 0 tương đương còn hàng trong kho thì mới chuyển kho được.
            hanghoaNoneSeriInKho.push({
              _id: item._id,
              mark: item.mark,
              loaihanghoa: item.loaihanghoa,
              nguoncap: item.nguoncap,
              hanghoacotrongkho,
            });
          }
        };

      }
      // console.log(hanghoaNoneSeriInKho)

      // khi đó phải xem hàng hóa đó đang thực tế ở kho nào hay đã cấp phát trong khoảng thời gian đó hay đã thanh lý
      let hanghoaCoSeri = await HanghoaCoSeri.aggregate([
        {
          $addFields: {
            trangthai: {
              $let: {
                vars: {
                  p: {
                    $filter: {
                      input: "$trangthai",
                      cond: { 
                        $and:[
                   // lấy ra hàng hóa có tạng thái khohientai = id kho và timeNumber nhỏ hơn ngày chuyển kho
                          { $lt: [ "$$this.timeNumber", timeNumber] }
                       ]                     
                    }
                    }
                  }
                },
                in: {
                  $arrayElemAt: [
                    "$$p",
                    { 
                      $indexOfArray: [
                        "$$p.timeNumber", 
                        { $max: "$$p.timeNumber" } // lấy ra timeNumber max trong trường trangthai để biết trạng thái gần nhất của sản phẩm đó trong kho nào?, xuất kho hay không?
                      ] 
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $project: {
            _id: 1,
            mark: 1,
            loaihanghoa: 1,
            nguoncap: 1,
            trangthai: 1,
            xuatkhoHistory: 1,
            nhapkhoHistory: 1,
            thanhlyHistory: 1,
            hanghoachuyenkhoden: 1,
            hanghoachuyenkhodi: 1,
            hanghoathuhoi: 1,
            hanghoathuhoichuyendikhokhac: 1,
            hanghoathuhoichuyendentukhokhac: 1
          },
        },
        {
          $lookup: { // tương tự populate
            from: "nguoncaps",
            localField: "nguoncap",
            foreignField: "_id",
            as: "nguoncap",
          },
        },
        {
          $lookup: {
            from: "loaihanghoas",
            localField: "loaihanghoa",
            foreignField: "_id",
            as: "loaihanghoa",
          },
        },
        {
          $unwind: "$nguoncap", // biến đổi sau khi populate sẽ là kiểu {} thay vì []
        },
        {
          $unwind: "$loaihanghoa",
        },
      ]);

      let hanghoaCoSeriInKho = [];
      for (item of hanghoaCoSeri) {
        if(item.trangthai !== undefined && item.trangthai.khohientaiString === khochuyendi && item.trangthai.status === 1
          || item.trangthai !== undefined && item.trangthai.khohientaiString === khochuyendi && item.trangthai.status === 3
          ){
            hanghoaCoSeriInKho.push({
              _id: item._id,
              mark: item.mark,
              loaihanghoa: item.loaihanghoa,
              nguoncap: item.nguoncap,
              hanghoacotrongkho: 1,
            });     
        };
      }

      res.send({ hanghoaNoneSeriInKho, hanghoaCoSeriInKho });
    } catch (error) {
      console.log(error.message)
    }
  },

  postChuyenkho: async (req, res) => {
    let {
      khochuyendi,
      khochuyenden,
      hanghoaCoSerichuyenkho,
      hanghoaNoneSerichuyenkho,
      canbochuyenkho,
      thoigianchuyenkho,
      ghichu
    } = req.body;

    let timeNumber = Number(
      thoigianchuyenkho.slice(0, 4) +
        thoigianchuyenkho.slice(5, 7) +
        thoigianchuyenkho.slice(8, 10) +
        thoigianchuyenkho.slice(11, 13) +
        thoigianchuyenkho.slice(14, 16) 
    );
    let ngaychuyenkho = thoigianchuyenkho.slice(0, 10); //ngày chuyển kho

    let newLichsuChuyenkho = new Lichsuchuyenkho({
      ngaychuyenkho,
      khochuyendi,
      khochuyendiString: khochuyendi,
      khochuyenden,
      khochuyendenString: khochuyenden,
      canbochuyenkho,
      timeNumber,
      ghichu
    });
    
    try {
    //khi chuyển sang kho khác phải kiểm tra xem trong kho đó có hàng hóa đúng loại đó chưa (mark, loaihanghoa, nguoncap phải như nhau);
    // TH có hàng hóa đó trong kho r thì push vào hàng chuyển đến
    //Th chưa có HH đó trong kho thì thêm mới loại hàng đó trong kho và cũng push vào hangchuyenden tương tự
    // đồng thời ở hàng hóa kho chuyển đi push vào hanghoachuyendi tương tự
    for (item of hanghoaNoneSerichuyenkho) {

      let hangTrongkhoChuyendi = await HanghoaNoneSeri.findById(item.idHanghoa); // 

      hangTrongkhoChuyendi.hanghoachuyenkhodi.push({
        lichsuchuyenkho: newLichsuChuyenkho._id,
        timeNumber,
        soluong: item.soluongchuyenkho,
      });

      //check hàng trong kho chuyển đến đã có mặt hàng này chưa
      let checkedHangtrongkhoChuyenden = await HanghoaNoneSeri.findOne({
        mark: hangTrongkhoChuyendi.mark,
        nguoncap: hangTrongkhoChuyendi.nguoncap,
        loaihanghoa: hangTrongkhoChuyendi.loaihanghoa,
        khoString: khochuyenden
      });

      //chưa có thì thêm mới mặt hàng đó vào kho
      if (!checkedHangtrongkhoChuyenden) {
        let newHanghoa = new HanghoaNoneSeri({
          mark: hangTrongkhoChuyendi.mark,
          nguoncap: hangTrongkhoChuyendi.nguoncap,
          loaihanghoa: hangTrongkhoChuyendi.loaihanghoa,
          khoString: khochuyenden,
          kho: khochuyenden,
          loaihanghoaString: hangTrongkhoChuyendi.loaihanghoa,
          nguoncapString: hangTrongkhoChuyendi.nguoncap,
          danhmucString: hangTrongkhoChuyendi.danhmucString
        });

        newHanghoa.trangthai.push({
          status: 1,
          khohientai: khochuyenden,
          khohientaiString: khochuyenden,
          timeNumber,
          idTrangthai: newLichsuChuyenkho._id
        });


        newHanghoa.hanghoachuyenkhoden.push({
          lichsuchuyenkho: newLichsuChuyenkho._id,
          timeNumber,
          soluong: item.soluongchuyenkho
        });

        await newHanghoa.save();
      } else {
        checkedHangtrongkhoChuyenden.hanghoachuyenkhoden.push({
          lichsuchuyenkho: newLichsuChuyenkho._id,
          timeNumber,
          soluong: item.soluongchuyenkho,
        });

        await checkedHangtrongkhoChuyenden.save();
      }
      await hangTrongkhoChuyendi.save();
    };

    //TH hàng hóa có seri thì mỗi lần chuyển ngoài thay đổi hanghoachuyenkhodi, den còn phải thay đổi kho và khoString và id kho từng thời điểm chuyển 1
    // vòng đời của hàng hóa có seri sẽ được kiểm soat giữ nguyên dữ liệu hàng hóa đó
    for (item of hanghoaCoSerichuyenkho) {
      let hangTrongkhoChuyendi = await HanghoaCoSeri.findById(item.idHanghoa);

      hangTrongkhoChuyendi.trangthai.push({
        status: 1,
        khohientai: khochuyenden,
        khohientaiString: khochuyenden,
        timeNumber,
        idTrangthai: newLichsuChuyenkho._id
      });

      hangTrongkhoChuyendi.hanghoachuyenkhodi.push({
        lichsuchuyenkho: newLichsuChuyenkho._id,
        timeNumber,
        soluong: item.soluongchuyenkho
      });
      await hangTrongkhoChuyendi.save();

    };

    await newLichsuChuyenkho.save();

    res.status(200).json('Chuyển kho thành công...')  
    } catch (error) {
      console.log(error.message)
    }
  },

  nhatkyChuyenkhoPage: async (req, res) => {
    try {
      let khoList = await Kho.find().sort({ thutu: 1 });

      const timeElapsed = new Date();
      let day = ("0" + timeElapsed.getDate()).slice(-2);

      let month = ("0" + (timeElapsed.getMonth() + 1)).slice(-2);
      let year = timeElapsed.getFullYear();

      today = `${year}-${month}-${day}`;
      res.render("./admin/lichsuchuyenkho", {
        user: req.user,
        khoList,
        today,
      });
    } catch (error) {
      console.log(error.message)
    }
  },

  fetchedNhatkyChuyenkho: async (req, res) => {
    let { khochuyendi, khochuyenden, canbochuyenkho, tungay, denngay } = req.query;

    try {
      let lichsuchuyenkhoList = await Lichsuchuyenkho.find({
        canbochuyenkho: { $regex: canbochuyenkho, $options: "$ i" },
        khochuyendiString: { $regex: khochuyendi, $options: "$ i" },
        khochuyendenString: { $regex: khochuyenden, $options: "$ i" },
        ngaychuyenkho: {
          $gte: tungay,
          $lte: denngay,
        }
      })
        .populate("khochuyendi")
        .populate("khochuyenden")
        .sort({ timeNumber: -1 });

      res.status(200).json(lichsuchuyenkhoList);
    } catch (error) {
      console.log(error.message);
    }
  },

  chitietChuyenkho: async(req, res) => {
    let id1 = req.params.id1;

    try {
      let chuyenkhoHistory = await Lichsuchuyenkho.findById(id1).populate('khochuyendi').populate('khochuyenden');

      let tongsohangchuyenkho = 0;

      let hanghoaNoneSeriChuyenkho = await HanghoaNoneSeri.find(
        { "hanghoachuyenkhodi.lichsuchuyenkho": id1 },
        { "hanghoachuyenkhodi.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
      ).populate('loaihanghoa').populate('nguoncap');

      hanghoaNoneSeriChuyenkho.forEach(i => tongsohangchuyenkho += i.hanghoachuyenkhodi[0].soluong)

      let hanghoaCoSeriChuyenkho = await HanghoaCoSeri.find(
        { "hanghoachuyenkhodi.lichsuchuyenkho": id1 },
        { "hanghoachuyenkhodi.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
      ).populate('loaihanghoa').populate('nguoncap')
      hanghoaCoSeriChuyenkho.forEach(i => tongsohangchuyenkho += i.hanghoachuyenkhodi[0].soluong)

      
      res.render('./admin/chitiethangchuyenkho', {
        user: req.user,
        chuyenkhoHistory,
        hanghoaCoSeriChuyenkho,
        hanghoaNoneSeriChuyenkho,
        tongsohangchuyenkho
      })  
    } catch (error) {
      console.log(error.message)
    }
  },

  deleteLichsuChuyenkho: async (req, res) => { // xóa cả hanghoachuynekhodi hanghoachuyenkhoden
    let id1 = req.params.id1;

    try {
      await HanghoaNoneSeri.updateOne({"hanghoachuyenkhodi.lichsuchuyenkho": id1},{$pull: { hanghoachuyenkhodi: { lichsuchuyenkho: id1 }, trangthai: {idTrangthai: id1} }}) 
      await HanghoaNoneSeri.updateOne({"hanghoachuyenkhoden.lichsuchuyenkho": id1},{$pull: { hanghoachuyenkhoden: { lichsuchuyenkho: id1 }, trangthai: {idTrangthai: id1}}}) 
      await HanghoaCoSeri.updateOne({"hanghoachuyenkhodi.lichsuchuyenkho": id1},{$pull: { hanghoachuyenkhodi: { lichsuchuyenkho: id1 },trangthai: {idTrangthai: id1}}}) 
      await HanghoaCoSeri.updateOne({"hanghoachuyenkhoden.lichsuchuyenkho": id1},{$pull: { hanghoachuyenkhoden: { lichsuchuyenkho: id1 }, trangthai: {idTrangthai: id1} }}) 
      await Lichsuchuyenkho.findByIdAndDelete(id1)
      res.status(200).json('xóa chuyển kho thành công...')
    } catch (error) {
      console.log(error.message)
    }
  },

  chinhsuaChuyenkho: async(req, res) => {
    let id1 = req.params.id1;

    try {
      let chuyenkhoHistory = await Lichsuchuyenkho.findById(id1).populate('khochuyendi').populate('khochuyenden');
      
      let { timeNumber, khochuyendiString } = chuyenkhoHistory;

      let hanghoaNoneSeriNhapkho = await HanghoaNoneSeri.aggregate([
        {
          $addFields: {
            trangthai: {
              $let: {
                vars: {
                  p: {
                    $filter: {
                      input: "$trangthai",
                      cond: { 
                        $and:[
                          { $eq: ["$$this.khohientaiString", khochuyendiString] }, // lấy ra hàng hóa có tạng thái khohientai = id kho và timeNumber nhỏ hơn ngày chuyển kho
                          { $lte: [ "$$this.timeNumber", timeNumber] }
                       ]                     
                    }
                    }
                  }
                },
                in: {
                  $arrayElemAt: [
                    "$$p",
                    { 
                      $indexOfArray: [
                        "$$p.timeNumber", 
                        { $max: "$$p.timeNumber" } // lấy ra timeNumber max trong trường trangthai để biết trạng thái gần nhất của sản phẩm đó trong kho nào?, xuất kho hay không?
                      ] 
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $project: {
            _id: 1,
            mark: 1,
            loaihanghoa: 1,
            nguoncap: 1,
            trangthai: 1,
            xuatkhoHistory: 1,
            nhapkhoHistory: 1,
            thanhlyHistory: 1,
            hanghoachuyenkhoden: 1,
            hanghoachuyenkhodi: 1,
            hanghoathuhoi: 1,
            hanghoathuhoichuyendikhokhac: 1,
            hanghoathuhoichuyendentukhokhac: 1
          },
        },
        {
          $lookup: { // tương tự populate
            from: "nguoncaps",
            localField: "nguoncap",
            foreignField: "_id",
            as: "nguoncap",
          },
        },
        {
          $lookup: {
            from: "loaihanghoas",
            localField: "loaihanghoa",
            foreignField: "_id",
            as: "loaihanghoa",
          },
        },
        {
          $unwind: "$nguoncap", // biến đổi sau khi populate sẽ là kiểu {} thay vì []
        },
        {
          $unwind: "$loaihanghoa",
        },
      ]);

      let tongsohangchuyenkho = 0;
      let hanghoaNoneSeriInKho = [];
      for (item of hanghoaNoneSeriNhapkho) {

        if(item.trangthai !== undefined && item.trangthai.status === 1
          || item.trangthai !== undefined && item.trangthai.status === 3){
          let matchedArrNhapkho = item.nhapkhoHistory.filter(
            (i) => i.timeNumber <= timeNumber 
          );
          let hangnhapkho = 0;
          matchedArrNhapkho.forEach((e) => (hangnhapkho += e.soluong));
  
  
          let matchedArr = item.xuatkhoHistory.filter(
            (i) => i.timeNumber < timeNumber 
          );
          let hangxuatkho = 0;
          matchedArr.forEach((e) => (hangxuatkho += e.soluong));

          let matchedThanhlyArr = item.thanhlyHistory.filter(
            (i) => i.timeNumber < timeNumber
          );
          let hangthanhly = 0;
          matchedThanhlyArr.forEach((e) => (hangthanhly += e.soluong));
  
          let matchedThuhoiArr = item.hanghoathuhoi.filter(
            (i) => i.timeNumber < timeNumber 
          );
          let hangthuhoi = 0;
          matchedThuhoiArr.forEach((e) => (hangthuhoi += e.soluong));

          let matchedThuhoichuyendentukhokhacArr = item.hanghoathuhoichuyendentukhokhac.filter(
            (i) => i.timeNumber < timeNumber
          );
          let hangthuhoichuyendentukhokhac = 0;
          matchedThuhoichuyendentukhokhacArr.forEach((e) => (hangthuhoichuyendentukhokhac += e.soluong));
  
          let matchedChuyendiArr = item.hanghoachuyenkhodi.filter(
            (i) => i.timeNumber <= timeNumber 
          );
      
          let hangchuyenkhodi = 0;
          let hanghoachuyenkholannay = 0;

          matchedChuyendiArr.forEach((e) => {

            if(e.lichsuchuyenkho.toString()=== id1){ // sẽ k tính chuyển kho lần này trong số hàng hóa đó chuyển kho
              hanghoachuyenkholannay = e.soluong;
            }else{
              hangchuyenkhodi += e.soluong;
            };
            
          });
  
          let matchedChuyendenArr = item.hanghoachuyenkhoden.filter(
            (i) => i.timeNumber < timeNumber 
          );
          let hangchuyenkhoden = 0;
          matchedChuyendenArr.forEach((e) => (hangchuyenkhoden += e.soluong));
  
          let hanghoacotrongkho =
            hangnhapkho + hangchuyenkhoden + hangthuhoi + hangthuhoichuyendentukhokhac  - hangxuatkho - hangchuyenkhodi - hangthanhly;


          if(hanghoacotrongkho > 0) { // nếu số lượng hàng hóa đó phải lớn hơn 0 tương đương còn hàng trong kho thì mới chuyển kho được.
            hanghoaNoneSeriInKho.push({
              _id: item._id,
              mark: item.mark,
              loaihanghoa: item.loaihanghoa,
              nguoncap: item.nguoncap,
              hanghoacotrongkho,
              hanghoachuyenkholannay
            });
          }
        };
      };
      // console.log(hanghoaNoneSeriInKho)
      let hanghoaCoSeri = await HanghoaCoSeri.find({'trangthai.timeNumber': {$lte: timeNumber},"trangthai.khohientaiString": khochuyendiString}).populate('loaihanghoa').populate('nguoncap')

      let hanghoaCoSeriInKho = [];
      for (item of hanghoaCoSeri) {
        let checkedHanghoachuyenkholannay = item.hanghoachuyenkhodi.find(i=> i.lichsuchuyenkho.toString() === id1);

        let filterItem = item.trangthai.filter(i=> i.timeNumber !== timeNumber && i.timeNumber < timeNumber).sort((a,b) => b.timeNumber - a.timeNumber )

        //kiểm tra trạng thái có timeNumber gần nhất đã sắp thứ tự khohientai có bằng khochuyendiString k và status  === 1
        if(checkedHanghoachuyenkholannay !== undefined && filterItem[0].khohientaiString == khochuyendiString && filterItem[0].status == 1 || 
          checkedHanghoachuyenkholannay !== undefined && filterItem[0].khohientaiString == khochuyendiString && filterItem[0].status == 3
          ){
          hanghoaCoSeriInKho.push({
              _id: item._id,
              mark: item.mark,
              loaihanghoa: item.loaihanghoa,
              nguoncap: item.nguoncap,
              hanghoacotrongkho: 1,
              hanghoachuyenkholannay: 1
            });     
        }else{
          hanghoaCoSeriInKho.push({
            _id: item._id,
            mark: item.mark,
            loaihanghoa: item.loaihanghoa,
            nguoncap: item.nguoncap,
            hanghoacotrongkho: 1,
            hanghoachuyenkholannay: 0
          });     
        }
      };

      // console.log(hanghoaCoSeriInKho)
      res.render('./admin/chinhsuachuyenkho', {
        user: req.user,
        chuyenkhoHistory,
        hanghoaNoneSeriInKho,
        hanghoaCoSeriInKho,
        tongsohangchuyenkho
      })  
    } catch (error) {
      console.log(error.message)
    }
  },
  
  postChinhsuaChuyenkho: async (req, res) => {
    let id1 = req.params.id1;
    let {canbochuyenkho, ghichu, hanghoaNoneSeriChuyenkho, hanghoaCoSeriChuyenkho} = req.body
    //xóa trạng thái các loại hàng hóa chuyển kho trước đó
    // cập nhật lại các hàng hóa chuyển kho lần này
 
    try {
      await HanghoaNoneSeri.updateOne({"hanghoachuyenkhodi.lichsuchuyenkho": id1},{$pull: { hanghoachuyenkhodi: { lichsuchuyenkho: id1 } }}) 
      await HanghoaNoneSeri.updateOne({"hanghoachuyenkhoden.lichsuchuyenkho": id1},{$pull: { hanghoachuyenkhoden: { lichsuchuyenkho: id1 }}}) 
      await HanghoaCoSeri.updateOne({"hanghoachuyenkhodi.lichsuchuyenkho": id1},{$pull: { hanghoachuyenkhodi: { lichsuchuyenkho: id1 },trangthai: {idTrangthai: id1}}}) 
      await HanghoaCoSeri.updateOne({"hanghoachuyenkhoden.lichsuchuyenkho": id1},{$pull: { hanghoachuyenkhoden: { lichsuchuyenkho: id1 }, trangthai: {idTrangthai: id1} }}) 
      
      let lichsuchuyenkho = await Lichsuchuyenkho.findByIdAndUpdate(id1, {
        $set: {
          canbochuyenkho, ghichu
        }
      });

      let khochuyenden = lichsuchuyenkho.khochuyendenString;
      let timeNumber = lichsuchuyenkho.timeNumber;
      
          //khi chuyển sang kho khác phải kiểm tra xem trong kho đó có hàng hóa đúng loại đó chưa (mark, loaihanghoa, nguoncap phải như nhau);
    // TH có hàng hóa đó trong kho r thì push vào hàng chuyển đến
    //Th chưa có HH đó trong kho thì thêm mới loại hàng đó trong kho và cũng push vào hangchuyenden tương tự
    // đồng thời ở hàng hóa kho chuyển đi push vào hanghoachuyendi tương tự
    for (item of hanghoaNoneSeriChuyenkho) {

      let hangTrongkhoChuyendi = await HanghoaNoneSeri.findById(item.idHanghoa); // 
      
      hangTrongkhoChuyendi.hanghoachuyenkhodi.push({
        lichsuchuyenkho: lichsuchuyenkho._id,
        timeNumber,
        soluong: item.soluongchuyenkho,
      });

      //check hàng trong kho chuyển đến đã có mặt hàng này chưa
      let checkedHangtrongkhoChuyenden = await HanghoaNoneSeri.findOne({
        mark: hangTrongkhoChuyendi.mark,
        nguoncap: hangTrongkhoChuyendi.nguoncap,
        loaihanghoa: hangTrongkhoChuyendi.loaihanghoa,
        khoString: khochuyenden
      });

      //chưa có thì thêm mới mặt hàng đó vào kho
      if (!checkedHangtrongkhoChuyenden) {
        let newHanghoa = new HanghoaNoneSeri({
         mark: hangTrongkhoChuyendi.mark,
          nguoncap: hangTrongkhoChuyendi.nguoncap,
          loaihanghoa: hangTrongkhoChuyendi.loaihanghoa,
          khoString: khochuyenden,
          kho: khochuyenden,
          loaihanghoaString: hangTrongkhoChuyendi.loaihanghoa,
          nguoncapString: hangTrongkhoChuyendi.nguoncap,
          danhmucString: hangTrongkhoChuyendi.danhmucString
        });

        newHanghoa.trangthai.push({
          status: 1,
          khohientai: khochuyenden,
          khohientaiString: khochuyenden,
          timeNumber,
          idTrangthai: lichsuchuyenkho._id
        });


        newHanghoa.hanghoachuyenkhoden.push({
          lichsuchuyenkho: lichsuchuyenkho._id,
          timeNumber,
          soluong: item.soluongchuyenkho
        });

        await newHanghoa.save();
      } else {
        checkedHangtrongkhoChuyenden.hanghoachuyenkhoden.push({
          lichsuchuyenkho: lichsuchuyenkho._id,
          timeNumber,
          soluong: item.soluongchuyenkho,
        });

        checkedHangtrongkhoChuyenden.trangthai.push({
          status: 1,
          khohientai: khochuyenden,
          khohientaiString: khochuyenden,
          timeNumber,
          idTrangthai: lichsuchuyenkho._id
        });
        await checkedHangtrongkhoChuyenden.save();
      }
      await hangTrongkhoChuyendi.save();
    };

    //TH hàng hóa có seri thì mỗi lần chuyển ngoài thay đổi hanghoachuyenkhodi, den còn phải thay đổi kho và khoString và id kho từng thời điểm chuyển 1
    // vòng đời của hàng hóa có seri sẽ được kiểm soat giữ nguyên dữ liệu hàng hóa đó
    for (item of hanghoaCoSeriChuyenkho) {
      let hangTrongkhoChuyendi = await HanghoaCoSeri.findById(item.idHanghoa);

      hangTrongkhoChuyendi.trangthai.push({
        status: 1,
        khohientai: khochuyenden,
        khohientaiString: khochuyenden,
        timeNumber,
        idTrangthai: lichsuchuyenkho._id
      });

      hangTrongkhoChuyendi.hanghoachuyenkhodi.push({
        lichsuchuyenkho: lichsuchuyenkho._id,
        timeNumber,
        soluong: item.soluongchuyenkho,
      });
      await hangTrongkhoChuyendi.save();

    };

    res.status(200).json('chỉnh sửa chuyển kho thành công')
    } catch (error) {
      
    }
  },


  getXuatkhoPage: async (req,res) => {
    try {
      let donvis = await Donvi.find().sort({thutu: 1});
      let khoList = await Kho.find().sort({ thutu: 1 });
      res.render("./admin/xuatkho", {
        user: req.user,
        khoList,
        donvis
      });

    } catch (error) {
      console.log(error.message)
    }
  },

  postXuatkho: async (req, res) => {
    let {donvi,thoigianxuatkho,canboxuatkho,canbotiepnhan,ghichu,donvitiepnhan,hanghoaCoSeri,hanghoaNoneSeri} = req.body;
    try {
      let timeNumber = Number(
        thoigianxuatkho.slice(0, 4) +
          thoigianxuatkho.slice(5, 7) +
          thoigianxuatkho.slice(8, 10) +
          thoigianxuatkho.slice(11, 13) +
          thoigianxuatkho.slice(14, 16) 
      );

      let ngayxuatkho = thoigianxuatkho.slice(0, 10); //ngày chuyển kho

      let newLichsuxuatkho = new Lichsuxuatkho({
        timeNumber,canbotiepnhan,canboxuatkho,ghichu, donvitiepnhan,
        donvitiepnhanString: donvitiepnhan,
        donvi,
        donviString: donvi,
        ngayxuatkho
      });
      await newLichsuxuatkho.save();
    
      for(item of hanghoaNoneSeri){
        let {idHanghoa, soluong} = item;
        await HanghoaNoneSeri.updateOne({_id: idHanghoa}, {
          $push: {
            "xuatkhoHistory": {
              lichsuxuatkho: newLichsuxuatkho._id,
              timeNumber,
              soluong: Number(soluong)
            }
          },
        })  
      };

    
      for(item of hanghoaCoSeri){
        let {idHanghoa, soluong} = item;
       
        await HanghoaCoSeri.updateOne({_id: idHanghoa}, {
          $push: {
            "xuatkhoHistory": {
              lichsuxuatkho: newLichsuxuatkho._id,
              timeNumber,
              soluong: Number(soluong)
            },
            "trangthai": {
              timeNumber,
              status: 2, //2 là xuất kho
              idTrangthai: newLichsuxuatkho._id
            }
          }
        })
      };
      res.status(200).json('xuất kho thành công')
    } catch (error) {
      console.log(error.message)
    }
  },  

  xuatkhoHistoryPage: async (req, res) => {
    try {
        const donviList = await Donvi.find().sort({thutu: 1})
        const timeElapsed = new Date();
        let day = ("0" + timeElapsed.getDate()).slice(-2);
  
        let month = ("0" + (timeElapsed.getMonth() + 1)).slice(-2);
        let year = timeElapsed.getFullYear();
  
        today = `${year}-${month}-${day}`;
        res.render("./admin/lichsuxuatkho", {
          user: req.user,
          today,
          donviList
        });
      } catch (error) {
        console.log(error.message)
      }
    },

    fetchedNhatkyXuatkho: async (req, res) => {
      let {donvi,donvitiepnhan,tungay, denngay, canboxuatkho,canbotiepnhan,ghichu} = req.query;
      try {
      
        let lichsuxuatkhoList = await Lichsuxuatkho.find({
          canboxuatkho: { $regex: canboxuatkho, $options: "$ i" },
          canbotiepnhan: { $regex: canbotiepnhan, $options: "$ i" },
          ghichu: { $regex: ghichu, $options: "$ i" },
          donviString: { $regex: donvi, $options: "$ i" },
          donvitiepnhanString: { $regex: donvitiepnhan, $options: "$ i" },
          ngayxuatkho: {
            $gte: tungay,
            $lte: denngay,
          }
        })
          .populate("donvitiepnhan")
          .populate("donvi")
          .sort({ timeNumber: -1 });

  
        res.status(200).json(lichsuxuatkhoList);
      } catch (error) {
        console.log(error.message)
      }
    },

    deleteLichsuXuatkho: async (req, res) => { // xóa cả hanghoachuynekhodi hanghoachuyenkhoden
      let id1 = req.params.id1;
  
      try {
        await HanghoaNoneSeri.updateOne({"xuatkhoHistory.lichsuxuatkho": id1},{$pull: { xuatkhoHistory: { lichsuxuatkho: id1 }}})    
        await HanghoaCoSeri.updateOne({"xuatkhoHistory.lichsuxuatkho": id1},{$pull: { xuatkhoHistory: { lichsuxuatkho: id1 },trangthai: {idTrangthai: id1}}}) 
        await Lichsuxuatkho.findByIdAndDelete(id1)
        res.status(200).json('xóa xuất kho thành công...')
      } catch (error) {
        console.log(error.message)
      }
    },

    chitietXuatkho: async (req, res) => {
      let id1 = req.params.id1;

    try {
      let xuatkhoHistory = await Lichsuxuatkho.findById(id1).populate('donvi').populate('donvitiepnhan');

      let tongsohangxuatkho = 0;

      let hanghoaNoneSeriXuatkho = await HanghoaNoneSeri.find(
        { "xuatkhoHistory.lichsuxuatkho": id1 },
        { "xuatkhoHistory.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
      ).populate('loaihanghoa').populate('nguoncap').populate('kho');

      hanghoaNoneSeriXuatkho.forEach(i => tongsohangxuatkho += i.xuatkhoHistory[0].soluong)

      let hanghoaCoSeriXuatkho1 = await HanghoaCoSeri.find(
        { "xuatkhoHistory.lichsuxuatkho": id1 },
        { "xuatkhoHistory.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1,trangthai: 1}
      ).populate('loaihanghoa').populate('nguoncap').populate('kho')

      let hanghoaCoSeriXuatkho = [];
      let timeTo = xuatkhoHistory.timeNumber;
      
      for(item of hanghoaCoSeriXuatkho1){
        let sortTrangthai = item.trangthai.filter(i => i.timeNumber <= timeTo).sort((a,b) => b.timeNumber - a.timeNumber);
        let checkedTrangthai = sortTrangthai[0];
        let checkedKho = sortTrangthai.filter(i=> i.status === 1 || i.status === 3);
        // console.log(checkedKho)

        let id_kho = checkedKho[0].khohientaiString;// kho xuất hnagf hóa đi trước đó cho đơn vị
      
        if(checkedTrangthai.status === 2 && checkedTrangthai.idTrangthai === id1){
         
          let khotruockhibangiao = await Kho.findById(id_kho);
          // console.log(khotruockhibangiao)
          hanghoaCoSeriXuatkho.push({
            _id: item._id,
            loaihanghoa: item.loaihanghoa.tenloaihanghoa,
            nguoncap: item.nguoncap.tennguoncap,
            kho: khotruockhibangiao.tenkho,
            mark: item.mark,
            tongsoluongbangiao: 1
          });
        }
      }
      // console.log(hanghoaCoSeriXuatkho)
      hanghoaCoSeriXuatkho1.forEach(i => tongsohangxuatkho += i.xuatkhoHistory[0].soluong)

      
      res.render('./admin/chitiethangxuatkho', {
        user: req.user,
        xuatkhoHistory,
        hanghoaCoSeriXuatkho,
        hanghoaNoneSeriXuatkho,
        tongsohangxuatkho
      })  
    } catch (error) {
      console.log(error.message)
    }
    },
    chinhsuaXuatkhoPage: async (req,res) => {
      let id1 = req.params.id1;
      try {
        let donvis = await Donvi.find().sort({thutu: 1});
        let khoList = await Kho.find().sort({ thutu: 1 });
        let xuatkhoHistory = await Lichsuxuatkho.findById(id1).populate('donvi').populate('donvitiepnhan')
        let donvitiepnhans = await Donvitructhuoc.find({donvi: xuatkhoHistory.donviString}).sort()
        let hanghoaNoneSeriXuatkho = await HanghoaNoneSeri.find(
          { "xuatkhoHistory.lichsuxuatkho": id1 },
          { "xuatkhoHistory.$": 1,nguoncap: 1, loaihanghoa: 1, mark: 1 }
        ).populate('loaihanghoa').populate('nguoncap').populate('kho');
        
        let hanghoaCoSeriXuatkho = await HanghoaCoSeri.find(
          { "xuatkhoHistory.lichsuxuatkho": id1 },
          { "xuatkhoHistory.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
        ).populate('loaihanghoa').populate('nguoncap').populate('kho')

        res.render("./admin/chinhsuaxuatkho", {
          user: req.user,
          hanghoaCoSeriXuatkho,
          hanghoaNoneSeriXuatkho,
          khoList,
          donvis,
          donvitiepnhans,
          xuatkhoHistory
        });
      } catch (error) {
        console.log(error.message)
      }
    },
    postChinhsuaXuatkho: async (req, res) => {
      let id1 = req.params.id1;
      let {thoigianxuatkho, ghichu, canboxuatkho, canbotiepnhan, donvitiepnhan, donvi, hanghoaCoSeri, hanghoaNoneSeri} = req.body;
      try {
        await Lichsuxuatkho.findByIdAndUpdate(id1, {
          $set: {
            canbotiepnhan,canboxuatkho,ghichu, donvitiepnhan,
            donvitiepnhanString: donvitiepnhan,
            donvi,
            donviString: donvi,
          }
        });
        let timeNumber = Number(
          thoigianxuatkho.slice(0, 4) +
            thoigianxuatkho.slice(5, 7) +
            thoigianxuatkho.slice(8, 10) +
            thoigianxuatkho.slice(11, 13) +
            thoigianxuatkho.slice(14, 16) 
        );

        await HanghoaNoneSeri.updateOne({"xuatkhoHistory.lichsuxuat": id1},{$pull: { xuatkhoHistory: { lichsuxuatkho: id1 }}}) ;
        await HanghoaCoSeri.updateOne({"xuatkhoHistory.lichsuxuat": id1},{$pull: { xuatkhoHistory: { lichsuxuatkho: id1 }, trangthai: {idTrangthai: id1}}}) ;

        for(item of hanghoaNoneSeri){
          let {idHanghoa, soluong} = item;
          await HanghoaNoneSeri.updateOne({_id: idHanghoa}, {
            $push: {
              "xuatkhoHistory": {
                lichsuxuatkho: id1,
                timeNumber,
                soluong: Number(soluong)
              }
            },
          })  
        };
  
        // console.log(hanghoaCoSeri)
        for(item of hanghoaCoSeri){
          let {idHanghoa, soluong} = item;
         
          await HanghoaCoSeri.updateOne({_id: idHanghoa}, {
            $push: {
              "xuatkhoHistory": {
                lichsuxuatkho: id1,
                timeNumber,
                soluong: Number(soluong)
              },
              "trangthai": {
                timeNumber,
                status: 2, //2 là xuất kho
                idTrangthai: id1
              }
            }
          })
        };

        res.status(200).json('update thành công')
      } catch (error) {
        console.log(error.message)       
      }
    },
    thanhlyPage: async(req, res) =>{
      try {
        let khoList = await Kho.find().sort({ thutu: 1 });
        res.render("./admin/thanhlyhanghoa", {
          user: req.user,
          khoList
        });
  
      } catch (error) {
        console.log(error.message)
      }
    },
    postThanhly: async (req, res) => {
      let {thoigianthanhly,canbothanhly,ghichu,hanghoaCoSeri,hanghoaNoneSeri} = req.body;
    try {
      let timeNumber = Number(
        thoigianthanhly.slice(0, 4) +
          thoigianthanhly.slice(5, 7) +
          thoigianthanhly.slice(8, 10) +
          thoigianthanhly.slice(11, 13) +
          thoigianthanhly.slice(14, 16) 
      );

      let ngaythanhly = thoigianthanhly.slice(0, 10); //ngày chuyển kho

      let newLichsuthanhly = new Lichsuthanhly({
        timeNumber,canbothanhly,ghichu,ngaythanhly
      });
      await newLichsuthanhly.save();
    
      for(item of hanghoaNoneSeri){
        let {idHanghoa, soluong} = item;
        await HanghoaNoneSeri.updateOne({_id: idHanghoa}, {
          $push: {
            "thanhlyHistory": {
              lichsuthanhly: newLichsuthanhly._id,
              timeNumber,
              soluong: Number(soluong)
            }
          },
        })  
      };

    
      for(item of hanghoaCoSeri){
        let {idHanghoa, soluong} = item;
       
        await HanghoaCoSeri.updateOne({_id: idHanghoa}, {
          $push: {
            "thanhlyHistory": {
              lichsuthanhly: newLichsuthanhly._id,
              timeNumber,
              soluong: Number(soluong)
            },
            "trangthai": {
              timeNumber,
              status: 4, //4 là đã thanh lý
              idTrangthai: newLichsuthanhly._id
            }
          }
        })
      };

      res.status(200).json('thanh lý thành công')
    } catch (error) {
      console.log(error.message)
    }
    },
    thanhlyHistoryPage: async (req, res) => {
      try {
          const timeElapsed = new Date();
          let day = ("0" + timeElapsed.getDate()).slice(-2);
    
          let month = ("0" + (timeElapsed.getMonth() + 1)).slice(-2);
          let year = timeElapsed.getFullYear();
    
          today = `${year}-${month}-${day}`;
          res.render("./admin/lichsuthanhly", {
            user: req.user,
            today
          });
        } catch (error) {
          console.log(error.message)
        }
    },
    fetchedNhatkyThanhly: async (req, res) => {
      let {tungay, denngay, canbothanhly,ghichu} = req.query;
      try {
      
        let lichsuthanhlyList = await Lichsuthanhly.find({
          canbothanhly: { $regex: canbothanhly, $options: "$ i" },
          ghichu: { $regex: ghichu, $options: "$ i" },
          ngaythanhly: {
            $gte: tungay,
            $lte: denngay,
          }
        }).sort({ timeNumber: -1 });
        res.status(200).json(lichsuthanhlyList);
      } catch (error) {
        
      }
    },
    deleteLichsuThanhly: async (req, res) => { // xóa cả hanghoachuynekhodi hanghoachuyenkhoden
      let id1 = req.params.id1;
      try {
        await HanghoaNoneSeri.updateOne({"thanhlyHistory.lichsuthanhly": id1},{$pull: { thanhlyHistory: { lichsuthanhly: id1 }}})    
        await HanghoaCoSeri.updateOne({"thanhlyHistory.lichsuthanhly": id1},{$pull: { thanhlyHistory: { lichsuthanhly: id1 },trangthai: {idTrangthai: id1}}}) 
        await Lichsuthanhly.findByIdAndDelete(id1)
        res.status(200).json('xóa thanh lý thành công...')
      } catch (error) {
        console.log(error.message)
      }
    },

    chitietThanhly: async (req, res) => {
      let id1 = req.params.id1;

      try {
        let thanhlyHistory = await Lichsuthanhly.findById(id1);

        let tongsohangthanhly = 0;

        let hanghoaNoneSeriThanhly = await HanghoaNoneSeri.find(
          { "thanhlyHistory.lichsuthanhly": id1 },
          { "thanhlyHistory.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
        ).populate('loaihanghoa').populate('nguoncap').populate('kho');

        hanghoaNoneSeriThanhly.forEach(i => tongsohangthanhly += i.thanhlyHistory[0].soluong)

        let hanghoaCoSeriThanhly = await HanghoaCoSeri.find(
          { "thanhlyHistory.lichsuthanhly": id1 },
          { "thanhlyHistory.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
        ).populate('loaihanghoa').populate('nguoncap').populate('kho')

        // console.log(hanghoaCoSeriXuatkho)
        hanghoaCoSeriThanhly.forEach(i => tongsohangthanhly += i.thanhlyHistory[0].soluong)

        
        res.render('./admin/chitiethangthanhly', {
          user: req.user,
          thanhlyHistory,
          hanghoaCoSeriThanhly,
          hanghoaNoneSeriThanhly,
          tongsohangthanhly
        })  
      } catch (error) {
        console.log(error.message)
      }
    },

    chinhsuaThanhlyPage: async (req,res) => {
      let id1 = req.params.id1;
      try {
  
        let thanhlyHistory = await Lichsuthanhly.findById(id1);
        let khoList = await Kho.find().sort({ thutu: 1 });
      
        let hanghoaNoneSeriThanhly = await HanghoaNoneSeri.find(
          { "thanhlyHistory.lichsuthanhly": id1 },
          { "thanhlyHistory.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
        ).populate('loaihanghoa').populate('nguoncap').populate('kho');

       
        let hanghoaCoSeriThanhly = await HanghoaCoSeri.find(
          { "thanhlyHistory.lichsuthanhly": id1 },
          { "thanhlyHistory.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
        ).populate('loaihanghoa').populate('nguoncap').populate('kho')
          // console.log(thanhlyHistory)
        res.render("./admin/chinhsuathanhly", {
          user: req.user,
          hanghoaCoSeriThanhly,
          hanghoaNoneSeriThanhly,
          thanhlyHistory,
          khoList
        });
      } catch (error) {
        console.log(error.message)
      }
    },
    postChinhsuaThanhly: async (req, res)=>{
      let id1 = req.params.id1;
      let {thoigianthanhly, ghichu, canbothanhly,  hanghoaCoSeri, hanghoaNoneSeri} = req.body;
     
      try {
        await Lichsuthanhly.findByIdAndUpdate(id1, {
          $set: {
            canbothanhly,ghichu
          }
        });
        let timeNumber = Number(
          thoigianthanhly.slice(0, 4) +
            thoigianthanhly.slice(5, 7) +
            thoigianthanhly.slice(8, 10) +
            thoigianthanhly.slice(11, 13) +
            thoigianthanhly.slice(14, 16) 
        );

        await HanghoaNoneSeri.updateOne({"thanhlyHistory.lichsuthanhly": id1},{$pull: { thanhlyHistory: { lichsuthanhly: id1 }}}) ;
        await HanghoaCoSeri.updateOne({"thanhlyHistory.lichsuthanhly": id1},{$pull: { thanhlyHistory: { lichsuthanhly: id1 }, trangthai: {idTrangthai: id1}}}) ;

        for(item of hanghoaNoneSeri){
          let {idHanghoa, soluong} = item;
          await HanghoaNoneSeri.updateOne({_id: idHanghoa}, {
            $push: {
              "thanhlyHistory": {
                lichsuthanhly: id1,
                timeNumber,
                soluong: Number(soluong)
              }
            },
          })  
        };
     
        for(item of hanghoaCoSeri){
          let {idHanghoa, soluong} = item;
         
          await HanghoaCoSeri.updateOne({_id: idHanghoa}, {
            $push: {
              "thanhlyHistory": {
                lichsuthanhly: id1,
                timeNumber,
                soluong: Number(soluong)
              },
              "trangthai": {
                timeNumber,
                status: 4, 
                idTrangthai: id1
              }
            }
          })
        };
        // console.log(1)

        res.status(200).json('update thành công')
      } catch (error) {
        console.log(error.message)       
      }
    },

    getThuhoiPage: async (req,res) => {
    try {
      let donvis = await Donvi.find().sort({thutu: 1});
      let khoList = await Kho.find().sort({ thutu: 1 });
      let nguoncapList = await Nguoncap.find().sort({thutu: 1});
      let danhmucList = await Danhmuc.find().sort({thutu: 1})
      res.render("./admin/thuhoihanghoa", {
        user: req.user,
        khoList,
        donvis,
        nguoncapList,
        danhmucList
      });

    } catch (error) {
      console.log(error.message)
    }
  },

  fetchedLoaihangOfDanhmuc: async (req, res) => {
      let id1 = req.params.id1;
    try {
      // console.log(1)
      let loaihanghoaList = await Loaihanghoa.find({danhmuc: id1});
      res.status(200).json(loaihanghoaList)
    } catch (error) {
      console.log(error.message)
    }
  },
  getThongtinHangBangiao: async (req, res) => {  

    let {donvi,donvitiepnhan,tungay,thoigianthuhoi,nguoncap,danhmuc,mark,loaihanghoa} = req.query;

    let timeFrom = Number(
        tungay.slice(0, 4) +
        tungay.slice(5, 7) +
        tungay.slice(8, 10) +
        tungay.slice(11, 13) +
        tungay.slice(14, 16) 
    );

    let timeTo = Number(
        thoigianthuhoi.slice(0, 4) +
        thoigianthuhoi.slice(5, 7) +
        thoigianthuhoi.slice(8, 10) +
        thoigianthuhoi.slice(11, 13) +
        thoigianthuhoi.slice(14, 16)
    );

    // console.log(timeFrom)
    try {
      let xuatkhoHistory = await Lichsuxuatkho.find({
        donviString: { $regex: donvi, $options: "$ i" },
        donvitiepnhanString: { $regex: donvitiepnhan, $options: "$ i" },
        timeNumber: {
          $gte: timeFrom,
          $lte: timeTo
        }
      });
   

      let id_xuatkhos = xuatkhoHistory.map(i=> i._id.toString())
      
      let hanghoaNoneSeriBangiao = [];
    // console.log(id_xuatkhos)
      let hanghoaNoneSeriList = await HanghoaNoneSeri.find({"xuatkhoHistory.lichsuxuatkho": {$in: id_xuatkhos}, 
        loaihanghoaString: { $regex: loaihanghoa, $options: "$ i" },
        nguoncapString: { $regex: nguoncap, $options: "$ i" },
        danhmucString: { $regex: danhmuc, $options: "$ i" },
        mark: { $regex: mark, $options: "$ i" },
        })
        .populate('loaihanghoa')
        .populate('nguoncap')
        .populate('kho')
        .populate('xuatkhoHistory.lichsuxuatkho')
      
      // console.log(hanghoaNoneSeriList)
      for(item of hanghoaNoneSeriList){
        let tongsoluongbangiao = 0;
        // console.log(item)
        item.xuatkhoHistory.forEach(i => {
          if( i.timeNumber < timeTo && 
              i.timeNumber >= timeFrom &&
              i.lichsuxuatkho.donviString.includes(donvi) && 
              i.lichsuxuatkho.donvitiepnhanString.includes(donvitiepnhan)
            ){
            tongsoluongbangiao += i.soluong
          }
        });

        item.hanghoathuhoi.forEach(i => {
          if( i.timeNumber < timeTo && 
            i.timeNumber >= timeFrom &&
            i.donviString.includes(donvi)
          ){
            tongsoluongbangiao -= i.soluong
          }
        });

        item.hanghoathuhoichuyendikhokhac.forEach(i => {
          if( i.timeNumber < timeTo && 
            i.timeNumber >= timeFrom &&
            i.donviString.includes(donvi)
          ){
            tongsoluongbangiao -= i.soluong
          }
        });

        if(tongsoluongbangiao != 0){
          hanghoaNoneSeriBangiao.push({
            _id: item._id,
            loaihanghoa: item.loaihanghoa.tenloaihanghoa,
            nguoncap: item.nguoncap.tennguoncap,
            kho: item.kho.tenkho,
            mark: item.mark,
            tongsoluongbangiao
          });
        }
      }
      
      let hanghoaCoSeriBangiao = [];
        // console.log(hanghoa)
      let hanghoaCoSeriList = await HanghoaCoSeri.find({"xuatkhoHistory.lichsuxuatkho": {$in: id_xuatkhos},
      loaihanghoaString: { $regex: loaihanghoa, $options: "$ i" },
      nguoncapString: { $regex: nguoncap, $options: "$ i" },
      danhmucString: { $regex: danhmuc, $options: "$ i" },
      mark: { $regex: mark, $options: "$ i" }, 
      })
      .populate('loaihanghoa')
      .populate('nguoncap')
      .populate('kho')
      .populate('xuatkhoHistory.lichsuxuatkho')
      // .populate()

      for(item of hanghoaCoSeriList){
        let sortTrangthai = item.trangthai.filter(i => i.timeNumber < timeTo).sort((a,b) => b.timeNumber - a.timeNumber);
        let checkedTrangthai = sortTrangthai[0];
        let checkedKho = sortTrangthai.filter(i=> i.status === 1 || i.status === 3);
     
        let id_kho = checkedKho[0].khohientaiString;// kho xuất hnagf hóa đi trước đó cho đơn vị
        if(checkedTrangthai.status === 2 && id_xuatkhos.includes(checkedTrangthai.idTrangthai)){
         
          let khotruockhibangiao = await Kho.findById(id_kho)
          // console.log(khohientai)
          hanghoaCoSeriBangiao.push({
            _id: item._id,
            loaihanghoa: item.loaihanghoa.tenloaihanghoa,
            nguoncap: item.nguoncap.tennguoncap,
            kho: khotruockhibangiao.tenkho,
            mark: item.mark,
            tongsoluongbangiao: 1
          });
        }
      }
      console.log(hanghoaCoSeriBangiao)
      res.status(200).json({hanghoaCoSeriBangiao,hanghoaNoneSeriBangiao})
    } catch (error) {
      console.log(error.message)
    }
  },

  postThuhoi: async(req, res) =>{
   
    let {thoigianthuhoi, canbothuhoi, canbobangiao,ghichu,hanghoaCoSeri, hanghoaNoneSeri, khothuhoi,donvi} = req.body;
    let timeNumber =  Number(
      thoigianthuhoi.slice(0, 4) +
        thoigianthuhoi.slice(5, 7) +
        thoigianthuhoi.slice(8, 10) +
        thoigianthuhoi.slice(11, 13) +
        thoigianthuhoi.slice(14, 16) 
    );
    let ngaythuhoi = thoigianthuhoi.slice(0, 10); //ngày chuyển kho;

    let lichsuthuhoi = new Lichsuthuhoi({
      timeNumber,
      ngaythuhoi,
      donvi,canbothuhoi,canbobangiao,ghichu,
      donviString: donvi,
      khothuhoi,khothuhoiString: khothuhoi
    });

    try {
      await lichsuthuhoi.save();
      //kiểm tra xem hàng hóa k có seri có được thu hồi về đúng kho trước đó cấp phát hay không
      //nếu đúng kho thì sẽ push vào hanghoathuhoi của document đã có trong kho đó
      //nếu khác kho kiểm tra xem kho ý có loại hàng hóa đó chưa, nếu k có thì sẽ thêm mới loại hàng hóa vào kho
      for(item of hanghoaNoneSeri){
        let hanghoa = await HanghoaNoneSeri.findOne({_id: item.idHanghoa});
        
        let isHanghoaNoneSeriInKho = hanghoa.khoString === khothuhoi; // so sánh hàng hóa đó có thu hồi về đúng kho trước khi bàn giao hay không
      
        if(isHanghoaNoneSeriInKho){ // TH thu hồi về đúng kho
          await HanghoaNoneSeri.updateOne({_id: item.idHanghoa},{
            $push: {
              "hanghoathuhoi": {
                lichsuthuhoi: lichsuthuhoi._id,
                timeNumber,
                soluong: Number(item.soluong),
                donviString: donvi
              }
            }
          });
        }else{ // TH mà thu về kho khác 
          //phải check xem trong kho đó có loại hàng hóa này chưa,
          // nếu có rồi thì push thêm hanghoathuhoikhokhac, chưa có thì tạo mới như nhập kho lần đầu
          await HanghoaNoneSeri.updateOne({_id: item.idHanghoa},{
            $push: {
              "hanghoathuhoichuyendikhokhac": {
                lichsuthuhoi: lichsuthuhoi._id,
                timeNumber,
                soluong: Number(item.soluong),
                donviString: donvi
              }
            }
          });

          let id2 = hanghoa.loaihanghoa; //id2 là loaihanghoaID
          let loaihanghoa = await Loaihanghoa.findById(id2).populate('danhmuc');

          let checkedHanghoa = await HanghoaNoneSeri.findOne({
            // kiểm tra xem loại hàng hóa với mark,nguồn cấp, có ở trong kho đó hay chưa
            loaihanghoa: hanghoa.loaihanghoa,
            mark: hanghoa.mark,
            kho: khothuhoi,
            nguoncap: hanghoa.nguoncap,
          });

          // console.log(checkedHanghoa)
          // nếu chưa có hàng hóa loại này trong kho thì tiến hành thêm mới
          if (!checkedHanghoa) {
            let newHanghoa = new HanghoaNoneSeri({
              loaihanghoa: hanghoa.loaihanghoa,
              mark: hanghoa.mark,
              kho: khothuhoi,
              khoString: khothuhoi,
              nguoncap: hanghoa.nguoncap,
              tongsoluong: Number(item.soluong), // số lượng bằng số lượng nhập hàng vào = số lượng thu hồi về
              loaihanghoaString: hanghoa.loaihanghoa.toString(),
              nguoncapString: hanghoa.nguoncap.toString(),
              danhmucString: loaihanghoa.danhmuc._id.toString()
            });

            newHanghoa.trangthai.push({
              khohientai: khothuhoi,
              khohientaiString: khothuhoi,
              status: 1,
              timeNumber
            });

            newHanghoa.hanghoathuhoichuyendentukhokhac.push({
              lichsuthuhoi: lichsuthuhoi._id,
              timeNumber,
              soluong: Number(item.soluong),
              donviString: donvi
            })

            await newHanghoa.save();
          } else {
            //đã có loại hàng hóa đó trong kho...
            // checkedHanghoa.tongsoluong += Number(item.soluong); // tổng số lượng loại hàng hóa đó được cộng thêm
            //kiểm tra xem hàng hóa cùng loại khi thu hồi hay không
            //nếu cùng thì lichx sử thu hồi của hàng hóa chỉ là 1 và cộng tổng số lượng

            // kiểm tra xem hàng hóa đó có lịch sử nhập kho này hay chưa do có vòng lặp tạo ra trước đó nếu tạo mới sẽ push lich sử nhập kho r
            let checkedLoaihang = checkedHanghoa.hanghoathuhoichuyendentukhokhac.find(
              (i) =>
                i.lichsuthuhoi.toString() === lichsuthuhoi._id.toString()
            );

            if (checkedLoaihang === undefined) {
              // Trường hợp thêm mới chưa có trong kho hàng đó thì push lich sử thu hồi vào
              checkedHanghoa.hanghoathuhoichuyendentukhokhac.push({
                lichsuthuhoi: lichsuthuhoi._id,
                timeNumber,
                soluong: Number(item.soluong),
                donviString: donvi
              });

            } else {
              // TH loại hàng giống nhau đã được lặp trước đó
              checkedLoaihang.soluong += Number(item.soluong);
            }

            checkedHanghoa.status = true; // TH hàng hóa số lượng trong kho còn 0 thì thay đổi status
            // tongsoluonghangnhap += Number(item.soluong);
            await checkedHanghoa.save();
          }
        }
      };

      for(item of hanghoaCoSeri){
      let hangTrongkhoThuhoi = await HanghoaCoSeri.findById(item.idHanghoa);

      hangTrongkhoThuhoi.trangthai.push({
        status: 3, // 3 là thu hồi hàng về để sau populate
        khohientai: khothuhoi,
        khohientaiString: khothuhoi,
        timeNumber,
        idTrangthai: lichsuthuhoi._id
      });

      hangTrongkhoThuhoi.hanghoathuhoi.push({
        lichsuthuhoi: lichsuthuhoi._id,
        timeNumber,
        soluong: Number(item.soluong),
        donviString: donvi
      });

      await hangTrongkhoThuhoi.save()
      };

      res.status(200).json('thu hồi hàng thành công')
    } catch (error) {
      console.log(error.message)
    }
  },

  thuhoiHistoryPage: async ( req, res) => {
    try {
      const donviList = await Donvi.find().sort({thutu: 1});
      const khoList = await Kho.find().sort({thutu: 1});

      const timeElapsed = new Date();
      let day = ("0" + timeElapsed.getDate()).slice(-2);

      let month = ("0" + (timeElapsed.getMonth() + 1)).slice(-2);
      let year = timeElapsed.getFullYear();

      today = `${year}-${month}-${day}`;
      res.render("./admin/lichsuthuhoi", {
        user: req.user,
        today,
        donviList,
        khoList
      });
    } catch (error) {
      console.log(error.message)
    }
  },
  fetchedNhatkyThuhoi: async (req, res) => {
    let {tungay, denngay, canbothuhoi, canbobangiao, ghichu,donvi, khothuhoi} = req.query;
      try { 
        let lichsuthuhoiList = await Lichsuthuhoi.find({
          donviString: { $regex: donvi, $options: "$ i" },
          canbothuhoi: { $regex: canbothuhoi, $options: "$ i" },
          canbobangiao: { $regex: canbobangiao, $options: "$ i" },
          khothuhoiString: { $regex: khothuhoi, $options: "$ i" },
          ghichu: { $regex: ghichu, $options: "$ i" },
          ngaythuhoi: {
            $gte: tungay,
            $lte: denngay,
          }
        }).populate('donvi')
          .populate('khothuhoi')
          .sort({ timeNumber: -1 });
        res.status(200).json(lichsuthuhoiList);
      } catch (error) {
        console.log(error.message)
      }
  },

  deleteLichsuThuhoi: async (req, res) => { // xóa cả hanghoachuynekhodi hanghoachuyenkhoden
    let id1 = req.params.id1;
    try {
      await HanghoaNoneSeri.updateOne({"hanghoathuhoi.lichsuthuhoi": id1},{$pull: { hanghoathuhoi: { lichsuthuhoi: id1 }}})    
      await HanghoaNoneSeri.updateOne({"hanghoathuhoichuyendikhokhac.lichsuthuhoi": id1},{$pull: { hanghoathuhoichuyendikhokhac: { lichsuthuhoi: id1 }}})    
      await HanghoaNoneSeri.updateOne({"hanghoathuhoichuyendentukhokhac.lichsuthuhoi": id1},{$pull: { hanghoathuhoichuyendentukhokhac: { lichsuthuhoi: id1 }}})    
      await HanghoaCoSeri.updateOne({"hanghoathuhoi.lichsuthuhoi": id1},{$pull: { hanghoathuhoi: { lichsuthuhoi: id1 },trangthai: {idTrangthai: id1}}}) 
      await Lichsuthuhoi.findByIdAndDelete(id1)
      res.status(200).json('xóa thu hồi hàng hóa thành công...')
    } catch (error) {
      console.log(error.message)
    }
  },
  
  chitietThuhoi: async (req, res) => {
    let id1 = req.params.id1;

    try {
      let thuhoiHistory = await Lichsuthuhoi.findById(id1).populate('khothuhoi').populate('donvi');

      let tongsohangthuhoi = 0;

      let hanghoaNoneSeriThuhoiCungkho = await HanghoaNoneSeri.find(
        { "hanghoathuhoi.lichsuthuhoi": id1 },
        { "hanghoathuhoi.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
      ).populate('loaihanghoa').populate('nguoncap').populate('kho');

      hanghoaNoneSeriThuhoiCungkho.forEach(i => tongsohangthuhoi += i.hanghoathuhoi[0].soluong);

      let hanghoaNoneSeriThuhoiKhokhacchuyenden = await HanghoaNoneSeri.find(
        { "hanghoathuhoichuyendentukhokhac.lichsuthuhoi": id1 },
        { "hanghoathuhoichuyendentukhokhac.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
      ).populate('loaihanghoa').populate('nguoncap').populate('kho');

      hanghoaNoneSeriThuhoiKhokhacchuyenden.forEach(i => tongsohangthuhoi += i.hanghoathuhoichuyendentukhokhac[0].soluong)

      let hanghoaCoSeriThuhoi = await HanghoaCoSeri.find(
        { "hanghoathuhoi.lichsuthuhoi": id1 },
        { "hanghoathuhoi.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
      ).populate('loaihanghoa').populate('nguoncap')

      // console.log(hanghoaCoSeriXuatkho)
      hanghoaCoSeriThuhoi.forEach(i => tongsohangthuhoi += i.hanghoathuhoi[0].soluong)

      res.render('./admin/chitiethangthuhoi', {
        user: req.user,
        thuhoiHistory,
        hanghoaCoSeriThuhoi,
        hanghoaNoneSeriThuhoiCungkho,
        hanghoaNoneSeriThuhoiKhokhacchuyenden,
        tongsohangthuhoi
      })  
    } catch (error) {
      console.log(error.message)
    }
  },

  chinhsuaThuhoiPage: async (req,res) => {
    let id1 = req.params.id1;
    try {

      let thuhoiHistory = await Lichsuthuhoi.findById(id1).populate('donvi').populate('khothuhoi');
    
      // let donvis = await Donvi.find().sort({thutu: 1});
      let donvitiepnhans = await Donvitructhuoc.find({donvi: thuhoiHistory.donviString}).sort({thutu: 1})
      let khoList = await Kho.find().sort({ thutu: 1 });
      let nguoncapList = await Nguoncap.find().sort({thutu: 1});
      let danhmucList = await Danhmuc.find().sort({thutu: 1});

      let hanghoaNoneSeriThuhoiCungkho = await HanghoaNoneSeri.find(
        { "hanghoathuhoi.lichsuthuhoi": id1 },
        { "hanghoathuhoi.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
      ).populate('loaihanghoa').populate('nguoncap').populate('kho');

      let hanghoaNoneSeriThuhoiKhokhacchuyenden = await HanghoaNoneSeri.find(
        { "hanghoathuhoichuyendentukhokhac.lichsuthuhoi": id1 },
        { "hanghoathuhoichuyendentukhokhac.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
      ).populate('loaihanghoa').populate('nguoncap').populate('kho');

      let hanghoaCoSeriThuhoi = await HanghoaCoSeri.find(
        { "hanghoathuhoi.lichsuthuhoi": id1 },
        { "hanghoathuhoi.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1,trangthai: 1}
      ).populate('loaihanghoa').populate('nguoncap')

      let hanghoaCoSeriBangiao = [];
      for(item of hanghoaCoSeriThuhoi){
        // console.log(timeTo)
        let sortTrangthai = item.trangthai.filter(i => i.timeNumber < thuhoiHistory.timeNumber).sort((a,b) => b.timeNumber - a.timeNumber);
        let checkedTrangthai = sortTrangthai[0];
        // console.log(sortTrangthai)
        let checkedKho = sortTrangthai.filter(i=> i.status === 1 || i.status === 3);
     
        let id_kho = checkedKho[0].khohientaiString;// kho xuất hnagf hóa đi trước đó cho đơn vị
        if(checkedTrangthai.status === 2){
         
          let khotruockhibangiao = await Kho.findById(id_kho)
          console.log(1)
          hanghoaCoSeriBangiao.push({
            _id: item._id,
            loaihanghoa: item.loaihanghoa.tenloaihanghoa,
            nguoncap: item.nguoncap.tennguoncap,
            kho: khotruockhibangiao.tenkho,
            mark: item.mark,
            tongsoluongbangiao: 1
          });
        }
      }

    //  console.log(hanghoaNoneSeriThuhoiCungkho)
    //  console.log(hanghoaNoneSeriThuhoiKhokhacchuyenden)
    //  console.log(hanghoaCoSeriBangiao)
      res.render("./admin/chinhsuathuhoi", {
        user: req.user,
        thuhoiHistory,
        khoList,
        // donvis,
        nguoncapList,
        danhmucList,
        donvitiepnhans,
        hanghoaNoneSeriThuhoiCungkho,
        hanghoaNoneSeriThuhoiKhokhacchuyenden,
        hanghoaCoSeriBangiao
      });
    } catch (error) {
      console.log(error.message)
    }
  },

  postChinhsuaThuhoi: async (req, res) => {
    //xóa hết tất cả post thu hồi trong db, sau đó thêm mới lại hết

    let id1 = req.params.id1;
    let {canbothuhoi, canbobangiao, khothuhoi,ghichu,hanghoaCoSeri,hanghoaNoneSeri} = req.body;
  
    try {

      let newItem = await Lichsuthuhoi.findByIdAndUpdate(id1, {
        $set: {
          canbothuhoi,canbobangiao,ghichu,khothuhoi,
          khothuhoiString: khothuhoi
        }
      }, {new: true});

      let {timeNumber, donviString}  = newItem;

      await HanghoaNoneSeri.updateOne({"hanghoathuhoi.lichsuthuhoi": id1},{$pull: { hanghoathuhoi: { lichsuthuhoi: id1 }}})    
      await HanghoaNoneSeri.updateOne({"hanghoathuhoichuyendikhokhac.lichsuthuhoi": id1},{$pull: { hanghoathuhoichuyendikhokhac: { lichsuthuhoi: id1 }}})    
      await HanghoaNoneSeri.updateOne({"hanghoathuhoichuyendentukhokhac.lichsuthuhoi": id1},{$pull: { hanghoathuhoichuyendentukhokhac: { lichsuthuhoi: id1 }}})    
      await HanghoaCoSeri.updateOne({"hanghoathuhoi.lichsuthuhoi": id1},{$pull: { hanghoathuhoi: { lichsuthuhoi: id1 },trangthai: {idTrangthai: id1}}}) 
      
      for(item of hanghoaNoneSeri){
        let hanghoa = await HanghoaNoneSeri.findOne({_id: item.idHanghoa});
        
        let isHanghoaNoneSeriInKho = hanghoa.khoString === khothuhoi; // so sánh hàng hóa đó có thu hồi về đúng kho trước khi bàn giao hay không
      
        if(isHanghoaNoneSeriInKho){ // TH thu hồi về đúng kho
          await HanghoaNoneSeri.updateOne({_id: item.idHanghoa},{
            $push: {
              "hanghoathuhoi": {
                lichsuthuhoi: newItem._id,
                timeNumber,
                soluong: Number(item.soluong),
                donviString
              }
            }
          });
        }else{ // TH mà thu về kho khác 
          //phải check xem trong kho đó có loại hàng hóa này chưa,
          // nếu có rồi thì push thêm hanghoathuhoikhokhac, chưa có thì tạo mới như nhập kho lần đầu
          await HanghoaNoneSeri.updateOne({_id: item.idHanghoa},{
            $push: {
              "hanghoathuhoichuyendikhokhac": {
                lichsuthuhoi: newItem._id,
                timeNumber,
                soluong: Number(item.soluong),
                donviString
              }
            }
          });

          let id2 = hanghoa.loaihanghoa; //id2 là loaihanghoaID
          let loaihanghoa = await Loaihanghoa.findById(id2).populate('danhmuc');

          let checkedHanghoa = await HanghoaNoneSeri.findOne({
            // kiểm tra xem loại hàng hóa với mark,nguồn cấp, có ở trong kho đó hay chưa
            loaihanghoa: hanghoa.loaihanghoa,
            mark: hanghoa.mark,
            kho: khothuhoi,
            nguoncap: hanghoa.nguoncap,
          });

          // console.log(checkedHanghoa)
          // nếu chưa có hàng hóa loại này trong kho thì tiến hành thêm mới
          if (!checkedHanghoa) {
            let newHanghoa = new HanghoaNoneSeri({
              loaihanghoa: hanghoa.loaihanghoa,
              mark: hanghoa.mark,
              kho: khothuhoi,
              khoString: khothuhoi,
              nguoncap: hanghoa.nguoncap,
              tongsoluong: Number(item.soluong), // số lượng bằng số lượng nhập hàng vào = số lượng thu hồi về
              loaihanghoaString: hanghoa.loaihanghoa.toString(),
              nguoncapString: hanghoa.nguoncap.toString(),
              danhmucString: loaihanghoa.danhmuc._id.toString()
            });

            newHanghoa.trangthai.push({
              khohientai: khothuhoi,
              khohientaiString: khothuhoi,
              status: 1,
              timeNumber
            });

            newHanghoa.hanghoathuhoichuyendentukhokhac.push({
              lichsuthuhoi: newItem._id,
              timeNumber,
              soluong: Number(item.soluong),
              donviString
            })

            await newHanghoa.save();
          } else {
            //đã có loại hàng hóa đó trong kho...
            // checkedHanghoa.tongsoluong += Number(item.soluong); // tổng số lượng loại hàng hóa đó được cộng thêm
            //kiểm tra xem hàng hóa cùng loại khi thu hồi hay không
            //nếu cùng thì lichx sử thu hồi của hàng hóa chỉ là 1 và cộng tổng số lượng

            // kiểm tra xem hàng hóa đó có lịch sử nhập kho này hay chưa do có vòng lặp tạo ra trước đó nếu tạo mới sẽ push lich sử nhập kho r
            let checkedLoaihang = checkedHanghoa.hanghoathuhoichuyendentukhokhac.find(
              (i) =>
                i.lichsuthuhoi.toString() === newItem._id.toString()
            );

            if (checkedLoaihang === undefined) {
              // Trường hợp thêm mới chưa có trong kho hàng đó thì push lich sử thu hồi vào
              checkedHanghoa.hanghoathuhoichuyendentukhokhac.push({
                lichsuthuhoi: newItem._id,
                timeNumber,
                soluong: Number(item.soluong),
                donviString
              });

            } else {
              // TH loại hàng giống nhau đã được lặp trước đó
              checkedLoaihang.soluong += Number(item.soluong);
            }

            checkedHanghoa.status = true; // TH hàng hóa số lượng trong kho còn 0 thì thay đổi status
            // tongsoluonghangnhap += Number(item.soluong);
            await checkedHanghoa.save();
          }
        }
      };

      for(item of hanghoaCoSeri){
      let hangTrongkhoThuhoi = await HanghoaCoSeri.findById(item.idHanghoa);
        // console.log(item)
      hangTrongkhoThuhoi.trangthai.push({
        status: 3, // 3 là thu hồi hàng về để sau populate
        khohientai: khothuhoi,
        khohientaiString: khothuhoi,
        timeNumber,
        idTrangthai: newItem._id
      });

      hangTrongkhoThuhoi.hanghoathuhoi.push({
        lichsuthuhoi: newItem._id,
        timeNumber,
        soluong: Number(item.soluong),
        donviString: newItem.donviString
      });

      await hangTrongkhoThuhoi.save()
      };
      res.status(200).json('cập nhật thu hồi về kho thành công...')

    } catch (error) {
      console.log(error.message)
    }
  },

  //sửa tiếp
  getKhochuyenden: async(req, res) => {
    try {
      let idkho_chuyendi = req.query.idkho;
      let khochuyendenList = await Kho.find({_id: {$ne: idkho_chuyendi}});
      res.send(khochuyendenList)

    } catch (error) {
      
    }
  }
};
