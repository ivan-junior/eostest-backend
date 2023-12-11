import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

const app = express()
app.use(morgan('dev'))

app.use(cors())
app.options('*', cors())
app.use(express.json())
app.use(bodyParser.json())
app.use('/public', express.static('./public'))

export default app
