import { useState, useEffect } from 'react'
import { Upload, FileCheck2, Loader2, TerminalSquare } from 'lucide-react'

function App() {
  const [conferencia, setConferencia] = useState(null)
  const [matriz, setMatriz] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState([])

  const log = (msg) => setLogs((prev) => [...prev, msg])

  const simulateProgress = () => {
    let current = 0
    const interval = setInterval(() => {
      current += 5
      if (current >= 100) {
        clearInterval(interval)
        setProgress(100)
      } else {
        setProgress(current)
      }
    }, 250)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLogs([])
    setLoading(true)
    setProgress(0)
    simulateProgress()

    try {
      log('📥 Enviando arquivos para o servidor...')
      const formData = new FormData()
      formData.append('conferencia', conferencia)
      formData.append('matriz', matriz)

      const res = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      })

      log('🔄 Processando arquivos...')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'resultado.xlsm'
      a.click()
      log('✅ Download finalizado com sucesso.')
    } catch (err) {
      log('❌ Erro ao processar o arquivo.')
      console.error(err)
    } finally {
      setTimeout(() => {
        setLoading(false)
        setProgress(100)
      }, 600)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-xl space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Processar <span className="text-blue-600">Planilha BASE</span>
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arquivo de Conferência (.xlsx)
            </label>
            <div className="relative">
              <input
              type="file"
              accept=".xlsx"
              onChange={(e) => {
                const file = e.target.files[0]
                if (
                  !file ||
                  !file.name.endsWith('.xlsx') ||
                  file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                ) {
                  alert('Por favor, selecione um arquivo .xlsx válido.')
                  e.target.value = ''
                  return
                }
                setConferencia(file)
              }}
              required
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
              <FileCheck2 className="absolute left-3 top-2.5 h-5 w-5 text-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matriz de Serviços (.xlsx)
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".xlsx"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (
                    !file ||
                    !file.name.endsWith('.xlsx') ||
                    file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                  ) {
                    alert('Por favor, selecione um arquivo .xlsx válido.')
                    e.target.value = ''
                    return
                  }
                  setMatriz(file)
                }}
                required
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FileCheck2 className="absolute left-3 top-2.5 h-5 w-5 text-blue-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Processando...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Enviar e baixar resultado
              </>
            )}
          </button>
        </form>

        {loading && (
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mt-4">
            <div
              className="h-full bg-blue-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {logs.length > 0 && (
          <div className="mt-6 bg-slate-100 rounded-lg p-4 text-sm text-gray-800 shadow-inner max-h-60 overflow-y-auto">
            <div className="flex items-center gap-2 mb-2 font-semibold text-blue-600">
              <TerminalSquare className="h-4 w-4" />
              Logs do processo:
            </div>
            <ul className="space-y-1 list-disc list-inside">
              {logs.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
