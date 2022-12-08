var express = require('express');
var router = express.Router();
const multer = require('multer');
let checkToken = require('../middlewares/checkToken');
let checkRole = require('../middlewares/checkRole');
var path =require('path')


const main = require('../controllers/main');
const { getNguoncap, getKhoPage } = require('../controllers/main');
//login logout
router.get('/login', main.loginPage);
router.post('/login', main.login);
router.get('/logout', main.logout);
router.get('/doi-mat-khau', main.doimatkhauPage);
router.post('/doi-mat-khau', main.doimatkhau);

router.get('/:id/don-vi', checkToken, checkRole,  main.donviPage)
router.post('/:id/don-vi/add', checkToken, checkRole,  main.addDonvi)
router.get('/:id/don-vi/fetch', checkToken, checkRole,  main.fetchedDonvi)
router.put('/:id/don-vi/:id1', checkToken,  checkRole, main.editDonvi)
router.delete('/:id/don-vi/:id1', checkToken,  checkRole, main.deleteDonvi)


router.get('/:id/tai-khoan',checkToken, checkRole, main.getTaikhoanPage );
router.post('/:id/tai-khoan/add', checkToken, checkRole,  main.addTaikhoan);
router.get('/:id/tai-khoan/fetch', checkToken, checkRole,  main.fetchedTaikhoan);
router.delete('/:id/tai-khoan/:id1', checkToken, checkRole,  main.deleteTaikhoan);
router.put('/:id/tai-khoan/:id1', checkToken, checkRole,  main.editTaikhoan);


router.get('/:id/don-vi-truc-thuoc',checkToken, checkRole, main.getDonvitructhuocPage);
router.post('/:id/don-vi-truc-thuoc/:id1/add', checkToken, checkRole,  main.addDonvitructhuoc)
router.get('/:id/don-vi-truc-thuoc/:id1/fetch', checkToken,  main.fetchDonvitructhuoc)
router.put('/:id/don-vi-truc-thuoc/:id1/:id2', checkToken,  checkRole, main.editDonvitructhuoc)
router.delete('/:id/don-vi-truc-thuoc/:id1/:id2', checkToken,  checkRole, main.deleteDonvitructhuoc)


router.get('/:id/nguon-cap', checkToken, checkRole, main.getNguoncapPage)
router.post('/:id/nguon-cap/add', checkToken, checkRole,  main.addNguoncap)
router.get('/:id/nguon-cap/fetch', checkToken, checkRole,  main.fetchedNguoncap)
router.put('/:id/nguon-cap/:id1', checkToken,  checkRole, main.editNguoncap)
router.delete('/:id/nguon-cap/:id1', checkToken,  checkRole, main.deleteNguoncap)

router.get('/:id/kho', checkToken, checkRole, main.getKhoPage)
router.post('/:id/kho/add', checkToken, checkRole,  main.addKho)
router.get('/:id/kho/fetch', checkToken, checkRole,  main.fetchedKho)
router.put('/:id/kho/:id1', checkToken,  checkRole, main.editKho)
router.delete('/:id/kho/:id1', checkToken,  checkRole, main.deleteKho)

router.get('/:id/danh-muc', checkToken, checkRole, main.danhmucPage)
router.post('/:id/danh-muc/add', checkToken, checkRole,  main.addDanhmuc)
router.get('/:id/danh-muc/fetch', checkToken, checkRole,  main.fetchedDanhmuc)
router.put('/:id/danh-muc/:id1', checkToken,  checkRole, main.editDanhmuc)
router.delete('/:id/danh-muc/:id1', checkToken,  checkRole, main.deleteDanhmuc)

router.get('/:id/loai-hang-hoa', checkToken, checkRole, main.getLoaihanghoaPage)
router.post('/:id/loai-hang-hoa/add', checkToken, checkRole,  main.addLoaihanghoa)
router.get('/:id/loai-hang-hoa/fetch', checkToken, checkRole,  main.fetchedLoaihanghoa)
router.put('/:id/loai-hang-hoa/:id1', checkToken,  checkRole, main.editLoaihanghoa)
router.delete('/:id/loai-hang-hoa/:id1', checkToken,  checkRole, main.deleteLoaihanghoa)

// router.get('/:id/danh-muc-hang-trong-kho', checkToken, checkRole, main.getDanhmuctrongkhoPage)
// router.post('/:id/loai-hang-hoa-trong-kho/:id_kho/save', checkToken, checkRole, main.saveLoaihanghoaTrongkho)

router.get('/:id/nhap-kho', checkToken, checkRole, main.getNhapkhoPage)
router.post('/:id/nhap-kho/add', checkToken, checkRole, main.importKho)

