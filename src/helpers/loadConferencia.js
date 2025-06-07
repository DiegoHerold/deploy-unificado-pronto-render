import XLSX from 'xlsx'

export function loadConferencia(conferenciaPath) {
  const workbook = XLSX.readFile(conferenciaPath)
  const sheet = workbook.Sheets['Todos Documentos']
  if (!sheet) throw new Error('Aba "Todos Documentos" não encontrada na conferência.')

  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 12 })

  return data.map(linha => [
    linha[0],  // A
    linha[1],  // B
    linha[2],  // C
    '',        // D (responsável)
    '',        // E (e-mail)
    linha[10], // K → F
    linha[11], // L → G
    linha[12], // M → H
    linha[13], // N → I
    linha[14], // O → J
  ])
}
