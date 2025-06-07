import XLSX from 'xlsx'
import path from 'path'

export function preencherEmails(workbookBase) {
  const emailPath = path.resolve('./src/data/email responsaveis.xlsx')
  const workbook = XLSX.readFile(emailPath)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const dados = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 1 })

  const mapa = new Map()
  dados.forEach(linha => {
    const nome = String(linha[0] || '').trim().toUpperCase()
    const email = String(linha[1] || '').trim()
    if (nome && email) mapa.set(nome, email)
  })

  const aba = workbookBase.Sheets['Todos os Documentos']
  const data = XLSX.utils.sheet_to_json(aba, { header: 1 })
  const corpo = data.slice(1)

  corpo.forEach((linha, i) => {
    const responsavel = String(linha[3] || '').trim().toUpperCase()
    if (mapa.has(responsavel)) {
      const cellAddr = XLSX.utils.encode_cell({ r: i + 1, c: 4 }) // Linha +1 por causa do cabeçalho
      aba[cellAddr] = { t: 's', v: mapa.get(responsavel) }
    }
  })
}
