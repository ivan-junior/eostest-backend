import { Request, Response } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

export const createCommentary = async (req: Request, res: Response) => {
	try {
		const prisma = new PrismaClient()
		const postId = req.params.postId
		const userId = req.userId
		const schema = z.object({
			description: z.string()
		})

		const { description } = schema.parse(req.body)

		const commentary = await prisma.commentary.create({
			data: {
				description,
				userId,
				postId
			}
		})
		return res.status(201).json(commentary)
	} catch (error) {
		console.error(error)
		return res
			.status(400)
			.json({ error: 'Não foi possível criar um novo comentário. Por favor, tente novamente mais tarde!' })
	}
}

export const editCommentary = async (req: Request, res: Response) => {
	try {
		const userId = req.userId
		const { commentaryId } = req.params
		const prisma = new PrismaClient()

		const originalCommentary = await prisma.commentary.findUnique({
			where: {
				id: commentaryId
			}
		})

		if (originalCommentary.userId != userId) {
			return res.status(400).json({ error: 'Apenas o proprietário do comentário pode editar o comentário' })
		}

		const schema = z.object({
			description: z.string()
		})
		const { description } = schema.parse(req.body)
		const commentaryEdited = await prisma.commentary.update({
			where: {
				id: commentaryId
			},
			data: {
				description
			}
		})

		await prisma.commentaryHistory.create({
			data: {
				description: originalCommentary.description,
				commentaryId: commentaryId
			}
		})

		if (!commentaryEdited) {
			return res.status(400).json({ error: 'Não foi possível editar o comentário' })
		}
		return res.status(200).json(commentaryEdited)
	} catch (error) {
		console.error(error)
		return res.status(400).json({ error: 'Não possível editar o comentário. Por favor, tente novamente mais tarde' })
	}
}

export const deleteCommentary = async (req: Request, res: Response) => {
	try {
		const prisma = new PrismaClient()
		const commentaryId = req.params.commentaryId
		const loggedUserId = req.userId

		const commentary = await prisma.commentary.findUnique({
			where: {
				id: commentaryId
			},
			include: {
				post: true
			}
		})

		//precisamos verificar se o usuário que está apagando o comentário também é o dono da postagem
		if (commentary.userId != loggedUserId && commentary.post.userId != loggedUserId) {
			return res
				.status(400)
				.json({ error: 'Apenas o proprietário da postagem e o dono do comentário podem excluir a comentário' })
		}
		await prisma.commentary.delete({
			where: {
				id: commentaryId
			}
		})
		await prisma.commentaryHistory.deleteMany({
			where: {
				commentaryId
			}
		})
		return res.status(200).json({ success: true })
	} catch (error) {
		console.error(error)
		return res.status(400).json({ error: 'Não possível remover o comentário. Por favor, tente novamente mais tarde' })
	}
}
