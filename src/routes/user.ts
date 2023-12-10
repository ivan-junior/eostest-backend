import app from '../express'
import { authenticate, createUser, deleteUser, getUserById, getUsers, updateUser } from '../controllers/user'
import { adminOnly, validateToken } from '../utils'

app.post('/v1/user/authenticate', authenticate)

app.post('/v1/user/add', createUser)

app.get('/v1/user/one/:id', validateToken, getUserById)

app.put('/v1/user/edit/:id', validateToken, updateUser)

//apenas usuários com perfil admin podem ver ou deletar outros usuários
app.get('/v1/user/all', validateToken, adminOnly, getUsers)

app.delete('/v1/user/delete/:id', validateToken, adminOnly, deleteUser)
