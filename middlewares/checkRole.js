let User = require('../models/user');


let checkRole = (req, res, next) => {
    let role = req.user.role;
    if (role == "user") {
        req.flash('mess', 'Tài khoản của bạn không có quyền truy nhập trang này.')
        res.redirect('/quan-tri/login')
        return;
    }
    next()
}
module.exports = checkRole;