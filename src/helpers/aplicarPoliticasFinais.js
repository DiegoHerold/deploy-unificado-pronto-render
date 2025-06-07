import XLSX from 'xlsx'

export const gruposRemoverDoTodos = [
  'JAISE',
  'SERVIÇO EXTRA',
  'ASSESSORIA'
]

export function aplicarPoliticasFinais(workbookBase) {
  const abaTodos = workbookBase.Sheets['Todos os Documentos']
  const dados = XLSX.utils.sheet_to_json(abaTodos, { header: 1 })
  const cabecalho = dados[0] || []
  const corpo = dados.slice(1)

  const manterEmTodos = []
  const removerHubcount = []

  for (const linha of corpo) {
    const grupo = (linha[0] || '').toUpperCase().trim()
    const responsavel = (linha[3] || '').trim()

    if (!responsavel) {
      removerHubcount.push(linha)
    } else if (!gruposRemoverDoTodos.includes(grupo)) {
      manterEmTodos.push(linha)
    }
  }

  const colCount = cabecalho.length

  // Limpa apenas os dados (mantém o cabeçalho) na aba Todos os Documentos
  for (let r = 1; r < 1000; r++) {
    for (let c = 0; c < colCount; c++) {
      const addr = XLSX.utils.encode_cell({ r, c })
      delete abaTodos[addr]
    }
  }

  // Reinsere os dados filtrados
  manterEmTodos.forEach((linha, i) => {
    for (let j = 0; j < colCount; j++) {
      const addr = XLSX.utils.encode_cell({ r: i + 1, c: j })
      abaTodos[addr] = { t: 's', v: linha[j] ?? '' }
    }
  })

  abaTodos['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: manterEmTodos.length + 1, c: colCount - 1 }
  })

  // Atualiza ou cria aba REMOVER HUBCOUNT
  const abaRemover = workbookBase.Sheets['REMOVER HUBCOUNT']
  const linhasAntigas = abaRemover
    ? XLSX.utils.sheet_to_json(abaRemover, { header: 1 }).slice(1)
    : []

  const nova = [...linhasAntigas, ...removerHubcount]

  const novaRef = {
    s: { r: 0, c: 0 },
    e: { r: nova.length + 1, c: colCount - 1 }
  }

  const novaSheet = abaRemover || {}
  for (let r = 1; r < 1000; r++) {
    for (let c = 0; c < colCount; c++) {
      const addr = XLSX.utils.encode_cell({ r, c })
      delete novaSheet[addr]
    }
  }

  // Cabeçalho
  cabecalho.forEach((v, j) => {
    const addr = XLSX.utils.encode_cell({ r: 0, c: j })
    novaSheet[addr] = { t: 's', v }
  })

  // Dados
  nova.forEach((linha, i) => {
    for (let j = 0; j < colCount; j++) {
      const addr = XLSX.utils.encode_cell({ r: i + 1, c: j })
      novaSheet[addr] = { t: 's', v: linha[j] ?? '' }
    }
  })

  novaSheet['!ref'] = XLSX.utils.encode_range(novaRef)
  workbookBase.Sheets['REMOVER HUBCOUNT'] = novaSheet
}
