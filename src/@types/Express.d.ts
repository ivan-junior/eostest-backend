declare namespace Express {
	export interface Request extends Record<string, any> {
		userId?: string | undefined
		profile?: string | undefined
		files?: {
			files?: any
			anexo?: any
		}
	}
}