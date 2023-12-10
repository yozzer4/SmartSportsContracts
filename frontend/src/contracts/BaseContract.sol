// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// The organization can deploy this contract and lock in funds
// conditions determine how a player is paid
// we can pay base salary and have bonuses determined by 
contract BaseContract {
    // represents the address that deploys the contract and initially funds it
    address payable public organization;

    // represents the address of the player that will receive payments
    address payable public player;

    // represents the total value of the contract in USD;
    uint public contractValue;
    
    // represents the calculated salary in ETH from the contract value
    uint public salary;

    // represents a counter to keep track of number of payments made
    uint public counter = 0;

    // a boolean to show if the contract is initialized and running (currently paying out) or not
    bool public isContractRunning = false;

    mapping(address => uint256) public addressToAmountFunded;

    // 
    AggregatorV3Interface internal dataFeed;

    // the address of the datafeed to use for conversion, initialized to ETH/USD datafeed on Sepolia Testnet
    address internal dataFeedAddress = 0x694AA1769357215DE4FAC081bf1f309aDC325306;

    error LackOfFunds(uint transferAmount, uint currentBalance);

    constructor() {
        dataFeed = AggregatorV3Interface(
            dataFeedAddress
        );
    }

    // function that uses datafeed of ETH/USD to convert a USD amount into WEI
    function convertUSDtoWEI(uint _amountInUSD) public view returns (uint) {
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        uint eth_price = uint(answer) * 1e10;
        uint usd = _amountInUSD * 1e18;
        uint amountInWEI = (usd * 1e18) / eth_price;
        return amountInWEI;
    }

    function setOrg(address payable _organizationAddress) public {
        organization = _organizationAddress;
    }

    function setPlayer(address payable _playerAddress) public {
        player = _playerAddress;
    }

    function setContractValue(uint256 _contractValue) public {
        contractValue = _contractValue;
    }

    function setIsContractRunning(bool _isContractRunning) public {
        isContractRunning = _isContractRunning;
    }

    // calculates biweekly salary for player in WEI based off of current conversion rates and total contract value, and sets salary property to that value
    function calculateSalary() public {
        uint contractValueInWEI = convertUSDtoWEI(contractValue);
        uint salaryInWEI = contractValueInWEI / 24;
        salary = salaryInWEI;
    }

    // function to initialize a contract, executed from UI once a contract is confirmed
    function initializeContract(address payable _organizationAddress, address payable _playerAddress, uint _contractValue) public {
        // don't run this if a contract is already running, avoids overwriting already running contracts
        require(!isContractRunning);
        
        setOrg(_organizationAddress);
        setPlayer(_playerAddress);
        setContractValue(_contractValue);
        setIsContractRunning(true);
        calculateSalary();
    }

    // function to reset a contract to default values 
    function resetContract() public {
        setOrg(payable(address(0)));
        setPlayer(payable(address(0)));
        setContractValue(0);
        setIsContractRunning(false);
        salary = 0;
        counter = 0;
    }
    
    // function to pay out salary, executed every two weeks with chainlink automation
    function payBaseSalary() external {
        // only pay out when the contract is active
        require(isContractRunning);

        // if the counter is >= 23, it means we are on the last pay period, so pay out whatever is left in the contract and reset
        if (counter >= 23) {
            player.transfer(address(this).balance);
            resetContract();
        }
        else if (address(this).balance < salary) {
            revert LackOfFunds({transferAmount: salary, currentBalance: address(this).balance});
        }
        else {
            player.transfer(salary);
            counter += 1;
        }
    }
    
    // function to fund contract
    function fund() public payable {
        addressToAmountFunded[msg.sender] += msg.value;
    }
    
    // Check remaining balance of the contract
    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}