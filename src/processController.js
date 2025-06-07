import path from 'path'
import XLSX from 'xlsx'
import { log } from './helpers/logger.js'
import { loadConferencia } from './helpers/loadConferencia.js'
import { atualizarTodosDocumentos } from './helpers/atualizarTodosDocumentos.js'
import { distribuirPorGrupo } from './helpers/distribuirPorGrupo.js'
import { preencherResponsaveis } from './helpers/preencherResponsaveis.js'
import { preencherEmails } from './helpers/preencherEmails.js'
import { aplicarPoliticasFinais } from './helpers/aplicarPoliticasFinais.js'

export async function processFiles(conferenciaPath, matrizPath, outputPath = './output/resultado.xlsm') {
  try {
    log('✔️ Lendo e processando planilha de conferência...')
    const linhas = loadConferencia(conferenciaPath)
    log(`✔️ Conferência carregada com ${linhas.length} registros.`)

    const basePath = path.resolve('./src/data/Planilha BASE.xlsm')
    log('✔️ Carregando Planilha BASE com macros...')
    const workbookBase = XLSX.readFile(basePath, { bookVBA: true })

    const sheet = workbookBase.Sheets['Todos os Documentos']
    const cabecalho = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] || []

    log('✔️ Atualizando aba "Todos os Documentos"...')
    atualizarTodosDocumentos(workbookBase, linhas, cabecalho)

    log('✔️ Preenchendo responsáveis via Matriz de Serviços...')
    preencherResponsaveis(workbookBase, matrizPath)

    log('✔️ Preenchendo e-mails dos responsáveis...')
    preencherEmails(workbookBase)

    const sheetTodosAtualizado = workbookBase.Sheets['Todos os Documentos']
    const dadosAtualizados = XLSX.utils.sheet_to_json(sheetTodosAtualizado, { header: 1 }).slice(1)

    log('✔️ Distribuindo registros por aba de grupo...')
    distribuirPorGrupo(workbookBase, dadosAtualizados)

    log('✔️ Aplicando política de remoção e separação para REMOVER HUBCOUNT...')
    aplicarPoliticasFinais(workbookBase)

    let finalPath = path.resolve(outputPath)
    if (!finalPath.toLowerCase().endsWith('.xlsm')) {
      finalPath = finalPath.replace(/\.\w+$/, '.xlsm')
    }

    log(`✔️ Salvando planilha como XLSM com macros: ${finalPath}`)
    XLSX.writeFile(workbookBase, finalPath, { bookType: 'xlsm', bookVBA: true })

    log('✅ Processamento concluído com sucesso.')
    return finalPath
  } catch (err) {
    log(`[ERRO] ${err.message}`)
    throw err
  }
}
