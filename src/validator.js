function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function parseVersion(fullVersion) {
  return fullVersion.replace(/v?(.+)/, '$1').split('.')
}

export function validateNodeVersion(version) {
  if (!version) return

  const expected = parseVersion(version)
  const actual = parseVersion(process.version)

  for (let i = 0; i < expected.length; ++i) {
    if (!isNumber(expected[i]))
      break // first x variable, quit checking
    else if (actual[i] > expected[i])
      break //exceeds the expected version at this level, quit checking
    else if (actual[i] < expected[i])
      throw new Error('Detected node version ' + process.version + '.  Node version of at least ' + version + ' required.')
  }
}

export function validateEnvVars(varNames) {
  const missingVars = (varNames || []).filter(varName => !process.env[varName])

  if (missingVars && missingVars.length > 0)
    throw new Error('Environment variables still required be set: ' + missingVars.join(', '))
}

export default function validateEnv(env) {
  validateNodeVersion(env.nodeVersion)
  validateEnvVars(env.varNames)
}