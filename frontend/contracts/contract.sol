// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.0;

contract SportsContract {
    address payable public organization;
    address payable public player;

    uint256 public baseSalary;
    uint256 public contractStart;
    uint256 public contractLengthMonths;
    uint256 public tournamentsRequired;
    uint256 public bonusPayout;
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
        require(block.timestamp >= contractStart + 30 days, "Base salary not due yet");
        require(address(this).balance >= baseSalary, "Insufficient funds to pay base salary");
        
        contractStart = block.timestamp; // Reset the payment window
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