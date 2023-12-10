import './BonusContractTerms.css';
import React, { useState, useEffect } from "react";
import { Paper, Typography, Button, Stack, CircularProgress } from '@mui/material';
import { Link, useLocation } from "react-router-dom"
import Web3 from 'web3';
import bonusContractBasketballABI from '../../contracts/BonusContractBasketball.json'

const contractAddress = '0x411700633a9D9800Cdb76D7a6592c96e23c50EB8'
const subscriptionId = "1843";

function BonusContractTerms() {
    const { state } = useLocation();
    const { playerAddress, firstName, lastName, season, targetPoints, pointsPayout, targetGames, gamesPayout } = state;
    const [accepted, setAccepted] = useState(false);
    const [account, setAccount] = useState("");
    const [playerId, setPlayerId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // function to lookup playerId on api using first and last name that were inputted in form from previous page, playerId is needed to fetch stats later
    async function lookupPlayerId() {
        fetch(`https://www.balldontlie.io/api/v1/players?search=${lastName}&per_page=100`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Request failed.');
                }
                return res.json();
            })
            .then(data => {
                const results = data.data;
                for(var i = 0; i < results.length; i++) {
                    if (results[i].first_name.toUpperCase() === firstName.toUpperCase()) {
                        setPlayerId(results[i].id);
                        break;
                    }
                }
            })
    } 

    // look up the player id on page load
    useEffect(() => {
        lookupPlayerId();
    });

    // handler for clicking the "Connect Wallet" button, gets wallet address
    const handleClickConnect = () => {
        async function loadAccounts() {
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.requestAccounts();
            setAccount(accounts[0]);
        }

        try {
            loadAccounts();
        } catch (err) {
            console.log(err);
        }
    }

    // handler for clicking accept button, initializes the contract using the data from webform from previous page, then funds the contract from user's account
    const handleClickAccept = () => {
        setIsLoading(true);
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(bonusContractBasketballABI, contractAddress);
        contract.methods.initializeContract(
            web3.utils.toChecksumAddress(account), 
            web3.utils.toChecksumAddress(playerAddress), 
            parseInt(targetPoints),
            parseInt(pointsPayout),
            parseInt(targetGames),
            parseInt(gamesPayout)
        ).send({from: account}).then(()=>{
            contract.methods.incentiveValue().call().then((res) => {
                contract.methods.fund().send({from: account, value: res}).then(() => {
                    setIsLoading(false);
                    setAccepted(true);
                })
            })
        });
    }

    // handler for clicking fetch total points stats button, calls the function in the contract that fetchs the data from external api with oracle
    //      DEV NOTES: Ideally, this function and button would not exist, instead the function would be called from the contract on a monthly basis with Chainlink Automation
    //                 However, we did not have time to implement this so the button is a workaround
    const handleClickFetchPoints= () => {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(bonusContractBasketballABI, contractAddress);
        contract.methods.sendTotalPointsRequest(subscriptionId, [season, playerId.toString()]).send({from: account});
    }

    // handler for clicking fetch total points stats button, calls the function in the contract that fetchs the data from external api with oracle
    //      DEV NOTES: Ideally, this function and button would not exist, instead the function would be called from the contract on a monthly basis with Chainlink Automation
    //                 However, we did not have time to implement this so the button is a workaround
    const handleClickFetchGames= () => {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(bonusContractBasketballABI, contractAddress);
        contract.methods.sendTotalGamesRequest(subscriptionId, [season, playerId.toString()]).send({from: account});
    }

    // show a loading screen rather than the form to avoid multiple initialize contract calls at a time
    if (isLoading) {
        return (
            <div className="loading-container">
                <Paper className="loading-card" elevation={5}>
                    <CircularProgress></CircularProgress>
                </Paper>
            </div>
        );
    }
    else {
        return (
            <div className="contract-container">
                <Paper className="contract-card" elevation={5}>
                    <Stack spacing={3} justifyContent="center" alignItems="center">
                        <Typography variant='h5'>
                            Bonus Contract Basketball Terms
                        </Typography>
                        <Typography variant='p'>
                            These are the terms of the bonus contract you confirmed from the previous page. Clicking accept will initiate a smart contract with these terms.
                        </Typography>
                        <Button variant='contained' onClick={handleClickConnect}>
                            Connect Wallet
                        </Button>
                        
                        <Typography variant='p'>
                            Account Address: {account}
                        </Typography>
                        <Typography variant='p'>
                            Player ID: {playerId}
                        </Typography>
                        <Typography variant='p'>
                            Player Address: {playerAddress}
                        </Typography>
                        <Typography variant='p'>
                            Season: {season}
                        </Typography>
                        <Typography variant='p'>
                            Points Target: {targetPoints}
                        </Typography>
                        <Typography variant='p'>
                            Points Payout: {pointsPayout}
                        </Typography>
                        <Typography variant='p'>
                            Games Target: {targetGames}
                        </Typography>
                        <Typography variant='p'>
                            Games Payout: {gamesPayout}
                        </Typography>
    
                        <Stack spacing={8} direction='row'>
                            <Link to="/contract/bonus">
                                <Button>Back</Button>
                            </Link>
                            <Button variant='contained' onClick={handleClickAccept} disabled={!account} >Accept</Button>
                        </Stack>
    
                        <Stack spacing={8} direction='row'>
                            <Button variant='contained' disabled={!accepted} onClick={handleClickFetchPoints}>Fetch Total Points Stats</Button>
                            <Button variant='contained' disabled={!accepted} onClick={handleClickFetchGames}>Fetch Total Games Stats</Button>
                        </Stack>
                    </Stack>
                </Paper>
            </div>
        );
    }
    
};
  
export default BonusContractTerms;
