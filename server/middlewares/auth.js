const { constants } = require('../configs')
const { authService, userService } = require('../services')


const checkRole = (...roles) => async (req, res, next) => {
    try {
        const accessTokenFromHeader = req.header('Authorization').replace('Bearer ', '');
        if (!accessTokenFromHeader) {
            return res.status(401).send('Không tìm thấy access token!');
        }
        const accessTokenSecret = constants.ACCESS_TOKEN_SECRET;

        const verified = await authService.verifyToken(
            accessTokenFromHeader,
            accessTokenSecret,
        );
        if (!verified) {
            return res
                .status(401)
                .send('Bạn không có quyền truy cập vào tính năng này!');
        }
        const user = await userService.getUser(verified.payload.email);
        if (!roles.includes(user.role)) {
            return res.status(401).send('Bạn không có quyền truy cập vào tính năng này!')
        }
        req.user = user;
        return next();
    } catch (error) {
        res.status(401).send('Bạn không có quyền truy cập vào tính năng này!')
    }
}


module.exports = {
    checkRole
}