let jwt = require('jsonwebtoken');
const User = require('../models/user');

let checkToken = (req, res, next) => {
    // let id_user = req.params.id;
    let tokenFromClient = req.cookies.khoPH10; //kiểm tra xem có token gửi lên hay k
    try {
        if (!tokenFromClient) {
            req.flash('mess', "Token không tồn tại, vui lòng đăng nhập");
            res.redirect('/quan-tri/login')
            return;
        } else {
            jwt.verify(tokenFromClient, 'vuvantinh', async function(err, data) {
                // console.log(data)
                if (err) {
                    req.flash('mess', "Token không hợp lệ 2, vui lòng đăng nhập");
                    res.redirect('/quan-tri/login')
                    return;
                } else {
                    try {
                        let user = await User.findOne({tentaikhoan: data.tentaikhoan});
                        // console.log(user)
                        // console.log(id_user)
                        if(!user){
                            req.flash('mess', "Tài khoản không tồn tại, vui lòng đăng nhập");
                            res.redirect('/quan-tri/login')
                            return;
                        };
    
                        // if(id_user !=  data._id){
                        //     req.flash('mess', "Token không hợp lệ3, vui lòng đăng nhập");
                        //     res.redirect('/quan-tri/login')
                        //     return;
                        // };
    
                        req.user = user; // gắn vào req data dữ liệu token sau khi giải mã
                        next();
                    } catch (error) {
                        
                    }
                }
            })
        }
    } catch {
        req.flash('mess', "Token không tồn tại, vui lòng đăng nhập");
        res.redirect('/quan-tri/login')
        return;
    }
}
module.exports = checkToken;