// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title GettingStartedFunctionsConsumer
 * @notice This is an example contract to show how to make HTTP requests using Chainlink
 * @dev This contract uses hardcoded values and should not be used in production.
 */
contract BonusContractBasketball is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    // represents the address that deploys the contract and initially funds it
    address payable public organization;

    // represents the address of the player that will receive payments
    address payable public player;

    // represents the total possible value of incentives in ETH
    uint256 public incentiveValue;

    // represents the target of points for the player to score
    uint256 public targetPoints;

    // represents the payout if the player hits the target points
    uint256 public pointsPayout;

    // represents the target of games for the player to play
    uint256 public targetGames;

    // represents the payout if the player plays the target number of games
    uint256 public gamesPayout;

    // a boolean to show if the contract is initialized and running (currently paying out) or not
    bool public isContractRunning = false;

    // represents the total amount of the stat the player has recorded
    uint256 public totalStat;

    // represents the total amount of points the player has scored this season
    uint256 public totalPoints = 0;

    // represents the total amount of games the player has played this season
    uint256 public totalGames = 0;

    // State variables to store the last request ID, response, and error
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    // represents the last request type, 0 for a total points request, 1 for a total games request
    uint256 public lastRequestType = 0;

    // Custom error type
    error UnexpectedRequestID(bytes32 requestId);

    // Event to log responses
    event Response(
        bytes32 indexed requestId,
        uint256 totalStat,
        bytes response,
        bytes err
    );

    // Router address - Hardcoded for Sepolia Testnet
    // Check to get the router address for your supported network https://docs.chain.link/chainlink-functions/supported-networks
    address router = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0;

    // JavaScript source code
    // Fetch total points for a given player during a given season
    // Documentation: https://www.balldontlie.io/home.html#get-averages
    string totalPointsRequest =
        "const season = args[0];"
        "const playerId = args[1];"
        "const playerStatsResponse = await Functions.makeHttpRequest({"
        "url: `https://www.balldontlie.io/api/v1/season_averages?season=${season}&player_ids[]=${playerId}`"
        "});"
        "if (playerStatsResponse.error) {"
        "throw Error('Request failed');"
        "}"
        "const playerStatsData = playerStatsResponse.data.data[0];"
        "const totalPoints = Math.round(playerStatsData.games_played * playerStatsData.pts);"
        "return Functions.encodeUint256(totalPoints)";

    // JavaScript source code
    // Fetch total points for a given player during a given season
    // Documentation: https://www.balldontlie.io/home.html#get-averages
    string totalGamesRequest =
        "const season = args[0];"
        "const playerId = args[1];"
        "const playerStatsResponse = await Functions.makeHttpRequest({"
        "url: `https://www.balldontlie.io/api/v1/season_averages?season=${season}&player_ids[]=${playerId}`"
        "});"
        "if (playerStatsResponse.error) {"
        "throw Error('Request failed');"
        "}"
        "const playerStatsData = playerStatsResponse.data.data[0];"
        "return Functions.encodeUint256(playerStatsData.games_played)";

    // Callback gas limit
    uint32 gasLimit = 300000;

    // donID - Hardcoded for Sepolia Testnet
    // Check to get the donID for your supported network https://docs.chain.link/chainlink-functions/supported-networks
    bytes32 donID =
        0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;

    AggregatorV3Interface internal dataFeed;

    // the address of the datafeed to use for conversion, initialized to ETH/USD datafeed on Sepolia Testnet
    address internal dataFeedAddress = 0x694AA1769357215DE4FAC081bf1f309aDC325306;

    mapping(address => uint256) public addressToAmountFunded;

    /**
     * @notice Initializes the contract with the Chainlink router address and sets the contract owner
     */
    constructor() FunctionsClient(router) ConfirmedOwner(msg.sender) {
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

    function setTargetPoints(uint256 _targetPoints) public {
        targetPoints = _targetPoints;
    }

    function setPointsPayout(uint256 _pointsPayout) public {
        pointsPayout = _pointsPayout;
    }

    function setTargetGames(uint256 _targetGames) public {
        targetGames = _targetGames;
    }

    function setGamesPayout(uint256 _gamesPayout) public {
        gamesPayout = _gamesPayout;
    }

    function setTotalPoints(uint256 _totalPoints) public {
        totalPoints = _totalPoints;
    }

    function setTotalGames(uint256 _totalGames) public {
        totalGames = _totalGames;
    }

    function setIsContractRunning(bool _isContractRunning) public {
        isContractRunning = _isContractRunning;
    }

    // function that calculates total incentive value in ETH and sets it, used to tell how much to fund the contract
    function calculateIncentiveValue() public {
        incentiveValue = convertUSDtoWEI(pointsPayout + gamesPayout);
    }

    // takes all the data from UI webform and initializes contract by setting respective properties to the data values
    function initializeContract(
        address payable _organizationAddress, 
        address payable _playerAddress,
        uint256 _targetPoints,
        uint256 _pointsPayout,
        uint256 _targetGames,
        uint256 _gamesPayout
    ) public {
        // don't run this if a contract is already running, avoids overwriting already running contracts
        require(!isContractRunning);

        setOrg(_organizationAddress);
        setPlayer(_playerAddress);
        setTargetPoints(_targetPoints);
        setPointsPayout(_pointsPayout);
        setTargetGames(_targetGames);
        setGamesPayout(_gamesPayout);
        calculateIncentiveValue();
        setIsContractRunning(true);
    }

    // function to reset a contract to default values 
    function resetContract() public {
        setOrg(payable(address(0)));
        setPlayer(payable(address(0)));
        setTargetPoints(0);
        setPointsPayout(0);
        setTargetGames(0);
        setGamesPayout(0);
        incentiveValue = 0;
        totalStat = 0;
        totalPoints = 0;
        totalGames = 0;
        setIsContractRunning(false);
    }

    // function to pay out bonus, use chainlink automation to call at the end of a season
    function payBonus() external {
        // if player had more points than target, pay them out for that
        if (totalPoints > targetPoints) {
            player.transfer(convertUSDtoWEI(pointsPayout));
        }
        // if player had more games than target, pay them out for that
        if (totalGames > targetGames) {
            player.transfer(convertUSDtoWEI(gamesPayout));
        }
        // if player didn't meet either quota, organization gets their money back
        organization.transfer(address(this).balance);

        // reset at the end
        resetContract();
    }

    // function to fund contract
    function fund() public payable {
        addressToAmountFunded[msg.sender] += msg.value;
    }

    /**
     * @notice Sends an HTTP request for character information
     * @param subscriptionId The ID for the Chainlink subscription
     * @param args The arguments to pass to the HTTP request
     * @return requestId The ID of the request
     *
     * function to request the total points of the player from external api, ideally would be set up to run with Chainlink Automation every month or so to keep the contract updated
     */
    function sendTotalPointsRequest(
        uint64 subscriptionId,
        string[] calldata args
    ) external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(totalPointsRequest); // Initialize the request with JS code
        if (args.length > 0) req.setArgs(args); // Set the arguments for the request

        // Send the request and store the request ID
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );

        lastRequestType = 0;

        return s_lastRequestId;
    }

    /**
     * @notice Sends an HTTP request for character information
     * @param subscriptionId The ID for the Chainlink subscription
     * @param args The arguments to pass to the HTTP request
     * @return requestId The ID of the request
     *
     * function to request the total games of the player from external api, ideally would be set up to run with Chainlink Automation every month or so to keep the contract updated
     */
    function sendTotalGamesRequest(
        uint64 subscriptionId,
        string[] calldata args
    ) external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(totalGamesRequest); // Initialize the request with JS code
        if (args.length > 0) req.setArgs(args); // Set the arguments for the request

        // Send the request and store the request ID
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );

        lastRequestType = 1;

        return s_lastRequestId;
    }

    /**
     * @notice Callback function for fulfilling a request
     * @param requestId The ID of the request to fulfill
     * @param response The HTTP response data
     * @param err Any errors from the Functions request
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId); // Check if request IDs match
        }
        // Update the contract's state variables with the response and any errors
        s_lastResponse = response;
        totalStat = uint256(bytes32(response));
        // based on the last request type, we update the state variables accordingly with the retrieved statistics
        if (lastRequestType == 0) {
            totalPoints = totalStat;
        }
        if (lastRequestType == 1) {
            totalGames = totalStat;
        }
        s_lastError = err;

        // Emit an event to log the response
        emit Response(requestId, totalStat, s_lastResponse, s_lastError);
    }
}
