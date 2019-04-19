
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

  it('function call is made when multi-party threshold is reached', async () => {
    
    // ARRANGE
    let admin1 = accounts[1];
    let admin2 = accounts[2];
    let admin3 = accounts[3];
    let admin4 = accounts[4];
    
    await config.exerciseC6A.registerUser(admin1, true, {from: config.owner});
    await config.exerciseC6A.registerUser(admin2, true, {from: config.owner});
    await config.exerciseC6A.registerUser(admin3, true, {from: config.owner});
    await config.exerciseC6A.registerUser(admin4, true, {from: config.owner});
    
    let startStatus = await config.exerciseC6A.isOperational.call(); 
    let changeStatus = !startStatus;


    // ACT - one vote > fail
    await config.exerciseC6A.setOperatingStatus(changeStatus, {from: admin1});
    
    let newStatusWithOneVote = await config.exerciseC6A.isOperational.call(); 

    // ASSERT
    assert.equal(startStatus, newStatusWithOneVote, "Multi-party call verify failed for one vote");


    // ACT - one vote > fail
    await config.exerciseC6A.setOperatingStatus(changeStatus, {from: admin2});
    
    let newStatusWithTwoVote = await config.exerciseC6A.isOperational.call(); 

    // ASSERT
    assert.equal(startStatus, newStatusWithTwoVote, "Multi-party call verify failed for two vote");

    // ACT - three vote > success
    await config.exerciseC6A.setOperatingStatus(changeStatus, {from: admin3});
    
    let newStatusWithThreeVote = await config.exerciseC6A.isOperational.call(); 

    // ASSERT
    assert.equal(changeStatus, newStatusWithThreeVote, "Multi-party call failed");

  });
})
