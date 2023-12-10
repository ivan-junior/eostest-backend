import {
	createPost,
	deletePost,
	editPost,
	getPostById,
	getPosts,
	updateDislikeCountOnPost,
	updateLikeCountOnPost
} from '../controllers/post'
import app from '../express'
import fileHandler from '../multer'
import { validateToken } from '../utils'

app.post('/v1/post/add', validateToken, fileHandler('./public/posts/').single('thumbnail'), createPost)

app.put('/v1/post/edit/:id', validateToken, editPost)

app.get('/v1/post/one/:id', validateToken, getPostById)

app.delete('/v1/post/delete/:id', validateToken, deletePost)

app.patch('/v1/post/metadata/:id/like', validateToken, updateLikeCountOnPost)

app.patch('/v1/post/metadata/:id/dislike', validateToken, updateDislikeCountOnPost)

app.get('/v1/post/all', validateToken, getPosts)
