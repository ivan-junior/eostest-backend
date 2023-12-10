import './routes'
import app from './express'

app.listen(process.env.PORT || 3333, () => {
	console.log(`Server listening`)
})
