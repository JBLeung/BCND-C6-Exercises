pragma solidity ^0.4.25;

// It's important to avoid vulnerabilities due to numeric overflow bugs
// OpenZeppelin's SafeMath library, when used correctly, protects agains such bugs
// More info: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2018/november/smart-contract-insecurity-bad-arithmetic/

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";


contract ExerciseC6B {
    using SafeMath for uint256; // Allow SafeMath functions to be called for all uint256 types (similar to "prototype" in Javascript)

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/


    address private contractOwner;                  // Account used to deploy contract
    mapping(address => uint256) private sales;
    uint256 private enabled = block.timestamp;
    uint256 private counter = 1;


    constructor
                (
                )
                public 
    {
        contractOwner = msg.sender;
    }
   
    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    // payment production pattern: rate limiting 
    modifier rateLimit(unit time){
        require(block.timestamp >= enabled, "Rate limiting in effect");
        enabled = enabled.add(time);
        _;
    }

    // payment production pattern: Re-entrancy Guard
    /* The idea of entrancyGuard is this: 
    *  When user1 calls safeWithdraw - entrancyGuard modifier, 
    *  a local variable guard is instantiated with the value of 
    *  counter(let's say 2). Then the _; causes the calling
    *  function to be executed (if safeWithdraw calls an 
    *  external contract that will call safeWithdraw again,
    *  then on the 2nd enterance in the entrancyGuard(), the
    *  global variable counter will be incremented again (so 3).
    *  At the end, when require guard == counter, the guard is a
    *  local variable, saved on method stack (so it's value will
    *  be 2 while the counter is a global variable and its value
    *  is 3. Thus, 2 =!3 and will trigger the revert. Regarding
    *  concurrency issues, there is no such thing. Each transaction
    *  is executed one at a time not in paralel (they are put in a
    *  queue and sorted by the gas Price you're willing to pay). 
    */

    modifier entrancyGuard(){
        counter = counter.add(1);
        uint256 guard = counter;
        _;
        require(guard == counter, "That is not allowed");
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    // payment production pattern: checks - effects - interaction
    function safeWithdraw(uint256 amount) external rateLimit(30 miniutes){
        // Checks
        require(msg.sender == tx.origin, "Contracts not allowed"); // make sure this function can call by user account but not an contact account
        require(sales[msg.sender] >= amount, "Insufficient funds");
        // Effects
        sales[msg.sender] = sales[msg.sender].sub(amount);
        // Interaction
        msg.sender.transfer(amount);
    }

    
}

