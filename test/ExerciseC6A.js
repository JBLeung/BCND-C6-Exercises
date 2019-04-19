
const Test = require('../config/testConfig.js')

contract('ExerciseC6A', async (accounts) => {
  let config
  before('setup contract', async () => {
    config = await Test.Config(accounts)
  })

  it('contract owner can register new user', async () => {
    // ARRANGE
    const caller = accounts[0] // This should be config.owner or accounts[0] for registering a new user
    const newUser = config.testAddresses[0]

    // ACT
    await config.exerciseC6A.registerUser(newUser, false, {from: caller})
    const result = await config.exerciseC6A.isUserRegistered.call(newUser)

    // ASSERT
    assert.equal(result, true, 'Contract owner cannot register new user')
  })
})
