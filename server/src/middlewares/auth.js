const jwt = require("jsonwebtoken");
const keys = require('../config/keys')

module.exports = function (req, res, next) {
	// Obtem o token do cabeçalho
	const token = req.header('x-auth-token')

	// Verifica se não existe um token
	if (!token) {
		res.status(401).send({ msg: "Token não fornecido, acesso negado." })
	}

	// Verifica o token
	try {
		const decoded = jwt.verify(token, keys.jwtSecret)

		req.user = decoded.user
		next()
	} catch (err) {
		res.status(401).send({ msg: "Token inválido" })
	}
}