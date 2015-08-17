import validator from '../validator'

function mkEnv(varNames, nodeVersion) {
  return {
    nodeVersion,
    varNames
  }
}

describe('validator', () => {

  it('takes an env object', () => {
    validator.length.should.eql(1)
  })

  describe('with a valid node version', () => {

    const nodeVer = '0.12.x'
    const origVersion = process.version
    let origEnv

    const envVars = ['A_TEST_VAR', 'ANOTHER_TEST_VAR']

    before(() => {
      Object.defineProperty(process, 'version', {
        value: 'v0.12.7'
      })
    })

    beforeEach(() => {
      origEnv = process.env
    })

    after(() => {
      Object.defineProperty(process, 'version', {
        value: origVersion
      })
    })

    afterEach(() => {
      Object.defineProperty(process, 'env', {
        value: origEnv
      })
    })

    describe('with all require env vars', () => {

      it('is happy', () => {
        Object.defineProperty(process, 'env', {
          value: {
            A_TEST_VAR: 'someVal',
            ANOTHER_TEST_VAR: 'anotherVal',
            ...origEnv
          }
        })

        validator(mkEnv(envVars, nodeVer))
      })

    })

    describe('with missing env vars', () => {

      it('throws', () => {
        Object.defineProperty(process, 'env', {
          value: {
            A_TEST_VAR: 'someVal',
            ...origEnv
          }
        })

        try {
          validator(mkEnv(envVars, nodeVer))
          'never'.should.eql('get here (or have to do this, if should.throw worked)')
        } catch (e) {
          e.message.should.match(/Environment variables still required/)
        }
      })

    })

  })

  describe('node versions', () => {
    const origVersion = process.version
    const actualMajor = 0
    const actualMinor = 25
    const actualPatch = 5
    const actualVer = `v${actualMajor}.${actualMinor}.${actualPatch}`

    before(() => {
      Object.defineProperty(process, 'version', {
        value: actualVer
      })
    })

    after(() => {
      Object.defineProperty(process, 'version', {
        value: origVersion
      })
    })

    it('throws if less than required version', () => {
      (() => { validator(mkEnv([], `v${actualMajor}.${actualMinor + 5}.${actualPatch}`)) }).should.throw(/Node version/)
    })

    it('is happy with an exactly-equal version', () => {
      validator(mkEnv([], actualVer))
    })

    it('ignores invalid lower version after the if the previous version was higher', () => {
      validator(mkEnv([], `v${actualMajor}.${actualMinor - 1}.${actualPatch + 1}`))
    })

    it('throws if a later version is lower and the previous version matches', () => {
      (() => { validator(mkEnv([], `v${actualMajor}.${actualMinor}.${actualPatch + 1}`)) }).should.throw(/Node version/)
    })

    describe('variable versions', () => {

      it('doesnt check if in major version', () => {
        validator(mkEnv([], 'vx.0.0'))
      })

      it('doesnt check if in minor version', () => {
        validator(mkEnv([], `v${actualMajor}.x.${actualPatch}`))
      })

      it('doesnt check if in patch version', () => {
        validator(mkEnv([], `v${actualMajor}.${actualMinor}.x`))
      })

      it('ignores invalid lower version after the first/highest variable', () => {
        validator(mkEnv([], `v${actualMajor}.x.${actualPatch + 1}`))
      })

    })

  })

})