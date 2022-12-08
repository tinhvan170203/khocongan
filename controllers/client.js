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

const Lichsuchuyenkho = require("../models/lichsuchuyenkho");
const Lichsuxuatkho = require("../models/lichsuxuatkho");
const Lichsuthanhly = require("../models/lichsuthanhly");
const Lichsuthuhoi = require("../models/lichsuthuhoi");

module.exports = {
    trangchu: async (req, res) => {
        let user = req.user;
        let khoList = await Kho.find().sort({thutu: 1})
        let danhmucLength = await Danhmuc.find().countDocuments();
        let loaihanghoaLength = await Loaihanghoa.find().countDocuments();
        let solannhapkho = await Lichsunhapkho.find().countDocuments();
        let solanxuatkho = await Lichsuxuatkho.find().countDocuments();
        let solanchuyenkho = await Lichsuchuyenkho.find().countDocuments();
        let solanthuhoi = await Lichsuthuhoi.find().countDocuments();
        let solanthanhly = await Lichsuthanhly.find().countDocuments();
        
        try {
            res.render('./client/trangchu',{
                user, 
                khoList,
                danhmucLength,loaihanghoaLength,
                solanchuyenkho,solannhapkho,
                solanxuatkho,solanthuhoi,solanthanhly
            })
        } catch (error) {
            console.log(error.message)
        }
    },
    danhmucPage: async (req, res) => {
        try {
            let user = req.user;
            let khoList = await Kho.find().sort({thutu: 1})
            let danhmucs = await Danhmuc.find().sort({thutu: 1});
            res.render('./client/danhmuchanghoa',{
                user,khoList,danhmucs
            })
        } catch (error) {
            console.log(error.message)
        }
    },
    loaihanghoaPage: async (req, res) => {
        try {
            let user = req.user;
            let khoList = await Kho.find().sort({thutu: 1})
            let loaihanghoas = await Loaihanghoa.find().populate('danhmuc').sort({thutu: 1});
            res.render('./client/loaihanghoa',{
                user,khoList,loaihanghoas
            })
        } catch (error) {
            console.log(error.message)
        }
    },
    chitietkhoPage: async(req, res) =>{
        let id1 = req.params.id1;
        try {
            let user = req.user;
            let khoList = await Kho.find().sort({thutu: 1});
            let khoItem  = await Kho.findById(id1);
            const dateObj = new Date();

            let year = dateObj.getFullYear();

            let month = dateObj.getMonth() + 1;
            month = ('0' + month).slice(-2);
            // To make sure the month always has 2-character-formate. For example, 1 => 01, 2 => 02

            let date = dateObj.getDate();
            date = ('0' + date).slice(-2);
            // To make sure the date always has 2-character-formate

            let hour = dateObj.getHours();
            hour = ('0' + hour).slice(-2);
            // To make sure the hour always has 2-character-formate

            let minute = dateObj.getMinutes();
            minute = ('0' + minute).slice(-2);
            // To make sure the minute always has 2-character-formate
            let timeNumber = Number(`${year}${month}${date}${hour}${minute}`);
  
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
                                  { $eq: ["$$this.khohientaiString", khoItem._id.toString()] }, // lấy ra hàng hóa có tạng thái khohientai = id kho và timeNumber nhỏ hơn ngày chuyển kho
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
                if(item.trangthai !== undefined && item.trangthai.khohientaiString === khoItem._id.toString() && item.trangthai.status === 1
                  || item.trangthai !== undefined && item.trangthai.khohientaiString === khoItem._id.toString() && item.trangthai.status === 3
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
              let data = hanghoaCoSeriInKho.concat(hanghoaNoneSeriInKho)
              let tongsohangtrongkho = 0;
              data.forEach(i=> tongsohangtrongkho += i.hanghoacotrongkho)
              
            // let loaihanghoaInkho = await Loaihanghoa.find({khoString}).sort({thutu: 1});
            res.render('./client/chitietkho',{
                user,khoList, khoItem, data, tongsohangtrongkho
            })
        } catch (error) {
            console.log(error.message)
        }
    },

    lichsunhapkhoPage: async (req, res) => {
      try {
        let user = req.user;
        let khoList = await Kho.find().sort({thutu: 1});
        const timeElapsed = new Date();
        let day = ("0" + timeElapsed.getDate()).slice(-2);

        let month = ("0" + (timeElapsed.getMonth() + 1)).slice(-2);
        let year = timeElapsed.getFullYear();
        let time = `${year}-01-01`
        today = `${year}-${month}-${day}`;
        res.render('./client/lichsunhapkho',{
            user,khoList, today, time
        })
    } catch (error) {
        console.log(error.message)
    }
    },
    searchLichsunhapkho: async (req, res) => {
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
    chitietLichsunhapkho: async (req, res)=> {
      let user = req.user;
      let idLichsuNhapkho = req.params.id1; //id1: id lịch sử nhập kho;
      try {
        let khoList = await Kho.find().sort({thutu: 1});
        let item = await Lichsunhapkho.findById(idLichsuNhapkho).populate("kho");
        // console.log(item)
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
          .populate("loaihanghoa")
          .populate({
            path: 'loaihanghoa',
            // populate 2 cấp
            populate: { path: 'danhmuc' }
          });
  
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
          .populate("loaihanghoa")
          .populate({
            path: 'loaihanghoa',
            // populate 2 cấp
            populate: { path: 'danhmuc' }
          });
          // console.log(hanghoaNoneSeri)
          // console.log(hanghoaCoSeri)
        
         
        res.render('./client/chitietlichsunhapkho',{
            user,khoList,hanghoaCoSeri,hanghoaNoneSeri,thoigiannhapkho,canbonhapkho,ghichu,item
        })
    } catch (error) {
        console.log(error.message)
    }
    },
    lichsuxuatkhoPage: async ( req, res) => {
      try {
        let user = req.user;
        let khoList = await Kho.find().sort({thutu: 1});
        const donviList = await Donvi.find().sort({thutu: 1})

        const timeElapsed = new Date();
        let day = ("0" + timeElapsed.getDate()).slice(-2);

        let month = ("0" + (timeElapsed.getMonth() + 1)).slice(-2);
        let year = timeElapsed.getFullYear();
        let time = `${year}-01-01`
        today = `${year}-${month}-${day}`;
        res.render('./client/lichsuxuatkho',{
            user,khoList, today, time,donviList
        })
    } catch (error) {
        console.log(error.message)
    }
    },
    searchLichsuxuatkho: async (req, res) => {
     let {donvi,donvitiepnhan,tungay, denngay} = req.query;
      try {
      
        let lichsuxuatkhoList = await Lichsuxuatkho.find({
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

        let idList = lichsuxuatkhoList.map(i=> i._id.toString());

        // let tongsohangxuatkho = 0;
        let data = [];
        for(item of idList){
          let tongsohangxuatkho = 0;
          let xuatkhoItem  = await Lichsuxuatkho.findById(item)
              .populate("donvitiepnhan")
              .populate("donvi");
          // console.log(xuatkhoItem)
          let hanghoaNoneSeriList = await HanghoaNoneSeri.find({
              "xuatkhoHistory.lichsuxuatkho": item
              },{'xuatkhoHistory.$': 1});
  
          let hanghoaCoSeriList = await HanghoaCoSeri.find({
              "xuatkhoHistory.lichsuxuatkho": item
              },{'xuatkhoHistory.$': 1});
              // console.log(hanghoaNoneSeriList)
          hanghoaNoneSeriList.forEach(i=> {
              tongsohangxuatkho += i.xuatkhoHistory[0].soluong
            });
          hanghoaCoSeriList.forEach(i=> tongsohangxuatkho += i.xuatkhoHistory[0].soluong)
          data.push({
            _id: xuatkhoItem._id,
            timeNumber: xuatkhoItem.timeNumber,
            donvi: xuatkhoItem.donvi.tendonvi,
            canboxuatkho: xuatkhoItem.canboxuatkho,
            ghichu: xuatkhoItem.ghichu,
            tongsohangxuatkho
          })
        };

        res.status(200).json(data);
      } catch (error) {
        console.log(error.message)
      }
    },
    fetchedDonvitructhuoc: async (req, res) => {
      let id1 =req.params.id1;
      try {
        let list =  await Donvitructhuoc.find({donvi: id1}).sort({thutu: 1});
        res.status(200).json(list)
      } catch (error) {}
    },

    chitietLichsuxuatkho: async (req, res) => {
      let id1 = req.params.id1;
      try {
        let khoList = await Kho.find().sort({thutu: 1});
        let xuatkhoHistory = await Lichsuxuatkho.findById(id1).populate('donvi').populate('donvitiepnhan');

        let tongsohangxuatkho = 0;
  
        let hanghoaNoneSeriXuatkho = await HanghoaNoneSeri.find(
          { "xuatkhoHistory.lichsuxuatkho": id1 },
          { "xuatkhoHistory.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1, kho: 1}
        ).populate('loaihanghoa').populate('nguoncap').populate('kho');
  
        hanghoaNoneSeriXuatkho.forEach(i => tongsohangxuatkho += i.xuatkhoHistory[0].soluong)
  
        let hanghoaCoSeriXuatkho = await HanghoaCoSeri.find(
          { "xuatkhoHistory.lichsuxuatkho": id1 },
          { "xuatkhoHistory.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1,trangthai: 1}
        ).populate('loaihanghoa').populate('nguoncap')
         
        let hanghoaCoSeriXuatkhoChuan = [];
        let timeTo = xuatkhoHistory.timeNumber;

        for(item of hanghoaCoSeriXuatkho){
          let sortTrangthai = item.trangthai.filter(i => i.timeNumber <= timeTo).sort((a,b) => b.timeNumber - a.timeNumber);
          let checkedTrangthai = sortTrangthai[0];
          let checkedKho = sortTrangthai.filter(i=> i.status === 1 || i.status === 3);

          let id_kho = checkedKho[0].khohientaiString;// kho xuất hnagf hóa đi trước đó cho đơn vị
        
          if(checkedTrangthai.status === 2 && checkedTrangthai.idTrangthai === id1){
           
            let khotruockhibangiao = await Kho.findById(id_kho);
            // console.log(khotruockhibangiao)
            hanghoaCoSeriXuatkhoChuan.push({
              _id: item._id,
              loaihanghoa: item.loaihanghoa.tenloaihanghoa,
              nguoncap: item.nguoncap.tennguoncap,
              kho: khotruockhibangiao.tenkho,
              mark: item.mark,
              tongsoluongbangiao: 1
            });
          }
        }
        hanghoaCoSeriXuatkho.forEach(i => tongsohangxuatkho += i.xuatkhoHistory[0].soluong)
        
        // console.log(hanghoaCoSeriXuatkhoChuan)
        
        res.render('./client/chitietlichsuxuatkho', {
          user: req.user,
          khoList,
          xuatkhoHistory,
          hanghoaCoSeriXuatkhoChuan,
          hanghoaNoneSeriXuatkho,
          tongsohangxuatkho
        })  
      } catch (error) {
        
      }
    },
    lichsuchuyenkhoPage: async (req,res)=>{
      try {
        let user = req.user;
        let khoList = await Kho.find().sort({thutu: 1});

        const timeElapsed = new Date();
        let day = ("0" + timeElapsed.getDate()).slice(-2);

        let month = ("0" + (timeElapsed.getMonth() + 1)).slice(-2);
        let year = timeElapsed.getFullYear();
        let time = `${year}-01-01`
        today = `${year}-${month}-${day}`;
        res.render('./client/lichsuchuyenkho',{
            user,khoList, today, time
        })
      } catch (error) {
        
      }
    },
    searchLichsuchuyenkho: async(req,res) => {
    
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

        let data = [];
        for(item of lichsuchuyenkhoList){
        //  console.log(item)
          let tongsohangchuyenkho = 0;
          let hanghoaNoneSeriChuyenkho = await HanghoaNoneSeri.find(
            { "hanghoachuyenkhodi.lichsuchuyenkho": item._id },
            { "hanghoachuyenkhodi.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
          ).populate('loaihanghoa').populate('nguoncap');

          hanghoaNoneSeriChuyenkho.forEach(i => tongsohangchuyenkho += i.hanghoachuyenkhodi[0].soluong)

          let hanghoaCoSeriChuyenkho = await HanghoaCoSeri.find(
            { "hanghoachuyenkhodi.lichsuchuyenkho": item._id },
            { "hanghoachuyenkhodi.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
          ).populate('loaihanghoa').populate('nguoncap')
          hanghoaCoSeriChuyenkho.forEach(i => tongsohangchuyenkho += i.hanghoachuyenkhodi[0].soluong)
        
          data.push({
            _id: item._id,
            canbochuyenkho: item.canbochuyenkho,
            timeNumber: item.timeNumber,
            khochuyendi: item.khochuyendi.tenkho,
            khochuyenden: item.khochuyenden.tenkho,
            ghichu: item.ghichu,
            tongsohangchuyenkho
          })
        };

        res.status(200).json(data)

      } catch (error) {
        console.log(error.message)
      }
    },
    chitietLichsuchuyenkho: async (req, res) => {
      let id1 = req.params.id1;
      try {
        let khoList = await Kho.find().sort({thutu: 1});
        let chuyenkhoHistory = await Lichsuchuyenkho.findById(id1)
                                                  .populate('khochuyendi')
                                                  .populate('khochuyenden')
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
      
      // console.log(chuyenkhoHistory)
      res.render('./client/chitietlichsuchuyenkho', {
        user: req.user,
        khoList,
        chuyenkhoHistory,
        hanghoaCoSeriChuyenkho,
        hanghoaNoneSeriChuyenkho,
        tongsohangchuyenkho
      }) 
      } catch (error) {
        console.log(error.message)
      }
    },
    lichsuthanhlyPage: async ( req, res) => {
      try {
        let user = req.user;
        let khoList = await Kho.find().sort({thutu: 1});

        const timeElapsed = new Date();
        let day = ("0" + timeElapsed.getDate()).slice(-2);

        let month = ("0" + (timeElapsed.getMonth() + 1)).slice(-2);
        let year = timeElapsed.getFullYear();
        let time = `${year}-01-01`
        today = `${year}-${month}-${day}`;
        res.render('./client/lichsuthanhly',{
            user,khoList, today, time
        })
      } catch (error) {
        
      }
    },

    searchLichsuthanhly: async (req, res) => {
      let {tungay, denngay, canbothanhly} = req.query;
      try {
      
        let lichsuthanhlyList = await Lichsuthanhly.find({
          canbothanhly: { $regex: canbothanhly, $options: "$ i" },
          ngaythanhly: {
            $gte: tungay,
            $lte: denngay,
          }
        }).sort({ timeNumber: -1 });

        let data = [];
        for(item of lichsuthanhlyList){
          //  console.log(item)
            let tongsohangthanhly = 0;
            let hanghoaNoneSeriThanhly = await HanghoaNoneSeri.find(
              { "thanhlyHistory.lichsuthanhly": item._id },
              { "thanhlyHistory.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
            ).populate('loaihanghoa').populate('nguoncap');
  
            hanghoaNoneSeriThanhly.forEach(i => tongsohangthanhly += i.thanhlyHistory[0].soluong)
  
            let hanghoaCoSeriThanhly = await HanghoaCoSeri.find(
              { "thanhlyHistory.lichsuthanhly": item._id },
              { "thanhlyHistory.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
            ).populate('loaihanghoa').populate('nguoncap')
            hanghoaCoSeriThanhly.forEach(i => tongsohangthanhly += i.thanhlyHistory[0].soluong)
          
            data.push({
              _id: item._id,
              canbothanhly: item.canbothanhly,
              timeNumber: item.timeNumber,
              ghichu: item.ghichu,
              tongsohangthanhly
            })
          };

        res.status(200).json(data);
      } catch (error) {
        console.log(error.message)
      }
    },
    chitietLichsuthanhly: async ( req, res) => {
      let id1 = req.params.id1;
      try {
        let thanhlyHistory = await Lichsuthanhly.findById(id1);
        let khoList = await Kho.find().sort({thutu: 1})
        let tongsohangthanhly = 0;
        // console.log(thanhlyHistory)
        let hanghoaNoneSeriThanhly = await HanghoaNoneSeri.find(
          { "thanhlyHistory.lichsuthanhly": id1 },
          { "thanhlyHistory.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
        ).populate('loaihanghoa').populate('nguoncap').populate('kho');
  
        hanghoaNoneSeriThanhly.forEach(i => tongsohangthanhly += i.thanhlyHistory[0].soluong)
  
        let hanghoaCoSeriThanhly1 = await HanghoaCoSeri.find(
          { "thanhlyHistory.lichsuthanhly": id1 },
          { "thanhlyHistory.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1,trangthai: 1}
        ).populate('loaihanghoa').populate('nguoncap')
         
        let hanghoaCoSeriThanhly = [];
        let timeTo = thanhlyHistory.timeNumber;

        for(item of hanghoaCoSeriThanhly1){
          let sortTrangthai = item.trangthai.filter(i => i.timeNumber <= timeTo).sort((a,b) => b.timeNumber - a.timeNumber);
          let checkedTrangthai = sortTrangthai[0];
          let checkedKho = sortTrangthai.filter(i=> i.status === 1 || i.status === 3);

          let id_kho = checkedKho[0].khohientaiString;// kho xuất hnagf hóa đi trước đó cho đơn vị
        
          if(checkedTrangthai.status === 4 && checkedTrangthai.idTrangthai === id1){
           
            let khotruockhibangiao = await Kho.findById(id_kho);
            // console.log(khotruockhibangiao)
            hanghoaCoSeriThanhly.push({
              _id: item._id,
              loaihanghoa: item.loaihanghoa.tenloaihanghoa,
              nguoncap: item.nguoncap.tennguoncap,
              kho: khotruockhibangiao.tenkho,
              mark: item.mark,
              soluongthanhly: 1
            });
          }
        }
        hanghoaCoSeriThanhly1.forEach(i => tongsohangthanhly += i.thanhlyHistory[0].soluong)
        
        // console.log(hanghoaNoneSeriThanhly)
       
        res.render('./client/chitietlichsuthanhly', {
          user: req.user,
          khoList,
          thanhlyHistory,
          hanghoaCoSeriThanhly,
          hanghoaNoneSeriThanhly,
          tongsohangthanhly
        })  
      } catch (error) {
        
      }
    },
    lichsuthuhoiPage: async (req, res) => {
      try {
        let user = req.user;
        let khoList = await Kho.find().sort({thutu: 1});
        let donviList = await Donvi.find().sort({thutu: 1});

        const timeElapsed = new Date();
        let day = ("0" + timeElapsed.getDate()).slice(-2);

        let month = ("0" + (timeElapsed.getMonth() + 1)).slice(-2);
        let year = timeElapsed.getFullYear();
        let time = `${year}-01-01`
        today = `${year}-${month}-${day}`;
        res.render('./client/lichsuthuhoi',{
            user,khoList, today, time, donviList
        })
      } catch (error) {
        
      }
    },
    searchLichsuthuhoi: async (req, res) => {
      let {donvi,canbothuhoi,khothuhoi, tungay, denngay} = req.query;
      try {
        let lichsuthuhoiList = await Lichsuthuhoi.find({
          canbothuhoi: { $regex: canbothuhoi, $options: "$ i" },
          donviString: { $regex: donvi, $options: "$ i" },
          khothuhoiString: { $regex: khothuhoi, $options: "$ i" },
          ngaythuhoi: {
            $gte: tungay,
            $lte: denngay,
          }
        }).populate('khothuhoi').populate('donvi').sort({ timeNumber: -1 });

        let data = [];
        for(item of lichsuthuhoiList){
        
          let tongsohangthuhoi = 0;

          let hanghoaNoneSeriThuhoiCungkho = await HanghoaNoneSeri.find(
            { "hanghoathuhoi.lichsuthuhoi": item._id },
            { "hanghoathuhoi.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
          ).populate('loaihanghoa').populate('nguoncap').populate('kho');
    
          hanghoaNoneSeriThuhoiCungkho.forEach(i => tongsohangthuhoi += i.hanghoathuhoi[0].soluong);
            
          // console.log(hanghoaNoneSeriThuhoiCungkho)
          let hanghoaNoneSeriThuhoiKhokhacchuyenden = await HanghoaNoneSeri.find(
            { "hanghoathuhoichuyendentukhokhac.lichsuthuhoi": item._id },
            { "hanghoathuhoichuyendentukhokhac.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
          ).populate('loaihanghoa').populate('nguoncap').populate('kho');
    
          hanghoaNoneSeriThuhoiKhokhacchuyenden.forEach(i => tongsohangthuhoi += i.hanghoathuhoichuyendentukhokhac[0].soluong)
          // console.log(hanghoaNoneSeriThuhoiKhokhacchuyenden)
          let hanghoaCoSeriThuhoi = await HanghoaCoSeri.find(
            { "hanghoathuhoi.lichsuthuhoi": item._id },
            { "hanghoathuhoi.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
          ).populate('loaihanghoa').populate('nguoncap')
          // console.log(hanghoaCoSeriThuhoi)
          hanghoaCoSeriThuhoi.forEach(i => tongsohangthuhoi += i.hanghoathuhoi[0].soluong)
          // console.log(tongsohangthuhoi)
    
            data.push({
              _id: item._id,
              canbothuhoi: item.canbothuhoi,
              donvi: item.donvi.tendonvi,
              kho: item.khothuhoi.tenkho,
              timeNumber: item.timeNumber,
              ghichu: item.ghichu,
              tongsohangthuhoi
            })
            console.log(data)
          };
        res.status(200).json(data);
      } catch (error) {
        
      }
    },
    chitietLichsuthuhoi: async ( req, res) => {
      let id1 = req.params.id1;

    try {
      let khoList = await Kho.find().sort({thutu: 1})
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

      res.render('./client/chitietlichsuthuhoi', {
        user: req.user,
        khoList,
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
    thongkeHangtrongkhoPage: async (req, res) =>{
      let user = req.user;
      const timeElapsed = new Date();
      let day = ("0" + timeElapsed.getDate()).slice(-2);

      let month = ("0" + (timeElapsed.getMonth() + 1)).slice(-2);
      let year = timeElapsed.getFullYear();
      let time = `${year}-01-01`
      today = `${year}-${month}-${day}`;

      try {
        let khoList = await Kho.find().sort({thutu: 1});
        let nguoncapList = await Nguoncap.find().sort({thutu: 1});
        let danhmucList = await Danhmuc.find().sort({thutu: 1});
        let loaihanghoaList = await Loaihanghoa.find().sort({thutu: 1});
        res.render('./client/thongketrongkho.ejs', {
          user, khoList, danhmucList, loaihanghoaList, nguoncapList, today, time
        })
      } catch (error) {
          console.log(error.message)
      }
    },
    searchThongkeHangtrongkho: async (req, res)=> {
      let {kho,  denngay, nguoncap, danhmuc, loaihanghoa} = req.query;
      try {
        let khoList;
        // console.log(kho)
        if(kho === ''){
          khoList = await Kho.find().sort({thutu: 1})
        }else{
          khoList = await Kho.find({_id: kho})
        };
      
      // let timeFrom = tungay.slice(0,4) + tungay.slice(5,7)+tungay.slice(8,10) + '0000';
      timeFrom = Number(0);
      let timeTo = denngay.slice(0,4) + denngay.slice(5,7)+denngay.slice(8,10) + '9999';
      timeTo = Number(timeTo);

      let data = [];
      let hanghoaNoneSeriInKho = [];
      let hanghoaCoSeriInKho = [];

      for(element of khoList){
        let hanghoaNoneSeri = await HanghoaNoneSeri.find({
          khoString: element._id,
          danhmucString: { $regex: danhmuc, $options: "$ i" },
          nguoncapString: { $regex: nguoncap, $options: "$ i" },
          loaihanghoaString: { $regex: loaihanghoa, $options: "$ i" },
        })
        .populate('loaihanghoa')
        .populate('nguoncap')
        .populate('kho')
        
        for(item of hanghoaNoneSeri){
          let matchedArrNhapkho = item.nhapkhoHistory.filter(
            (i) => i.timeNumber <= timeTo && i.timeNumber >= timeFrom 
          );
          let hangnhapkho = 0;
          matchedArrNhapkho.forEach((e) => (hangnhapkho += e.soluong));
  
  
          let matchedArr = item.xuatkhoHistory.filter(
            (i) => i.timeNumber <= timeTo && i.timeNumber >= timeFrom 
          );
          let hangxuatkho = 0;
          matchedArr.forEach((e) => (hangxuatkho += e.soluong));
  
          let matchedThanhlyArr = item.thanhlyHistory.filter(
            (i) => i.timeNumber <= timeTo && i.timeNumber >= timeFrom
          );
          let hangthanhly = 0;
          matchedThanhlyArr.forEach((e) => (hangthanhly += e.soluong));
  
          let matchedThuhoiArr = item.hanghoathuhoi.filter(
            (i) => i.timeNumber <= timeTo && i.timeNumber >= timeFrom 
          );
          let hangthuhoi = 0;
          matchedThuhoiArr.forEach((e) => (hangthuhoi += e.soluong));
  
          let matchedThuhoichuyendentukhokhacArr = item.hanghoathuhoichuyendentukhokhac.filter(
            (i) => i.timeNumber <= timeTo && i.timeNumber >= timeFrom
          );
          let hangthuhoichuyendentukhokhac = 0;
          matchedThuhoichuyendentukhokhacArr.forEach((e) => (hangthuhoichuyendentukhokhac += e.soluong));
  
          let matchedChuyendiArr = item.hanghoachuyenkhodi.filter(
            (i) => i.timeNumber <= timeTo && i.timeNumber >= timeFrom 
          );
      
          let hangchuyenkhodi = 0;
  
          matchedChuyendiArr.forEach((e) => {
              hangchuyenkhodi += e.soluong;  
          });
  
          let matchedChuyendenArr = item.hanghoachuyenkhoden.filter(
            (i) =>  i.timeNumber <= timeTo && i.timeNumber >= timeFrom  
          );
          let hangchuyenkhoden = 0;
          matchedChuyendenArr.forEach((e) => (hangchuyenkhoden += e.soluong));
  
          let hanghoacotrongkho =
            hangnhapkho + hangchuyenkhoden + hangthuhoi + hangthuhoichuyendentukhokhac  - hangxuatkho - hangchuyenkhodi - hangthanhly;
            // console.log(hanghoacotrongkho)
            if(hanghoacotrongkho > 0){
               hanghoaNoneSeriInKho.push({
                _id: item._id,
                mark: item.mark,
                loaihanghoa: item.loaihanghoa.tenloaihanghoa,
                nguoncap: item.nguoncap.tennguoncap,
                kho: item.kho.tenkho,
                hanghoacotrongkho
              });
            }
          }   
          
          let hanghoaCoSeri = await HanghoaCoSeri.aggregate([
            {
              $match : { 
                danhmucString: { $regex: danhmuc, $options: "$ i" },
                nguoncapString: { $regex: nguoncap, $options: "$ i" },
                loaihanghoaString: { $regex: loaihanghoa, $options: "$ i" } 
              }
          },
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
                              { $lte: [ "$$this.timeNumber", timeTo] },
                              { $gte: [ "$$this.timeNumber", timeFrom] },
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
        for (item of hanghoaCoSeri) {
            if(item.trangthai !== undefined && item.trangthai.khohientaiString === element._id.toString() && item.trangthai.status === 1
              || item.trangthai !== undefined && item.trangthai.khohientaiString === element._id.toString() && item.trangthai.status === 3
              ){
                hanghoaCoSeriInKho.push({
                  _id: item._id,
                  mark: item.mark,
                  loaihanghoa: item.loaihanghoa.tenloaihanghoa,
                  nguoncap: item.nguoncap.tennguoncap,
                  kho: element.tenkho,
                  hanghoacotrongkho: 1,
                });     
            };
          }
        };

        // console.log(hanghoaCoSeriInKho)   
        data = data.concat(hanghoaNoneSeriInKho).concat(hanghoaCoSeriInKho)                               
        // console.log(data)
        let tongsoluongtrongkho = 0;
        data.forEach(i=> tongsoluongtrongkho += i.hanghoacotrongkho);

        res.status(200).send({data, tongsoluongtrongkho})
 
      } catch (error) {
        
      }
    },
    thongkeHangnhapkhoPage: async (req, res) => {
      let user = req.user;
      const timeElapsed = new Date();
      let day = ("0" + timeElapsed.getDate()).slice(-2);

      let month = ("0" + (timeElapsed.getMonth() + 1)).slice(-2);
      let year = timeElapsed.getFullYear();
      let time = `${year}-01-01`
      today = `${year}-${month}-${day}`;

      try {
        let khoList = await Kho.find().sort({thutu: 1});
        let nguoncapList = await Nguoncap.find().sort({thutu: 1});
        let danhmucList = await Danhmuc.find().sort({thutu: 1});
        let loaihanghoaList = await Loaihanghoa.find().sort({thutu: 1});
        res.render('./client/thongkehangnhapkho.ejs', {
          user, khoList, danhmucList, loaihanghoaList, nguoncapList, today, time
        })
      } catch (error) {
          console.log(error.message)
      }
    },

    searchThongkeHangnhapkho: async (req, res)=> {
      // console.log(req.query)
      let {kho, tungay, denngay, nguoncap, danhmuc, loaihanghoa} = req.query;
      try {
        let khoList;
        if(kho === ''){
          khoList = await Kho.find().sort({thutu: 1})
        }else{
          khoList = await Kho.find({_id: kho})
        };
        // console.log(kho)
      
      let timeFrom = tungay.slice(0,4) + tungay.slice(5,7)+tungay.slice(8,10) + '0000';
      timeFrom = Number(timeFrom);
      let timeTo = denngay.slice(0,4) + denngay.slice(5,7)+denngay.slice(8,10) + '9999';
      timeTo = Number(timeTo);

      let data = [];
      let hanghoaNoneSeriInKho = [];
      let hanghoaCoSeriInKho = [];

        // console.log(khoList)
      for(element of khoList){
        // console.log(2)
        let hanghoaNoneSeri = await HanghoaNoneSeri.find({
          khoString: element._id,
          danhmucString: { $regex: danhmuc, $options: "$ i" },
          nguoncapString: { $regex: nguoncap, $options: "$ i" },
          loaihanghoaString: { $regex: loaihanghoa, $options: "$ i" }
        })
        .populate('loaihanghoa')
        .populate('nguoncap')
        .populate('kho')

        for(item of hanghoaNoneSeri){
          let matchedArrNhapkho = item.nhapkhoHistory.filter(
            (i) => i.timeNumber <= timeTo && i.timeNumber >= timeFrom 
          );
          let hangnhapkho = 0;
          matchedArrNhapkho.forEach((e) => (hangnhapkho += e.soluong));
  
            if(hangnhapkho > 0){
               hanghoaNoneSeriInKho.push({
                _id: item._id,
                mark: item.mark,
                loaihanghoa: item.loaihanghoa.tenloaihanghoa,
                nguoncap: item.nguoncap.tennguoncap,
                kho: item.kho.tenkho,
                hangnhapkho
              });
            }
          }   
          // console.log(1)
          let hanghoaCoSeri = await HanghoaCoSeri.find({
            khoString: element._id,
            danhmucString: { $regex: danhmuc, $options: "$ i" },
            nguoncapString: { $regex: nguoncap, $options: "$ i" },
            loaihanghoaString: { $regex: loaihanghoa, $options: "$ i" },
            "nhapkhoHistory.timeNumber": {$gte: timeFrom, $lte: timeTo}
          })   
          .populate('loaihanghoa')
        .populate('nguoncap')
        .populate('kho')
        for (item of hanghoaCoSeri) {
                hanghoaCoSeriInKho.push({
                  _id: item._id,
                  mark: item.mark,
                  loaihanghoa: item.loaihanghoa.tenloaihanghoa,
                  nguoncap: item.nguoncap.tennguoncap,
                  kho: element.tenkho,
                  hangnhapkho: 1,
                });           
          }
        };

        // console.log(hanghoaCoSeriInKho)   
        data = data.concat(hanghoaNoneSeriInKho).concat(hanghoaCoSeriInKho)                               
        // console.log(data)
        let tongsoluongnhapkho = 0;
        data.forEach(i=> tongsoluongnhapkho += i.hangnhapkho);
        // console.log(data)

        res.status(200).send({data, tongsoluongnhapkho})
 
      } catch (error) {
        
      }
    },
    thongkeHangxuatkhoPage: async (req, res) => {
      let user = req.user;
      const timeElapsed = new Date();
      let day = ("0" + timeElapsed.getDate()).slice(-2);

      let month = ("0" + (timeElapsed.getMonth() + 1)).slice(-2);
      let year = timeElapsed.getFullYear();
      let time = `${year}-01-01`
      today = `${year}-${month}-${day}`;

      try {
        let khoList = await Kho.find().sort({thutu: 1});
        let donviList = await Donvi.find().sort({thtu: 1});
        // let donvitiepnhanList = await Donvitructhuoc.find().sort({thtu: 1});
        let nguoncapList = await Nguoncap.find().sort({thutu: 1});
        let danhmucList = await Danhmuc.find().sort({thutu: 1});
        let loaihanghoaList = await Loaihanghoa.find().sort({thutu: 1});
        res.render('./client/thongkehangxuatkho.ejs', {
          user, khoList, danhmucList, loaihanghoaList, nguoncapList, today, time,
          donviList
        })
      } catch (error) {
          console.log(error.message)
      }
    },
    searchThongkeHangxuatkho: async (req, res) => {
      let {kho, tungay, denngay, nguoncap, danhmuc, loaihanghoa, donvi, donvitiepnhan} = req.query;
      try {

      let timeFrom = tungay.slice(0,4) + tungay.slice(5,7)+tungay.slice(8,10) + '0000';
      timeFrom = Number(timeFrom);
      let timeTo = denngay.slice(0,4) + denngay.slice(5,7)+denngay.slice(8,10) + '9999';
      timeTo = Number(timeTo);

      let lichsuxuatkhoList = await Lichsuxuatkho.find({ 
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

      let idList = lichsuxuatkhoList.map(i=> i._id.toString());

      // let tongsohangxuatkho = 0;
      let data = [];
      // let tongsoluongxuatkho = 0;
      let tongsohangxuatkho = 0;
      
      
      for(item of idList){ //item là id lịch sử xuất kho
        let xuatkhoItem  = await Lichsuxuatkho.findById(item)
            .populate("donvitiepnhan")
            .populate("donvi");
        // console.log(xuatkhoItem)
        let hanghoaNoneSeriList = await HanghoaNoneSeri.find({
              "xuatkhoHistory.lichsuxuatkho": item,
              khoString: { $regex: kho, $options: "$ i" },
              nguoncapString: { $regex: nguoncap, $options: "$ i" },
              danhmucString: { $regex: danhmuc, $options: "$ i" },
              loaihanghoaString: { $regex: loaihanghoa, $options: "$ i" },
            },
            {'xuatkhoHistory.$': 1,loaihanghoa: 1, mark: 1, nguoncap: 1, kho: 1}
            ).populate('loaihanghoa').populate('nguoncap').populate('kho')
            ;
            
            let hanghoaCoSeriList = await HanghoaCoSeri.find({
              "xuatkhoHistory.lichsuxuatkho": item,
              danhmucString: { $regex: danhmuc, $options: "$ i" },
              nguoncapString: { $regex: nguoncap, $options: "$ i" },
              loaihanghoaString: { $regex: loaihanghoa, $options: "$ i" },
            },{'xuatkhoHistory.$': 1, loaihanghoa: 1,mark: 1, nguoncap: 1, trangthai: 1}).populate('loaihanghoa').populate('nguoncap');
            
            // console.log(hanghoaNoneSeriList)
        hanghoaNoneSeriList.forEach(i=> {
            tongsohangxuatkho += i.xuatkhoHistory[0].soluong;
            data.push({
              loaihanghoa: i.loaihanghoa.tenloaihanghoa,
              nguoncap: i.nguoncap.tennguoncap,
              mark: i.mark,
              donvi: xuatkhoItem.donvi.tendonvi,
              kho: i.kho.tenkho,
              soluongxuatkho: i.xuatkhoHistory[0].soluong 
            })
          });

        hanghoaCoSeriList.forEach(i=> tongsohangxuatkho += i.xuatkhoHistory[0].soluong)
        // console.log(hanghoaCoSeriList)
        for(element of hanghoaCoSeriList){
          let sortTrangthai = element.trangthai.filter(i => i.timeNumber <= xuatkhoItem.timeNumber).sort((a,b) => b.timeNumber - a.timeNumber);
          let checkedTrangthai = sortTrangthai[0];
          let checkedKho = sortTrangthai.filter(i=> i.status === 1 || i.status === 3);
          let id_kho = checkedKho[0].khohientaiString;// kho xuất hnagf hóa đi trước đó cho đơn vị
        // console.log(id_kho)
          if(checkedTrangthai.status === 2 && checkedTrangthai.idTrangthai === item){
           
            let khotruockhibangiao = await Kho.findById(id_kho);
            // console.log(khotruockhibangiao)
            data.push({
              loaihanghoa: element.loaihanghoa.tenloaihanghoa,
              nguoncap: element.nguoncap.tennguoncap,
              kho: khotruockhibangiao.tenkho,
              donvi: xuatkhoItem.donvi.tendonvi,
              mark: element.mark,
              soluongxuatkho: 1
            });
          }
        }
      };
      // console.log(data)
        res.status(200).send({data, tongsohangxuatkho})
 
      } catch (error) {
        
      }
    },
    thongkeHangthuhoiPage: async (req, res) => {
      let user = req.user;
      const timeElapsed = new Date();
      let day = ("0" + timeElapsed.getDate()).slice(-2);

      let month = ("0" + (timeElapsed.getMonth() + 1)).slice(-2);
      let year = timeElapsed.getFullYear();
      let time = `${year}-01-01`
      today = `${year}-${month}-${day}`;

      try {
        let khoList = await Kho.find().sort({thutu: 1});
        let donviList = await Donvi.find().sort({thtu: 1});
        // let donvitiepnhanList = await Donvitructhuoc.find().sort({thtu: 1});
        let nguoncapList = await Nguoncap.find().sort({thutu: 1});
        let danhmucList = await Danhmuc.find().sort({thutu: 1});
        let loaihanghoaList = await Loaihanghoa.find().sort({thutu: 1});
        res.render('./client/thongkehangthuhoi.ejs', {
          user, khoList, danhmucList, loaihanghoaList, nguoncapList, today, time,
          donviList
        })
      } catch (error) {
          console.log(error.message)
      }
    },

    searchThongkeHangthuhoi: async (req, res) => {
      // console.log(req.query)
      let {donvi, khothuhoi, tungay, denngay, nguoncap,danhmuc, loaihanghoa} = req.query;
      let timeFrom = tungay.slice(0,4) + tungay.slice(5,7)+tungay.slice(8,10) + '0000';
      timeFrom = Number(timeFrom);
      let timeTo = denngay.slice(0,4) + denngay.slice(5,7)+denngay.slice(8,10) + '9999';
      timeTo = Number(timeTo);
      try {
        let lichsuthuhoiList = await Lichsuthuhoi.find({ 
          donviString: { $regex: donvi, $options: "$ i" },
          khothuhoiString: { $regex: khothuhoi, $options: "$ i" },
          ngaythuhoi: {
            $gte: tungay,
            $lte: denngay,
          }
        })
          .populate("khothuhoi")
          .populate("donvi")
          .sort({ timeNumber: -1 });

          let data = [];
          let tongsohangthuhoi = 0;

          for(item of lichsuthuhoiList){

          let hanghoaNoneSeriThuhoiCungkho = await HanghoaNoneSeri.find(
            { 
              "hanghoathuhoi.lichsuthuhoi": item._id,
              nguoncapString: { $regex: nguoncap, $options: "$ i" },
              danhmucString: { $regex: danhmuc, $options: "$ i" },
              loaihanghoaString: { $regex: loaihanghoa, $options: "$ i" } 
            },
            { "hanghoathuhoi.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
            ).populate('loaihanghoa').populate('nguoncap').populate('kho');
    
          hanghoaNoneSeriThuhoiCungkho.forEach(i => {
            data.push({
              loaihanghoa: i.loaihanghoa.tenloaihanghoa,
              nguoncap: i.nguoncap.tennguoncap,
              mark: i.mark,
              donvi: item.donvi.tendonvi,
              soluong: i.hanghoathuhoi[0].soluong
            });

            tongsohangthuhoi += i.hanghoathuhoi[0].soluong
          });
          let hanghoaNoneSeriThuhoiKhokhacchuyenden = await HanghoaNoneSeri.find(
            { "hanghoathuhoichuyendentukhokhac.lichsuthuhoi": item._id,
            nguoncapString: { $regex: nguoncap, $options: "$ i" },
            danhmucString: { $regex: danhmuc, $options: "$ i" },
            loaihanghoaString: { $regex: loaihanghoa, $options: "$ i" },
          },
          { "hanghoathuhoichuyendentukhokhac.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
          ).populate('loaihanghoa').populate('nguoncap').populate('kho');
          
          hanghoaNoneSeriThuhoiKhokhacchuyenden.forEach(i => {
            data.push({
              loaihanghoa: i.loaihanghoa.tenloaihanghoa,
              nguoncap: i.nguoncap.tennguoncap,
              mark: i.mark,
              donvi: item.donvi.tendonvi,
              soluong: i.hanghoathuhoichuyendentukhokhac[0].soluong
            });
            tongsohangthuhoi += i.hanghoathuhoichuyendentukhokhac[0].soluong
          })
          
          let hanghoaCoSeriThuhoi = await HanghoaCoSeri.find(
            { "hanghoathuhoi.lichsuthuhoi": item._id ,
              nguoncapString: { $regex: nguoncap, $options: "$ i" },
              danhmucString: { $regex: danhmuc, $options: "$ i" },
              loaihanghoaString: { $regex: loaihanghoa, $options: "$ i" }
          },
            { "hanghoathuhoi.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
            ).populate('loaihanghoa').populate('nguoncap')
            // console.log(hanghoaCoSeriThuhoi[0].hanghoathuhoi)
            hanghoaCoSeriThuhoi.forEach(i => {
              data.push({
                loaihanghoa: i.loaihanghoa.tenloaihanghoa,
                nguoncap: i.nguoncap.tennguoncap,
                mark: i.mark,
                donvi: item.donvi.tendonvi,
                soluong: i.hanghoathuhoi[0].soluong
              });

              tongsohangthuhoi += i.hanghoathuhoi[0].soluong
            })
          }
          // console.log(1)
          // console.log(tongsohangthuhoi)
          // data.forEach(i => tongsohangthuhoi += i.soluong)
          // console.log(data)
          res.status(200).json({data, tongsohangthuhoi})
      } catch (error) {
        
      }
    },
    thongkeHangthanhlyPage: async (req, res) => {
      let user = req.user;
      const timeElapsed = new Date();
      let day = ("0" + timeElapsed.getDate()).slice(-2);

      let month = ("0" + (timeElapsed.getMonth() + 1)).slice(-2);
      let year = timeElapsed.getFullYear();
      let time = `${year}-01-01`
      today = `${year}-${month}-${day}`;

      try {
        let khoList = await Kho.find().sort({thutu: 1});
     
        let nguoncapList = await Nguoncap.find().sort({thutu: 1});
        let danhmucList = await Danhmuc.find().sort({thutu: 1});
        let loaihanghoaList = await Loaihanghoa.find().sort({thutu: 1});
        res.render('./client/thongkehangthanhly.ejs', {
          user, khoList, danhmucList, loaihanghoaList, nguoncapList, today, time,
        })
      } catch (error) {
          console.log(error.message)
      }
    },

    searchThongkeHangthanhly: async (req, res) => {
      try {
        // console.log(req.query)
        let {kho, tungay, denngay, nguoncap, danhmuc, loaihanghoa} = req.query;
        let timeFrom = tungay.slice(0,4) + tungay.slice(5,7)+tungay.slice(8,10) + '0000';
        timeFrom = Number(timeFrom);
        let timeTo = denngay.slice(0,4) + denngay.slice(5,7)+denngay.slice(8,10) + '9999';
        timeTo = Number(timeTo);

        let data = [];
        let tongsohangthanhly = 0;
        let lichsuthanhlyList = await Lichsuthanhly.find({ 
          ngaythanhly: {
            $gte: tungay,
            $lte: denngay,
          }
        });

        for(item of lichsuthanhlyList){
          let hanghoaNoneSeriThanhly = await HanghoaNoneSeri.find(
            { 
              "thanhlyHistory.lichsuthanhly": item._id,
              khoString: { $regex: kho, $options: "$ i" },
              nguoncapString: { $regex: nguoncap, $options: "$ i" },
              danhmucString: { $regex: danhmuc, $options: "$ i" },
              loaihanghoaString: { $regex: loaihanghoa, $options: "$ i" } 
            },
            { "thanhlyHistory.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
            ).populate('loaihanghoa').populate('nguoncap').populate('kho');
    
            hanghoaNoneSeriThanhly.forEach(i=>{
              data.push({
                loaihanghoa: i.loaihanghoa.tenloaihanghoa,
                nguoncap: i.nguoncap.tennguoncap,
                mark: i.mark,
                soluong: i.thanhlyHistory[0].soluong
              });

              tongsohangthanhly += i.thanhlyHistory[0].soluong;

            });

        let hanghoaCoSeriThanhly = await HanghoaCoSeri.find(
          { 
            "thanhlyHistory.lichsuthanhly": item._id,
            nguoncapString: { $regex: nguoncap, $options: "$ i" },
            danhmucString: { $regex: danhmuc, $options: "$ i" },
            loaihanghoaString: { $regex: loaihanghoa, $options: "$ i" } 
          },
          { "thanhlyHistory.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1,trangthai: 1}
          ).populate('loaihanghoa').populate('nguoncap').populate('kho');

          for(item of hanghoaCoSeriThanhly){
            let sortTrangthai = item.trangthai.filter(i => i.timeNumber <= timeTo).sort((a,b) => b.timeNumber - a.timeNumber);
            let checkedTrangthai = sortTrangthai[0];
            let checkedKho = sortTrangthai.filter(i=> i.status === 1 || i.status === 3);
  
            let id_kho = checkedKho[0].khohientaiString;
          // console.log(id_kho)
            if(checkedTrangthai.status === 4 && id_kho.includes(kho)){
              data.push({
                loaihanghoa: item.loaihanghoa.tenloaihanghoa,
                nguoncap: item.nguoncap.tennguoncap,
                mark: item.mark,
                soluong: 1
              });
              tongsohangthanhly += 1
            };

          }
        }

        res.status(200).json({data,tongsohangthanhly})

      } catch (error) {
        
      }
    },

    tracuuHanghoaPage: async (req, res) => {
      let user = req.user;
      try {
        let khoList = await Kho.find().sort({thutu: 1});
     
        let nguoncapList = await Nguoncap.find().sort({thutu: 1});
        let danhmucList = await Danhmuc.find().sort({thutu: 1});
        let loaihanghoaList = await Loaihanghoa.find().sort({thutu: 1});
        res.render('./client/tracuuhanghoa.ejs', {
          user, khoList, danhmucList, loaihanghoaList, nguoncapList
        })
      } catch (error) {
        
      }
    },

    searchTracuuHanghoa: async (req, res) => {
      // console.log(req.query)
      let { nguoncap, danhmuc, loaihanghoa, mark} = req.query;
      try {
        let data = [];
        let hanghoaCoSeri = await HanghoaCoSeri.find({
          nguoncapString: { $regex: nguoncap, $options: "$ i" },
          danhmucString: { $regex: danhmuc, $options: "$ i" },
          mark: { $regex: mark, $options: "$ i" },
          loaihanghoaString: { $regex: loaihanghoa, $options: "$ i" } 
        }).populate('loaihanghoa').populate('nguoncap');

      for(item of hanghoaCoSeri){
        // console.log(item)
        let sortTrangthai = item.trangthai.sort((a,b) => b.timeNumber - a.timeNumber);
        let checkedTrangthai = sortTrangthai[0];
        if(checkedTrangthai.status === 1 || checkedTrangthai.status === 3){
          data.push({
            _id: item._id,
            loaihanghoa: item.loaihanghoa.tenloaihanghoa,
            nguoncap: item.nguoncap.tennguoncap,
            mark: item.mark,
            trangthai: "Trong kho"
          })
        };
        if(checkedTrangthai.status === 2){
          data.push({
            _id: item._id,
            loaihanghoa: item.loaihanghoa.tenloaihanghoa,
            nguoncap: item.nguoncap.tennguoncap,
            mark: item.mark,
            trangthai: "Đã xuất kho"
          })
        };

        if(checkedTrangthai.status === 4){
          data.push({
            _id: item._id,
            loaihanghoa: item.loaihanghoa.tenloaihanghoa,
            nguoncap: item.nguoncap.tennguoncap,
            mark: item.mark,
            trangthai: "Đã thanh lý"
          })
        };       
      };

      res.status(200).json(data)
      } catch (error) {
        
      }
    },
    lichsuTrangthaiHanghoa: async (req, res) => {
      let id1 = req.params.id1;
      let user = req.user;
      try {
        let khoList = await Kho.find().sort({thutu: 1});

        let item = await HanghoaCoSeri.findById(id1,{loaihanghoa: 1, nguoncap: 1, trangthai: 1, mark: 1}).populate('nguoncap').populate('loaihanghoa');
        
        let trangthai = item.trangthai.sort((a,b) => 
          a.timeNumber - b.timeNumber
        );

        let data = [];
        for(i of trangthai){
          if(i.status === 1){
            let kho = await Kho.findById(i.khohientaiString);
            let checkedChuyenkho = i.idTrangthai !== undefined;
            data.push({
              trangthai: checkedChuyenkho ? "Chuyển kho" :"Nhập kho",
              vitrihientai: kho.tenkho,
              timeNumber: i.timeNumber
            })
          };

          if(i.status === 2){
            let lichsuxuatkho = await Lichsuxuatkho.findById(i.idTrangthai).populate('donvi')
            data.push({
              trangthai: "Xuất kho",
              vitrihientai: lichsuxuatkho.donvi.tendonvi,
              timeNumber: i.timeNumber
            })
          };

          if(i.status === 3){
            let kho = await Kho.findById(i.khohientaiString)
            data.push({
              trangthai: "Thu hồi về kho",
              vitrihientai:  kho.tenkho,
              timeNumber: i.timeNumber
            })
          };

          if(i.status === 4){
            data.push({
              trangthai: "Thanh lý",
              vitrihientai:  '',
              timeNumber: i.timeNumber
            })
          };

        }
        // console.log(data)
        res.render('./client/lichsuhanghoacoseri', {
          user, khoList,item,
          data
        })
      } catch (error) {
        
      }
    },
    // thongketonghopPage: async (req, res) => {
    //   let user = req.user;
    //   const timeElapsed = new Date();
    //   let day = ("0" + timeElapsed.getDate()).slice(-2);

    //   let month = ("0" + (timeElapsed.getMonth() + 1)).slice(-2);
    //   let year = timeElapsed.getFullYear();
    //   today = `${year}-${month}-${day}`;
    //   try {
    //     let khoList = await Kho.find().sort({thutu: 1});

    //     res.render('./client/thongketonghop.ejs', {
    //       user, khoList, today
    //     })
    //   } catch (error) {
        
    //   }
    // },

    searchThongketonghop: async (req, res) => {
      let {denngay} = req.query;
      let timeTo = denngay.slice(0,4) + denngay.slice(5,7)+denngay.slice(8,10) + '9999';
      timeTo = Number(timeTo);
      let timeFrom  = 0;
      
      try {
        // Tính tồn kho trước đó

        //


        //nhập kho
        let lichsunhapkhoList = await Lichsunhapkho.find({
          timeNumber: {
            $gte: timeFrom,
            $lte: timeTo,
          }
        })
          .sort({ timeNumber: -1 });
  
        let tongsohangnhapkho = 0;
        lichsunhapkhoList.forEach((i) => (tongsohangnhapkho += i.tongsoluonghangnhap));

        //xuất kho
        let lichsuxuatkhoList = await Lichsuxuatkho.find({
          timeNumber: {
            $gte: timeFrom,
            $lte: timeTo,
          }
        })
          .sort({ timeNumber: -1 });

        let idList = lichsuxuatkhoList.map(i=> i._id.toString());

        let tongsohangxuatkho = 0;

        for(item of idList){
          let hanghoaNoneSeriList = await HanghoaNoneSeri.find({
              "xuatkhoHistory.lichsuxuatkho": item
              },{'xuatkhoHistory.$': 1});
  
          let hanghoaCoSeriList = await HanghoaCoSeri.find({
              "xuatkhoHistory.lichsuxuatkho": item
              },{'xuatkhoHistory.$': 1});
              // console.log(hanghoaNoneSeriList)
          hanghoaNoneSeriList.forEach(i=> {
              tongsohangxuatkho += i.xuatkhoHistory[0].soluong
            });
          hanghoaCoSeriList.forEach(i=> tongsohangxuatkho += i.xuatkhoHistory[0].soluong)
        };
        
        //thu hồi
        let lichsuthuhoiList = await Lichsuthuhoi.find({
          timeNumber: {
            $gte: timeFrom,
            $lte: timeTo,
          }});

        let tongsohangthuhoi = 0;
        for(item of lichsuthuhoiList){
        
          let hanghoaNoneSeriThuhoiCungkho = await HanghoaNoneSeri.find(
            { "hanghoathuhoi.lichsuthuhoi": item._id },
            { "hanghoathuhoi.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1})
    
          hanghoaNoneSeriThuhoiCungkho.forEach(i => tongsohangthuhoi += i.hanghoathuhoi[0].soluong);
            

          let hanghoaNoneSeriThuhoiKhokhacchuyenden = await HanghoaNoneSeri.find(
            { "hanghoathuhoichuyendentukhokhac.lichsuthuhoi": item._id },
            { "hanghoathuhoichuyendentukhokhac.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
          );
    
          hanghoaNoneSeriThuhoiKhokhacchuyenden.forEach(i => tongsohangthuhoi += i.hanghoathuhoichuyendentukhokhac[0].soluong)

          let hanghoaCoSeriThuhoi = await HanghoaCoSeri.find(
            { "hanghoathuhoi.lichsuthuhoi": item._id },
            { "hanghoathuhoi.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1}
          )
          hanghoaCoSeriThuhoi.forEach(i => tongsohangthuhoi += i.hanghoathuhoi[0].soluong)
          };

          //thanh lý
          let lichsuthanhlyList = await Lichsuthanhly.find({
            timeNumber: {
              $gte: timeFrom,
              $lte: timeTo
            }
          }).sort({ timeNumber: -1 });
          // console.log(lichsuthanhlyList)
          let tongsohangthanhly = 0;
          for(item of lichsuthanhlyList){
              let hanghoaNoneSeriThanhly = await HanghoaNoneSeri.find(
                { "thanhlyHistory.lichsuthanhly": item._id },
                { "thanhlyHistory.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1})
    
              hanghoaNoneSeriThanhly.forEach(i => tongsohangthanhly += i.thanhlyHistory[0].soluong)
    
              let hanghoaCoSeriThanhly = await HanghoaCoSeri.find(
                { "thanhlyHistory.lichsuthanhly": item._id },
                { "thanhlyHistory.$": 1, loaihanghoa: 1,nguoncap:1, mark: 1})
              hanghoaCoSeriThanhly.forEach(i => tongsohangthanhly += i.thanhlyHistory[0].soluong)
            };
            
           let tongsohangtonkho = tongsohangnhapkho + tongsohangthuhoi - tongsohangxuatkho -tongsohangthanhly;
           res.status(200).json({tongsohangnhapkho,tongsohangthanhly,tongsohangthuhoi,tongsohangxuatkho,tongsohangtonkho})
         
      } catch (error) {
        
      }
    },

    thongketonghopPage2: async (req, res) => {
      let user = req.user;
      const timeElapsed = new Date();
      let day = ("0" + timeElapsed.getDate()).slice(-2);

      let month = ("0" + (timeElapsed.getMonth() + 1)).slice(-2);
      let year = timeElapsed.getFullYear();
      let time = `${year}-01-01`
      today = `${year}-${month}-${day}`;
      try {
        let khoList = await Kho.find().sort({thutu: 1});
        let nguoncapList = await Nguoncap.find().sort({thutu: 1});
        let danhmucList = await Danhmuc.find().sort({thutu: 1});
        let loaihanghoaList = await Loaihanghoa.find().sort({thutu: 1});
        res.render('./client/thongketonghop2.ejs', {
          user, khoList, today,nguoncapList,danhmucList,loaihanghoaList, time
        })
      } catch (error) {
        
      }
    },
    // sửa
    searchThongketonghop2: async(req, res) => {
      let {denngay, tungay, kho, nguoncap, danhmuc, loaihanghoa} = req.query;
      let timeTo = denngay.slice(0,4) + denngay.slice(5,7)+denngay.slice(8,10) + '9999';
      timeTo = Number(timeTo);
      let timeFrom = tungay.slice(0,4) + tungay.slice(5,7)+tungay.slice(8,10) + '0000';
      timeFrom = Number(timeFrom);
      try {
        // tính hàng tồn kho trươc thời điểm search 
        
        let data = [];
        
        let hanghoaNoneSeri = await HanghoaNoneSeri.find({
          khoString: { $regex: kho, $options: "$ i" },
          danhmucString: { $regex: danhmuc, $options: "$ i" },
          nguoncapString: { $regex: nguoncap, $options: "$ i" },
          loaihanghoaString: { $regex: loaihanghoa, $options: "$ i" }
        })
        .populate('loaihanghoa')
        .populate('nguoncap')
        .populate('kho')
            
        // console.log(danhmuc)
        let loaihanghoaAll = await Loaihanghoa.find().populate('danhmuc');  
        let loaihanghoaDb = null;
        if(danhmuc === ""){ // danh mucj chonjn taast ca thi tim loaihanghoa theo hang hoa
          loaihanghoaDb = loaihanghoaAll.filter(i=> i._id.toString().includes(loaihanghoa));
        }else{
          loaihanghoaDb = loaihanghoaAll.filter(i=> 
            i._id.toString().includes(loaihanghoa) && i.danhmuc._id.toString()=== danhmuc);
        }
        // console.log(loaihanghoaDb.length)
        // console.log(loaihanghoaAll)
        // console.log(loaihanghoaDb)
        
        for(item of hanghoaNoneSeri){
          let hangnhapkhotime1 = 0;
          let hangxuatkhotime1 = 0;
          let hangchuyenkhoditime1 = 0;
          let hangchuyenkhodentime1 = 0;
          let hangthuhoitime1 = 0;
          let hangthanhlytime1 = 0;
  
          let hangnhapkhotime2 = 0;
          let hangxuatkhotime2 = 0;
          let hangchuyenkhoditime2 = 0;
          let hangchuyenkhodentime2 = 0;
          let hangthuhoitime2 = 0;
          let hangthanhlytime2 = 0;

          item.nhapkhoHistory.forEach(i=> {
            if(i.timeNumber < timeFrom){
              hangnhapkhotime1 += i.soluong
            };
            if(i.timeNumber >= timeFrom && i.timeNumber <= timeTo){
              hangnhapkhotime2 += i.soluong
            }
          });

          item.xuatkhoHistory.forEach(i=>{
            if(i.timeNumber < timeFrom){
              hangxuatkhotime1 += i.soluong
            };
            if(i.timeNumber >= timeFrom && i.timeNumber <= timeTo){
              hangxuatkhotime2 += i.soluong
            }
          });

          item.thanhlyHistory.forEach(i=>{
            if(i.timeNumber < timeFrom){
              hangthanhlytime1 += i.soluong
            };
            if(i.timeNumber >= timeFrom && i.timeNumber <= timeTo){
              hangthanhlytime2 += i.soluong
            }
          });

          item.hanghoachuyenkhodi.forEach(i=>{
            if(i.timeNumber < timeFrom){
              hangchuyenkhoditime1 += i.soluong
            };
            if(i.timeNumber >= timeFrom && i.timeNumber <= timeTo){
              hangchuyenkhoditime2 += i.soluong
            }
          });
          item.hanghoachuyenkhoden.forEach(i=>{
            if(i.timeNumber < timeFrom){
              hangchuyenkhodentime1 += i.soluong
            };
            if(i.timeNumber >= timeFrom && i.timeNumber <= timeTo){
              hangchuyenkhodentime2 += i.soluong
            }
          });

          item.hanghoathuhoi.forEach(i=>{
            if(i.timeNumber < timeFrom){
              hangthuhoitime1 += i.soluong
            };
            if(i.timeNumber >= timeFrom && i.timeNumber <= timeTo){
              hangthuhoitime2 += i.soluong
            }
          });

          item.hanghoathuhoichuyendentukhokhac.forEach(i=>{
            if(i.timeNumber < timeFrom){
              hangthuhoitime1 += i.soluong
            };
            if(i.timeNumber >= timeFrom && i.timeNumber <= timeTo){
              hangthuhoitime2 += i.soluong
            }
          });


          let tongnhap = 0;
          let tongxuat = 0;

          if(kho === ""){ // nếu giá trị query kho mà tất cả các kho thì k tính đến hangchuyenkhoden và hangchuyenkhodi time2
             tongnhap = hangnhapkhotime2 + hangthuhoitime2;
             tongxuat = hangxuatkhotime2 + hangthanhlytime2;
          }else{
             tongnhap = hangnhapkhotime2 + hangthuhoitime2 + hangchuyenkhodentime2;
             tongxuat = hangxuatkhotime2 + hangthanhlytime2 + hangchuyenkhoditime2;
          }
          let hangtonkhoTime1 = hangnhapkhotime1 + hangthuhoitime1 - hangxuatkhotime1 - hangthanhlytime1 + hangchuyenkhodentime1 - hangchuyenkhoditime1;
          // let hangtonkhoTime2 = hangtonkhoTime1 + tongnhap - tongxuat;

          data.push({
            id: item.loaihanghoa._id,
            hanghoa: item.loaihanghoa.tenloaihanghoa,
            hangtonkhoTime1,
            tongnhap,
            tongxuat,
            mark:item.mark,
            nguoncap: item.nguoncap.tennguoncap
          })
        };
        
        let hanghoaCoSeri = await HanghoaCoSeri.find({
          "trangthai.khohientaiString": { $regex: kho, $options: "$ i" },
          danhmucString: { $regex: danhmuc, $options: "$ i" },
          nguoncapString: { $regex: nguoncap, $options: "$ i" },
          loaihanghoaString: { $regex: loaihanghoa, $options: "$ i" }
        })
        .populate('loaihanghoa')
        .populate('nguoncap')

 
        for(item of hanghoaCoSeri){
          let trangthaiList = item.trangthai;
          let tonkhotime1 = 0;
          let tonkhotime2 = 0;
          let tongnhap = 0;
          let tongxuat = 0;
          //check trangj thái trước mốc chu kì và trước khi kết thúc chu kì xem hàng có ở trong kho cần xem hay k
          //filteredTrangthaiTime1 là trạng thái cuối cùng trước mốc chu kì thời gian
         
          let filteredTrangthaiTime1 = trangthaiList.filter(i=> i.timeNumber < timeFrom).sort((a,b)=> b.timeNumber - a.timeNumber)[0];
          let filteredTrangthaiTime2 = trangthaiList.filter(i=> i.timeNumber >= timeFrom && i.timeNumber <= timeTo).sort((a,b)=> b.timeNumber - a.timeNumber)[0];

          // console.log(trangthaiList.filter(i=> i.timeNumber >= timeFrom && i.timeNumber <= timeTo).find(p=>p.idTrangthai === undefined))
          if(filteredTrangthaiTime1){
            if(filteredTrangthaiTime1.status === 1 && filteredTrangthaiTime1.khohientaiString.includes(kho) || filteredTrangthaiTime1.status === 3 && filteredTrangthaiTime1.khohientaiString.includes(kho)){
              tonkhotime1 = 1
            };
          }

          if(filteredTrangthaiTime2){
            if(filteredTrangthaiTime2.status === 1 && filteredTrangthaiTime2.khohientaiString.includes(kho) || filteredTrangthaiTime2.status === 3 && filteredTrangthaiTime2.khohientaiString.includes(kho)){
              tonkhotime2 = 1
            };
          }

 
        // có các trường hợp ton đầu chu kì và cuối chu kì là các cặp giá trị (0 0) (1 1) (0 1) (1 0)
        let checknhapxuat = trangthaiList.filter(i=> i.timeNumber >= timeFrom && i.timeNumber <= timeTo).find(p=>p.idTrangthai === undefined) //check xem có nhập mới lần đầu vào kho hay k

        if(checknhapxuat === undefined && tonkhotime1 === 0 && tonkhotime2 === 0){
          tongnhap = 0;
          tongxuat = 0;
        }else if(checknhapxuat !== undefined && tonkhotime1 === 0 && tonkhotime2 === 0){
          tongnhap = 1;
          tongxuat = 1;
        };


        if(tonkhotime1 === 1 && tonkhotime2 === 1){
          tongnhap = 0;
          tongxuat = 0;
        };
        if(tonkhotime1 === 0 && tonkhotime2 === 1){
          tongnhap = 1;
          tongxuat = 0;
        };

        if(tonkhotime1 === 1 && tonkhotime2 === 0){
          tongnhap = 0;
          tongxuat = 1;
        };

        
        data.push({
          id: item.loaihanghoa._id,
          hanghoa: item.loaihanghoa.tenloaihanghoa,
          hangtonkhoTime1: tonkhotime1,
          tongnhap,
          tongxuat,
          mark:item.mark,
          nguoncap: item.nguoncap.tennguoncap
        });

      }

      let result = [];
      for(i of loaihanghoaDb){
     
        let hangtonkhoresult1 = 0;
        let tongnhapresult2 = 0;
        let tongxuatresult2 = 0;
        data.forEach(el => {
          if(i._id.toString() === el.id.toString()){
            hangtonkhoresult1 += el.hangtonkhoTime1;
            tongnhapresult2 += el.tongnhap;
            tongxuatresult2 += el.tongxuat;
          }
        });

        // console.log(hangtonkhoresult1)
        let hangtonkhoresultTime2 = hangtonkhoresult1 + tongnhapresult2 - tongxuatresult2;

        // console.log(hangtonkhoresult1)
        result.push({
          hanghoa: i.tenloaihanghoa,
          donvitinh: i.danhmuc.donvitinh,
          hangtonkhodauki: hangtonkhoresult1,
          tongnhapresult2,
          tongxuatresult2,
          hangtonkhocuoiki: hangtonkhoresultTime2
        });
      }

      let totaltonkhodauki = 0;
      let totaltonkhocuoiki = 0;
      let totalnhap = 0;
      let totalxuat = 0;

      result.forEach(i=>{
        totaltonkhodauki += i.hangtonkhodauki;
        totaltonkhocuoiki += i.hangtonkhocuoiki;
        totalnhap += i.tongnhapresult2;
        totalxuat += i.tongxuatresult2
      })
      res.send({result,totaltonkhocuoiki,totaltonkhodauki,totalnhap,totalxuat})
    } catch (error) { 
        console.log(error.message)
      }
    },

    
};

const func1 = async(time1, time2) => {
  try {
    let hangnhapkhotime1 = 0;
    let hangxuatkhotime1 = 0;
    let hangthuhoitime1 = 0;
    let hangthanhlytime1 = 0;
    
    
    let hanghoaNoneSeri = await HanghoaNoneSeri.find();
    let hanghoaCoSeri = await HanghoaCoSeri.find();
    
    for(item of hanghoaNoneSeri){
      console.log(item)
    };

    for(item of hanghoaCoSeri){

    };

    return 1
  } catch (error) {
    
  }
}
