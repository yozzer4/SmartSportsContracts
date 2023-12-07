// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.0;


// The organization can deploy this contract and lock in funds
// conditions determine how a player is paid
// we can pay base salary and have bonuses determined by 
contract SportsContract {
    
    // represents the address that deploys the contract and initially funds it
    address payable public organization;
    // represents the address of the player that will receive payments
    address payable public player;

    // base salary for player to be paid out
    uint256 public baseSalary;
    // what day the contract started
    uint256 public contractStart;
    // contract length in months
    uint256 public contractLengthMonths;
    // tournaments required for bonus
    uint256 public tournamentsRequired;
    // Bonus payout from tournaments attended
    uint256 public bonusPayout;
    // represents the tournaments a player has participated in during the time
    uint256 public tournamentsParticipated;

    event SalaryPaid(address indexed player, uint256 amount);
    event BonusPaid(address indexed player, uint256 amount);

    modifier onlyOrganization() {
        require(msg.sender == organization, "Only the organization can call this function");
        _;
    }

    constructor(
        address payable _player,
        uint256 _baseSalary,
        uint256 _contractLengthMonths,
        uint256 _tournamentsRequired,
        uint256 _bonusPayout
    ) payable {
        organization = payable(msg.sender);
        player = _player;
        baseSalary = _baseSalary;
        contractLengthMonths = _contractLengthMonths;
        tournamentsRequired = _tournamentsRequired;
        bonusPayout = _bonusPayout;
        
        contractStart = block.timestamp;
    }
    
    function payBaseSalary() external onlyOrganization {
        require(address(this).balance >= baseSalary, "Insufficient funds to pay base salary");
        
        player.transfer(baseSalary);

        emit SalaryPaid(player, baseSalary);
    }
    
    function payBonus() external onlyOrganization {
        require(tournamentsParticipated >= tournamentsRequired, "Tournaments requirement not met");
        require(address(this).balance >= bonusPayout, "Insufficient funds for bonus payment");

        tournamentsParticipated = 0; // Reset the tournament count
        player.transfer(bonusPayout);

        emit BonusPaid(player, bonusPayout);
    }


    // increment tournament 
    function recordTournamentParticipation() external onlyOrganization {
        tournamentsParticipated += 1;
    }
    
    // Fallback function to accept incoming Ether
    receive() external payable {}
    
    // Check remaining balance of the contract
    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}