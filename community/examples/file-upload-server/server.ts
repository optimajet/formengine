#!/usr/bin/env node

import cors from 'cors'
import express, {type Request, type Response} from 'express'
import multer from 'multer'
import fs from 'node:fs'
import path, {dirname} from 'node:path'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3001

app.use(cors())

const uploadFolder = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, {recursive: true})
}

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, uploadFolder)
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8')
    cb(null, `${Date.now()}-${originalName}`)
  },
})

const upload = multer({storage})

app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  const file = req.file
  if (file) {
    res.json({
      success: true,
      message: 'File uploaded successfully',
      filePath: `/uploads/${file.filename}`,
    })
  } else {
    res.status(400).json({
      success: false,
      message: 'Error during file upload',
    })
  }
})

app.get('/', (_req: Request, res: Response) => {
  res.send('Server is running')
})

app.use('/uploads', express.static(uploadFolder))

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
