import dayjs from 'dayjs'
import { existsSync, mkdirSync } from 'fs'
import mime from 'mime-types'
import multer from 'multer'
import path from 'path'
import { removeAccents } from './utils'

const fileHandler = (dirName: string) =>
	multer({
		storage: multer.diskStorage({
			destination: (_, __, cb) => {
				const folder = path.resolve(dirName)

				if (!existsSync(folder)) {
					mkdirSync(folder, {
						recursive: true
					})
				}

				cb(null, dirName)
			},
			filename: (_, file, cb) => {
				const uniqueNameWithDate =
					process.env.NODE_ENV == 'development'
						? dayjs().format('DD-MM-YYYY-HH-mm-ss-SSS')
						: dayjs().subtract(3, 'hours').format('DD-MM-YYYY-HH-mm-ss-SSS')
				const fileExtension = mime.extension(file.mimetype)

				if (fileExtension) {
					const fileNameWithoutExtension = removeAccents(file.originalname.replace(`.${fileExtension}`, ''))
					cb(null, `${fileNameWithoutExtension}-${uniqueNameWithDate}.${fileExtension}`)
				} else {
					//this is just for cases when files doesn't have extension, mime will return false
					cb(null, file.originalname)
				}
			}
		}),
		fileFilter: (req, file, cb) => {
			file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8')
			cb(null, true)
		}
	})

export default fileHandler
