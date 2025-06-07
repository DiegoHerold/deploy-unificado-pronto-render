import XLSX from 'xlsx'

export function preencherResponsaveis(workbookBase, matrizPath) {
  const workbookMatriz = XLSX.readFile(matrizPath)
  const sheetMatriz = workbookMatriz.Sheets[workbookMatriz.SheetNames[0]]
  const dadosMatriz = XLSX.utils.sheet_to_json(sheetMatriz, { header: 1, range: 2 })

  const mapa = new Map()
  dadosMatriz.forEach(linha => {
    const doc = String(linha[9] || '').replace(/\D/g, '')
    if (doc) mapa.set(doc, linha[1] || '')
  })

  const aba = workbookBase.Sheets['Todos os Documentos']
  const data = XLSX.utils.sheet_to_json(aba, { header: 1 })
  const corpo = data.slice(1)

  corpo.forEach((linha, i) => {
    const doc = String(linha[2] || '').replace(/\D/g, '')
    if (mapa.has(doc)) {
      const cellAddr = XLSX.utils.encode_cell({ r: i + 1, c: 3 }) // Linha +1 (porque cabeçalho é linha 0)
      aba[cellAddr] = { t: 's', v: mapa.get(doc) }
    }
  })
}
