
const BigNumber = require('bignumber.js')
const Test = require('../config/testConfig.js')

contract('ExerciseC6B', async (accounts) => {
  let config
  before('setup contract', async () => {
    config = await Test.Config(accounts)
  })

  it('contract owner has 1,000,000 AWSM tokens', async () => {
    // ARRANGE
    const caller = accounts[0]

    // ACT
    const result = await config.exerciseC6B.balanceOf.call(caller)

    // ASSERT
    assert.equal(result.toNumber(), new BigNumber(1000000).toNumber(), 'Contract owner initial tokens incorrect')
  })
})
