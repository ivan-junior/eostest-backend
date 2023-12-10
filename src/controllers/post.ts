import { Request, Response } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

export const createPost = async (req: Request, res: Response) => {
	try {
		const prisma = new PrismaClient()
		const schema = z.object({
			title: z.string(),
			description: z.string()
		})

		const { title, description } = schema.parse(req.body)

		const post = await prisma.post.create({
			data: {
				title,
				description,
				thumbnailUrl: `${process.env.URL}/public/posts/${req.file?.filename}`,
				userId: req.userId
			}
		})
		const postMetadata = await prisma.postMetadata.create({
			data: {
				postId: post.id
			}
		})
		return res.status(201).json({ ...post, ...postMetadata })
	} catch (error) {
		console.error(error)
		return res
			.status(400)
			.json({ error: 'Não foi possível criar um novo post. Por favor, tente novamente mais tarde!' })
	}
}

export const editPost = async (req: Request, res: Response) => {
	try {
		const userId = req.userId
		const postId = req.params.id
		const prisma = new PrismaClient()

		const originalPost = await prisma.post.findUnique({
			where: {
				id: postId
			}
		})

		if (originalPost.userId != userId) {
			return res.status(400).json({ error: 'Apenas o proprietário da postagem pode editar ou excluir as postagens' })
		}

		const schema = z.object({
			title: z.string(),
			description: z.string()
		})
		const { title, description } = schema.parse(req.body)
		const postEdited = await prisma.post.update({
			where: {
				id: postId
			},
			data: {
				title,
				description
			}
		})

		await prisma.postHistory.create({
			data: {
				title: originalPost.title,
				description: originalPost.description,
				postId
			}
		})

		if (!postEdited) {
			return res.status(404).json({ error: 'Não foi possível editar o post' })
		}
		return res.status(200).json(postEdited)
	} catch (error) {
		console.error(error)
		return res.status(400).json({ error: 'Não possível editar o post. Por favor, tente novamente mais tarde' })
	}
}

export const getPosts = async (req: Request, res: Response) => {
	try {
		const prisma = new PrismaClient()
		const posts = await prisma.post.findMany({
			include: {
				commentaries: true,
				metadata: true
			}
		})
		return res.status(200).json(posts)
	} catch (error) {
		console.error(error)
		return res.status(400).json({ error: 'Não possível buscar os usuários. Por favor, tente novamente mais tarde' })
	}
}

export const getPostById = async (req: Request, res: Response) => {
	try {
		const prisma = new PrismaClient()
		const post = await prisma.post.findUnique({
			where: {
				id: req.params.id
			},
			include: {
				commentaries: true
			}
		})

		if (!post) {
			return res.status(404).json({ error: 'Post não encontrado' })
		}

		const incrementPostView = await incrementPostViewCount(post.id)

		if (!incrementPostView) {
			return res.status(400).json({ error: 'Falha ao atualizar a contagem de visualizações do post' })
		}

		const postFields = {
			...post,
			...incrementPostView
		}

		return res.status(200).json(postFields)
	} catch (error) {
		console.error(error)
		return res.status(400).json({ error: 'Não possível buscar o post. Por favor, tente novamente mais tarde' })
	}
}

const incrementPostViewCount = async (postId: string) => {
	try {
		const prisma = new PrismaClient()
		const postMetadata = await prisma.postMetadata.findUnique({
			where: {
				postId: postId
			}
		})

		const postMetadataUpdate = await prisma.postMetadata.update({
			where: {
				id: postMetadata.id
			},
			data: {
				viewCount: postMetadata.viewCount + 1
			}
		})

		return postMetadataUpdate
	} catch (error) {
		return false
	}
}

export const deletePost = async (req: Request, res: Response) => {
	try {
		const prisma = new PrismaClient()
		const postId = req.params.id

		const post = await prisma.post.findUnique({
			where: {
				id: postId
			}
		})

		if (post.userId != req.userId) {
			return res.status(400).json({ error: 'Apenas o proprietário da postagem pode editar ou excluir a postagem' })
		}
		await prisma.post.delete({
			where: {
				id: postId
			}
		})
		await prisma.postMetadata.delete({
			where: {
				postId
			}
		})
		await prisma.postHistory.deleteMany({
			where: {
				postId
			}
		})
		return res.status(200).json({ success: true })
	} catch (error) {
		console.error(error)
		return res.status(400).json({ error: 'Não possível buscar os usuários. Por favor, tente novamente mais tarde' })
	}
}

export const updateLikeCountOnPost = async (req: Request, res: Response) => {
	try {
		const prisma = new PrismaClient()
		const postId = req.params.id
		const postMetadata = await prisma.postMetadata.findUnique({
			where: {
				postId
			}
		})
		const updatedPostMetadata = await prisma.postMetadata.update({
			where: {
				postId: postId
			},
			data: {
				likeCount: postMetadata.likeCount + 1
			}
		})
		return res.status(200).json(updatedPostMetadata)
	} catch (error) {
		console.error(error)
		return res.status(400).json({ error: 'Não possível dar like no post. Por favor, tente novamente mais tarde' })
	}
}

export const updateDislikeCountOnPost = async (req: Request, res: Response) => {
	try {
		const prisma = new PrismaClient()
		const postId = req.params.id
		const postMetadata = await prisma.postMetadata.findUnique({
			where: {
				postId
			}
		})
		const updatedPostMetadata = await prisma.postMetadata.update({
			where: {
				postId: postId
			},
			data: {
				dislikeCount: postMetadata.dislikeCount + 1
			}
		})
		return res.status(200).json(updatedPostMetadata)
	} catch (error) {
		console.error(error)
		return res.status(400).json({ error: 'Não possível dar like no post. Por favor, tente novamente mais tarde' })
	}
}
