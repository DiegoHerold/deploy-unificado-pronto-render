import XLSX from 'xlsx'

const grupoParaAba = {
  'ASSESSORIA': 'ASSESSORIA',
  'JAISE': 'JAISE',
  'SERVIÇO EXTRA': 'Serviço Extra',
  'CONTABILIDADE INTERNA - CI': 'Contabilidade Interna',
  'CONTABILIDADE EXTERNA - CE': 'Contabilidade Externa',
  'RH - RECURSOS HUMANOS': 'RH'
}

export function distribuirPorGrupo(workbookBase, linhasTransformadas) {
  for (const [grupo, nomeAba] of Object.entries(grupoParaAba)) {
    const linhasGrupo = linhasTransformadas.filter(l => (l[0] || '').toUpperCase().trim() === grupo)
    const aba = workbookBase.Sheets[nomeAba]
    if (!aba) continue

    const existente = XLSX.utils.sheet_to_json(aba, { header: 1 })
    const cabecalho = existente[0] || []
    const colCount = cabecalho.length

    // Limpa dados existentes (mantém cabeçalho)
    for (let r = 1; r < 1000; r++) {
      for (let c = 0; c < colCount; c++) {
        const addr = XLSX.utils.encode_cell({ r, c })
        delete aba[addr]
      }
    }

    // Insere novas linhas
    linhasGrupo.forEach((linha, idx) => {
      for (let i = 0; i < 10 && i < colCount; i++) {
        const addr = XLSX.utils.encode_cell({ r: idx + 1, c: i })
        aba[addr] = { t: 's', v: linha[i] || '' }
      }
    })

    aba['!ref'] = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: linhasGrupo.length + 1, c: colCount - 1 }
    })
  }
}
