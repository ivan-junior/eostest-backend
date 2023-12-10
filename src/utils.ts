import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import authConfig from './auth.json'

export function validateToken(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization

	if (!authHeader) {
		return res.status(401).send({ error: 'Token não informado' })
	}

	const parts = authHeader ? authHeader.split(' ') : ''
	if (parts.length != 2) {
		return res.status(401).send({ error: 'Erro no token' })
	}

	const [scheme, token] = parts
	if (!/^Bearer$/i.test(scheme)) {
		return res.status(401).send({ error: 'Token mal formatado' })
	}

	jwt.verify(token, authConfig.secret, (err, decoded: Record<string, string>) => {
		if (err) {
			return res.status(401).send({ error: 'Token inválido' })
		}
		if (decoded) {
			req.userId = decoded.userId
			req.profile = decoded.profile
			return next()
		} else {
			return res.status(401).send({ error: 'Não foi possível verificar o token' })
		}
	})
}

export function generateToken(params = {}) {
	return jwt.sign(params, authConfig.secret, {
		expiresIn: 86400
	})
}

export function adminOnly(req: Request, res: Response, next: NextFunction) {
	if (req.profile === 'admin') {
		next()
	} else {
		return res.status(401).send({ error: 'Usuário não possui permissão de acesso' })
	}
}

export function removeAccents(s: string) {
	return s.normalize('NFD').replace(/[\u0300-\u036f|\u00b4|\u0060|\u005e|\u007e]/g, '')
}
