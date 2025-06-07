import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { processFiles } from './processController.js'
import { getLogs, resetLogs } from './helpers/logger.js'

const app = express()
const upload = multer({ dest: 'uploads/' })
app.use(cors())

// Upload e processamento
app.post('/upload', upload.fields([{ name: 'conferencia' }, { name: 'matriz' }]), async (req, res) => {
  try {
    resetLogs()

    const conferenciaPath = req.files['conferencia'][0].path
    const matrizPath = req.files['matriz'][0].path

    const resultadoPath = await processFiles(conferenciaPath, matrizPath)

    res.download(resultadoPath, 'resultado.xlsm', (err) => {
      if (err) console.error('Erro ao enviar o arquivo:', err)
      // limpa arquivos temporários depois de enviar
      fs.unlinkSync(conferenciaPath)
      fs.unlinkSync(matrizPath)
    })
  } catch (err) {
    console.error('Erro no processamento:', err)
    res.status(500).json({ error: 'Erro ao processar as planilhas.' })
  }
})

// Logs para exibição no frontend
app.get('/logs', (req, res) => {
  res.json({ logs: getLogs() })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`)
})

// === SERVE FRONTEND (VITE BUILD) ===
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(express.static(path.join(__dirname, '../public')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'))
})
