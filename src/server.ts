import express, { Request, Response } from 'express'

const app = express()

app.get('/', (req: Request, res: Response) => {
    res.json({ hello: 'world' })
})

app.listen(process.env.PORT || 3333, () => {
    console.log(`Server listening`)
})