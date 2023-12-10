import { createCommentary, deleteCommentary, editCommentary } from '../controllers/comments'
import app from '../express'
import { validateToken } from '../utils'

app.post('/v1/comments/:postId/add', validateToken, createCommentary)

app.put('/v1/comments/edit/:commentaryId', validateToken, editCommentary)

app.delete('/v1/comments/delete/:commentaryId', validateToken, deleteCommentary)
