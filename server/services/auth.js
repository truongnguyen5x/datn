
const jwt = require('jsonwebtoken');

const generateToken = async (payload, secretSignature, tokenLife) => {
    return jwt.sign({ payload, }, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
}

const decodeToken = async (token, secretKey) => {
	try {
		return jwt.verify(token, secretKey, {
			ignoreExpiration: true,algorithm: 'HS256'
		});
	} catch (error) {
        console.log(error)
		return null;
	}
}

const verifyToken = async (token, secretKey) => {
	try {
		return jwt.verify(token, secretKey);
	} catch (error) {
		console.log(`Error in verify access token:  + ${error}`);
		return null;
	}
}

module.exports = {
    generateToken,
    decodeToken,
    verifyToken
}