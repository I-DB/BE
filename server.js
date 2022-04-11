const app = require('./app')
const fs = require('fs')
const http = require('http')
const https = require('https')
require('dotenv').config()
const domain = process.env.DOMAIN
let httpsServer

if (process.env.DEV) {
	const privateKey = fs.readFileSync(
		`/etc/letsencrypt/live/${domain}/privkey.pem`,
		'utf8'
	)
	const certificate = fs.readFileSync(
		`/etc/letsencrypt/live/${domain}/cert.pem`,
		'utf8'
	)
	const ca = fs.readFileSync(
		`/etc/letsencrypt/live/${domain}/chain.pem`,
		'utf8'
	)

	const credentials = {
		key: privateKey,
		cert: certificate,
		ca: ca,
	}
	httpsServer = https.createServer(credentials, app)
} else {
	httpsServer = https.createServer(app)
}

const httpServer = http.createServer(app)

httpServer.listen(3000, () => {
	console.log(`Listening on : http://localhost:3000`)
	console.log('HTTPS Server running on port 3000')
})

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443')
})
