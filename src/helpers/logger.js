const logs = []

export function log(msg) {
  const texto = `[${new Date().toLocaleTimeString('pt-BR')}] ${msg}`
  console.log(texto)
  logs.push(msg)
}

export function getLogs() {
  return logs
}

export function resetLogs() {
  logs.length = 0
}
