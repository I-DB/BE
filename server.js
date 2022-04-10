const app = require('./app')
const fs = require('fs')
const http = require('http')
const https = require('https')
require('dotenv').config()
const domain = process.env.DOMAIN
let httpsServer
// const dev = process.env.DEV

// if (dev === true) {
// 	const port = 3000

// 	const handleListening = () =>
// 		console.log(`Listening on : http://localhost:${port}`)

// 	app.listen(port, handleListening())
// } else if (dev === false) {
// 	const port = 443
// 	const privateKey = fs.readFileSync(
// 		`/etc/letsencrypt/live/${domain}/privkey.pem`,
// 		'utf8'
// 	)
// 	const certificate = fs.readFileSync(
// 		`/etc/letsencrypt/live/${domain}/cert.pem`,
// 		'utf8'
// 	)
// 	const ca = fs.readFileSync(
// 		`/etc/letsencrypt/live/${domain}/chain.pem`,
// 		'utf8'
// 	)

// 	const credentials = {
// 		key: privateKey,
// 		cert: certificate,
// 		ca: ca,
// 	}

// 	const httpsServer = https.createServer(credentials, app)
// 	httpsServer.listen(port, () => {
// 		console.log('HTTPS Server running on port 443')
// 	})
// }

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

httpServer.listen(80, () => {
	console.log(`Listening on : http://localhost:80`)
	console.log('HTTPS Server running on port 80')
})

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443')
})