router.get('/:id/lich-su-nhap-kho', checkToken, checkRole, main.nhatkyNhapkhoPage)
router.get('/:id/lich-su-nhap-kho/search', checkToken, checkRole, main.fetchedNhatkyNhapkho)
router.delete('/:id/lich-su-nhap-kho/:id1', checkToken, checkRole, main.deleteLichsuNhapkho)
router.get('/:id/chinh-sua-lich-su-nhap-kho/:id1', checkToken, checkRole, main.getChinhsuaNhapkhoPage)
router.put('/:id/chinh-sua-lich-su-nhap-kho/:id1/edit', checkToken, checkRole, main.chinhsuaNhapkho)


router.get('/:id/chuyen-kho', checkToken, checkRole, main.getChuyenkhoPage)
router.post('/:id/chuyen-kho', checkToken, checkRole, main.postChuyenkho)
router.get('/:id/chuyen-kho/lay-thong-tin', checkToken, checkRole, main.getHangtrongkhoChuyendi)
router.get('/:id/lich-su-chuyen-kho', checkToken, checkRole, main.nhatkyChuyenkhoPage)
router.get('/:id/lich-su-chuyen-kho/search', checkToken, checkRole, main.fetchedNhatkyChuyenkho)
router.get('/:id/chuyen-kho/chi-tiet/:id1', checkToken, checkRole, main.chitietChuyenkho)
router.delete('/:id/lich-su-chuyen-kho/:id1', checkToken, checkRole, main.deleteLichsuChuyenkho)

router.get('/:id/chinh-sua-chuyen-kho/:id1', checkToken, checkRole, main.chinhsuaChuyenkho)
router.put('/:id/chinh-sua-chuyen-kho/:id1', checkToken, checkRole, main.postChinhsuaChuyenkho)


router.get('/:id/xuat-kho', checkToken, checkRole, main.getXuatkhoPage)
router.post('/:id/xuat-kho', checkToken, checkRole, main.postXuatkho)

router.get('/:id/lich-su-xuat-kho', checkToken, checkRole, main.xuatkhoHistoryPage)
router.get('/:id/lich-su-xuat-kho/search', checkToken, checkRole, main.fetchedNhatkyXuatkho)
router.get('/:id/xuat-kho/chi-tiet/:id1', checkToken, checkRole, main.chitietXuatkho)
router.delete('/:id/lich-su-xuat-kho/:id1', checkToken, checkRole, main.deleteLichsuXuatkho)
router.get('/:id/chinh-sua-xuat-kho/:id1', checkToken, checkRole, main.chinhsuaXuatkhoPage)
router.put('/:id/chinh-sua-xuat-kho/:id1', checkToken, checkRole, main.postChinhsuaXuatkho)

router.get('/:id/thanh-ly', checkToken, checkRole, main.thanhlyPage)
router.post('/:id/thanh-ly', checkToken, checkRole, main.postThanhly)

router.get('/:id/lich-su-thanh-ly', checkToken, checkRole, main.thanhlyHistoryPage)
router.get('/:id/lich-su-thanh-ly/search', checkToken, checkRole, main.fetchedNhatkyThanhly)
router.delete('/:id/lich-su-thanh-ly/:id1', checkToken, checkRole, main.deleteLichsuThanhly)
router.get('/:id/thanh-ly/chi-tiet/:id1', checkToken, checkRole, main.chitietThanhly)
router.get('/:id/chinh-sua-thanh-ly/:id1', checkToken, checkRole, main.chinhsuaThanhlyPage)
router.put('/:id/chinh-sua-thanh-ly/:id1', checkToken, checkRole, main.postChinhsuaThanhly)


router.get('/:id/thu-hoi', checkToken, checkRole, main.getThuhoiPage)
router.post('/:id/thu-hoi', checkToken, checkRole, main.postThuhoi)
router.get('/ten-loai-hang-hoa/:id1/fetch', checkToken,  main.fetchedLoaihangOfDanhmuc)
router.get('/:id/thu-hoi/hang-da-ban-giao', checkToken, checkRole, main.getThongtinHangBangiao)


router.get('/:id/lich-su-thu-hoi', checkToken, checkRole, main.thuhoiHistoryPage)
router.get('/:id/lich-su-thu-hoi/search', checkToken, checkRole, main.fetchedNhatkyThuhoi)
router.delete('/:id/lich-su-thu-hoi/:id1', checkToken, checkRole, main.deleteLichsuThuhoi)
router.get('/:id/thu-hoi/chi-tiet/:id1', checkToken, checkRole, main.chitietThuhoi)
router.get('/:id/chinh-sua-thu-hoi/:id1', checkToken, checkRole, main.chinhsuaThuhoiPage)
router.put('/:id/chinh-sua-thu-hoi/:id1', checkToken, checkRole, main.postChinhsuaThuhoi)

//sửa tiếp
router.get('/:id/chuyen-kho/list-kho-chuyen-den', checkToken, main.getKhochuyenden)

module.exports = router;