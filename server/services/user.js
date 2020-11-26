const { User } = require('../models')
const bcrypt = require('bcrypt')
const { constants } = require('../configs')
const authService = require('./auth')
const randToken = require('rand-token')

const { verify } = require('jsonwebtoken')

const getListUser = async (id) => {
    return User.findAll()
}

const signup = async (data) => {
    let { email, password } = data
    email = email.toLowerCase().trim()
    password = password.trim()
    const user = await User.findOne({ where: { email } })
    if (!user) {
        throw new Error('Tên tài khoản đã tồn tại.')
    }
    const hash_password = bcrypt.hashSync(password, 8);
    const dataCreated = { email, hash_password }
    const userCreated = await User.create(dataCreated)
    if (!userCreated) {
        throw new Error('Loi !')
    }

    return userCreated
}

const signin = async (data) => {
    let { email, password } = data
    email = email.toLowerCase().trim()
    password = password.trim()
    const user = await User.findOne({ where: { email } })
    if (!user) {
        throw new Error('Loi dang nhap')
    }
    const isPasswordValid = bcrypt.compareSync(password, user.hash_password);
    if (!isPasswordValid) {
        throw new Error('Mật khẩu không chính xác.');
    }

    const accessTokenLife = constants.ACCESS_TOKEN_LIFE;
    const accessTokenSecret = constants.ACCESS_TOKEN_SECRET;

    const dataForAccessToken = {
        id: user.id,
        email: user.username,
    }
    const accessToken = await authService.generateToken(
        dataForAccessToken,
        accessTokenSecret,
        accessTokenLife,
    )
    if (!accessToken) {
        return res
            .status(401)
            .send('Đăng nhập không thành công, vui lòng thử lại.');
    }

    let refreshToken = randToken.generate(64); // tạo 1 refresh token ngẫu nhiên
    if (!user.refresh_token) {
        // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
        await user.update({ refresh_token: refreshToken })
    } else {
        // Nếu user này đã có refresh token thì lấy refresh token đó từ database
        refreshToken = user.refresh_token;
    }

    return {
        accessToken,
        user
    }
}

const refreshToken = async (token, refreshToken) => {

    const accessTokenLife = constants.ACCESS_TOKEN_LIFE;
    const accessTokenSecret = constants.ACCESS_TOKEN_SECRET;

    // Decode access token đó
    const decoded = await authService.decodeToken(
        token,
        accessTokenSecret,
    );
    if (!decoded) {
        throw new Error('Access token không hợp lệ.')
    }

    const email = decoded.payload.email; // Lấy username từ payload

    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('User không tồn tại.');
    }

    if (refreshToken !== user.refresh_token) {
        throw new Error('Refresh token không hợp lệ.');
    }

    // Tạo access token mới
    const dataForAccessToken = {
        id: user.id,
        email
    }

    const accessToken = await authService.generateToken(
        dataForAccessToken,
        accessTokenSecret,
        accessTokenLife,
    );
    if (!accessToken) {
        throw new Error('Tạo access token không thành công, vui lòng thử lại.');
    }
    return { accessToken }
}

const logout = async (data) => {
    const user = await User.findOne({ email: data.email })
    if (!user) {
        throw new Error('khong tim thay user')
    }
    user.refresh_token = null
    await user.save()
    return { data: 'success' }
}

const getUser = async (email) => {
    return User.findOne({ email })
}

const me = async (token, refreshToken) => {
    const accessTokenLife = constants.ACCESS_TOKEN_LIFE;
    const accessTokenSecret = constants.ACCESS_TOKEN_SECRET;

    // Decode access token đó
    const verify = await authService.verifyToken(
        token,
        accessTokenSecret,
    );
    let payload
    if (!verify) {
        // Decode access token đó
        const decoded = await authService.decodeToken(
            token,
            accessTokenSecret,
        );
        if (!decoded) {
            throw new Error('Access token không hợp lệ.')
        }
        payload = decoded.payload
    } else {
        payload = verify.payload
    }
    const email = payload.email; // Lấy username từ payload
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('User không tồn tại.');
    }

    if (refreshToken !== user.refresh_token) {
        throw new Error('Refresh token không hợp lệ.');
    }
    let accessToken = token
    if (!verify) {
        // Tạo access token mới
        const dataForAccessToken = {
            id: user.id,
            email
        }

        accessToken = await authService.generateToken(
            dataForAccessToken,
            accessTokenSecret,
            accessTokenLife,
        );
        if (!accessToken) {
            throw new Error('Tạo access token không thành công, vui lòng thử lại.');
        }
    }
    return { accessToken, user }
}

module.exports = {
    getListUser,
    signup,
    signin,
    refreshToken,
    getUser,
    logout,
    me
}