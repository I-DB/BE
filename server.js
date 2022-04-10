const app = require('./app')
const fs = require('fs')
const https = require('https')
const domain = process.env.DOMAIN
const dev = process.env.DEV

if (dev === true) {
	const port = 3000

	const handleListening = () =>
		console.log(`Listening on : http://localhost:${port}`)

	app.listen(port, handleListening())
} else {
	const port = 443
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

	const httpsServer = https.createServer(credentials, app)
	httpsServer.listen(port, () => {
		console.log('HTTPS Server running on port 443')
	})
}
