import XLSX from 'xlsx'

export function atualizarTodosDocumentos(workbookBase, linhas, cabecalhoCompleto) {
  const sheet = workbookBase.Sheets['Todos os Documentos']
  if (!sheet) return

  // Limpa apenas dados (mantém o cabeçalho)
  const startRow = 2
  const totalCols = cabecalhoCompleto.length

  // Limpar células abaixo do cabeçalho
  for (let R = startRow; R < 1000; R++) {
    for (let C = 0; C < totalCols; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
      delete sheet[cellAddress]
    }
  }

  // Inserir novas linhas
  linhas.forEach((linha, idx) => {
    for (let i = 0; i < 10 && i < totalCols; i++) {
      const cellAddress = XLSX.utils.encode_cell({ r: idx + 1, c: i })
      sheet[cellAddress] = { t: 's', v: linha[i] ?? '' }
    }
  })

  // Atualizar o range da planilha
  const totalRows = linhas.length + 1
  sheet['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: totalRows, c: totalCols - 1 }
  })
}
