var express = require('express');
var router = express.Router();
const multer = require('multer');
let checkToken = require('../middlewares/checkToken');
let checkRole = require('../middlewares/checkRole');
var path =require('path')


const client = require('../controllers/client');

router.get('/trangchu',checkToken, client.trangchu)
router.get('/danh-muc-hang-hoa',checkToken, client.danhmucPage)
router.get('/loai-hang-hoa',checkToken, client.loaihanghoaPage)
router.get('/kho/:id1',checkToken, client.chitietkhoPage)
router.get('/lich-su-nhap-kho',checkToken, client.lichsunhapkhoPage)
router.get('/lich-su-nhap-kho/search',checkToken, client.searchLichsunhapkho)
router.get('/lich-su-nhap-kho/chi-tiet/:id1',checkToken, client.chitietLichsunhapkho)

router.get('/lich-su-xuat-kho',checkToken, client.lichsuxuatkhoPage)
router.get('/lich-su-xuat-kho/search',checkToken, client.searchLichsuxuatkho)
router.get('/don-vi-truc-thuoc/:id1/fetch',checkToken, client.fetchedDonvitructhuoc)
router.get('/lich-su-xuat-kho/chi-tiet/:id1',checkToken, client.chitietLichsuxuatkho)

router.get('/lich-su-chuyen-kho',checkToken, client.lichsuchuyenkhoPage)
router.get('/lich-su-chuyen-kho/search',checkToken, client.searchLichsuchuyenkho)
router.get('/lich-su-chuyen-kho/chi-tiet/:id1',checkToken, client.chitietLichsuchuyenkho)

router.get('/lich-su-thanh-ly',checkToken, client.lichsuthanhlyPage)
router.get('/lich-su-thanh-ly/search',checkToken, client.searchLichsuthanhly)
router.get('/lich-su-thanh-ly/chi-tiet/:id1',checkToken, client.chitietLichsuthanhly)

router.get('/lich-su-thu-hoi',checkToken, client.lichsuthuhoiPage)
router.get('/lich-su-thu-hoi/search',checkToken, client.searchLichsuthuhoi)
router.get('/lich-su-thu-hoi/chi-tiet/:id1',checkToken, client.chitietLichsuthuhoi)


router.get('/thong-ke-hang-trong-kho',checkToken, client.thongkeHangtrongkhoPage)
router.get('/thong-ke-hang-trong-kho/search',checkToken, client.searchThongkeHangtrongkho)


router.get('/thong-ke-hang-nhap-kho',checkToken, client.thongkeHangnhapkhoPage)
router.get('/thong-ke-hang-nhap-kho/search',checkToken, client.searchThongkeHangnhapkho)

router.get('/thong-ke-hang-xuat-kho',checkToken, client.thongkeHangxuatkhoPage)
router.get('/thong-ke-hang-xuat-kho/search',checkToken, client.searchThongkeHangxuatkho)

router.get('/thong-ke-hang-thu-hoi',checkToken, client.thongkeHangthuhoiPage)
router.get('/thong-ke-hang-thu-hoi/search',checkToken, client.searchThongkeHangthuhoi)

router.get('/thong-ke-hang-thanh-ly',checkToken, client.thongkeHangthanhlyPage)
router.get('/thong-ke-hang-thanh-ly/search',checkToken, client.searchThongkeHangthanhly)

router.get('/tra-cuu-hang-hoa',checkToken, client.tracuuHanghoaPage)
router.get('/tra-cuu-hang-hoa/search',checkToken, client.searchTracuuHanghoa)


router.get('/tra-cuu-hang-hoa/chi-tiet/:id1',checkToken, client.lichsuTrangthaiHanghoa)
// router.get('/thong-ke-tong-hop',checkToken, client.thongketonghopPage)
// router.get('/thong-ke-tong-hop/search',checkToken, client.searchThongketonghop)
router.get('/thong-ke-tong-hop',checkToken, client.thongketonghopPage2)
router.get('/thong-ke-tong-hop/search',checkToken, client.searchThongketonghop2)
module.exports = router;