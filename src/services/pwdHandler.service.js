const bcrypt = require("bcrypt");

const hashPwd = async (password) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPwd = await bcrypt.hash(password, salt);
		return hashedPwd;
	} catch (error) {
		console.log(error);
	}
};

const comparePwd = (password, encryptedPwd) => {
	try {
		return bcrypt.compare(password, encryptedPwd);
	} catch (error) {
		console.log(error);
	}
};

module.exports = { hashPwd, comparePwd };
