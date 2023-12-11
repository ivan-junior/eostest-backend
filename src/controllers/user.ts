import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils'
import sendEmail from '../sendEmail'

export const createUser = async (req: Request, res: Response) => {
	try {
		const prisma = new PrismaClient()
		const schema = z.object({
			name: z.string(),
			email: z.string().email(),
			password: z.string(),
			profile: z.string()
		})
		const { name, email, password, profile } = schema.parse(req.body)

		const isUserRegistered = await prisma.user.findUnique({
			where: {
				email
			}
		})

		if (isUserRegistered) {
			return res.status(400).json({ error: 'Já existe um usuário cadastrado com este endereço de email' })
		}

		const hash = await bcrypt.hash(password, 10)

		const createdUser = await prisma.user.create({
			data: {
				name,
				email,
				password: hash,
				profile
			}
		})

		sendEmail({
			to: 'cd907c7bb9-2b9ce6@inbox.mailtrap.io', //email fixo apenas para fins de testes
			subject: 'Bem-vindo ao nosso magnífico teste',
			htmlBody: `<p>Olá, ${name}</p><p>Vi que criou um usuário em nosso site. Muito obrigado! Não esqueça de acessar o feed de postagens!</p><p>Atenciosamente,<br />Ivan.</p>`
		})

		return res.status(201).json({ success: true, ...createdUser })
	} catch (error) {
		console.error(error)
		return res.status(400).json({ error: 'Não possível criar o usuário. Por favor, tente novamente mais tarde' })
	}
}

export const getUsers = async (req: Request, res: Response) => {
	try {
		const prisma = new PrismaClient()
		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				profile: true,
				createdAt: true,
				updatedAt: true
			}
		})
		return res.status(200).json(users)
	} catch (error) {
		console.error(error)
		return res.status(400).json({ error: 'Não possível buscar os usuários. Por favor, tente novamente mais tarde' })
	}
}

export const getUserById = async (req: Request, res: Response) => {
	try {
		const prisma = new PrismaClient()
		const user = await prisma.user.findUnique({
			select: {
				id: true,
				name: true,
				email: true,
				profile: true,
				createdAt: true,
				updatedAt: true
			},
			where: {
				id: req.params.id
			}
		})

		if (!user) {
			return res.status(404).json({ error: 'Nenhum usuário encontrado' })
		}
		return res.status(200).json(user)
	} catch (error) {
		console.error(error)
		return res.status(400).json({ error: 'Não possível buscar os usuários. Por favor, tente novamente mais tarde' })
	}
}

export const updateUser = async (req: Request, res: Response) => {
	try {
		if (req.userId != req.params.id) {
			//se chegarmos aqui, é pq o usuário que está editando não é o usuário autenticado, então precisamos verificar se é admin
			//se não for admin, não pode continuar
			if (req.profile != 'admin') {
				return res.status(404).json({ error: 'Usuário não possui permissão de acesso a edição de outros usuários' })
			}
		}
		const prisma = new PrismaClient()
		const schema = z.object({
			name: z.string(),
			email: z.string().email(),
			profile: z.string(),
			password: z.string().optional()
		})
		const data = schema.parse(req.body)
		const dataToUpdate: { name: string; email: string; profile: string; password?: string } = {
			name: data.name,
			email: data.email,
			profile: data.profile
		}
		if (data.password) {
			const hash = await bcrypt.hash(data.password, 10)
			dataToUpdate.password = hash
		}

		const user = await prisma.user.update({
			where: {
				id: req.params.id
			},
			data: dataToUpdate,
			select: {
				id: true,
				name: true,
				email: true,
				profile: true,
				createdAt: true,
				updatedAt: true
			}
		})

		if (!user) {
			return res.status(404).json({ error: 'Não foi possível editar o usuário' })
		}

		return res.status(200).json(user)
	} catch (error) {
		console.error(error)
		return res.status(400).json({ error: 'Não possível buscar os usuários. Por favor, tente novamente mais tarde' })
	}
}

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const prisma = new PrismaClient()
		await prisma.user.delete({
			where: {
				id: req.params.id
			}
		})
		return res.status(200).json({ success: true })
	} catch (error) {
		console.error(error)
		return res.status(400).json({ error: 'Não possível buscar os usuários. Por favor, tente novamente mais tarde' })
	}
}

export const authenticate = async (req: Request, res: Response) => {
	try {
		const prisma = new PrismaClient()
		const schema = z.object({
			email: z.string().email(),
			password: z.string()
		})
		const { email, password } = schema.parse(req.body)

		const user = await prisma.user.findUnique({
			where: {
				email
			}
		})

		if (!user) {
			return res.status(404).send({ error: 'Usuário não encontrado' })
		}

		if (!(await bcrypt.compare(password, user.password))) {
			return res.status(400).send({ error: 'Senha inválida' })
		}

		return res.status(201).send({
			user: {
				id: user.id,
				name: user.name,
				profile: user.profile,
				email: user.email,
				createdAt: user.createdAt
			},
			token: generateToken({ userId: user.id, profile: user.profile })
		})
	} catch (error) {
		console.error(error)
		return res.status(400).send({ error: 'Falha ao autenticar' })
	}
}
