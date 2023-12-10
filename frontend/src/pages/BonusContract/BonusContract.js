import './BonusContract.css';
import React, {useState} from "react";
import { Paper, Typography, Button, Stack, TextField } from '@mui/material';
import { Link } from "react-router-dom"

function BonusContract() {
    const [recipientAddress, setRecipientAddress] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [season, setSeason] = useState("");
    const [targetPoints, setTargetPoints] = useState("");
    const [pointsPayout, setPointsPayout] = useState("");
    const [targetGames, setTargetGames] = useState("");
    const [gamesPayout, setGamesPayout] = useState("");

    // handler for inputting recipient address
    const handleRecipientAddressChange = (event) => {
        setRecipientAddress(event.target.value);
    }

    // handler for inputting first name
    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    }

    // handler for inputting last name
    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    }

    // handler for inputting season
    const handleSeasonChange = (event) => {
        setSeason(event.target.value);
    }

    // handler for inputting target points
    const handleTargetPointsChange = (event) => {
        setTargetPoints(event.target.value);
    }

    // handler for inputting points payout
    const handlePointsPayoutChange = (event) => {
        setPointsPayout(event.target.value);
    }

    // handler for inputting target games
    const handleTargetGamesChange = (event) => {
        setTargetGames(event.target.value);
    }

    // handler for inputting games payout
    const handleGamesPayoutChange = (event) => {
        setGamesPayout(event.target.value);
    }

    return (
        <div className="contract-container">
            <Paper className="contract-card" elevation={5}>
                <Stack spacing={3} justifyContent="center" alignItems="center">
                    <Typography variant='h5'>
                        Bonus Contract Basketball
                    </Typography>
                    <Typography variant='p'>
                        This is a bonus contract for teams to create with their players. Once both parties have agreed on terms about the incentives, have the team connect their wallet and enter the information here. Payment will be distributed based on if the player met their incentives.
                    </Typography>
                    <TextField className='input-field' label='Recipient address' variant='outlined' helperText="Wallet address of the person you are signing a contract with" onChange={handleRecipientAddressChange}/>
                    <Stack spacing={5} direction={'row'}>
                        <TextField className='input-field' label='Player first name' variant='outlined' helperText="First name" onChange={handleFirstNameChange}/>
                        <TextField className='input-field' label='Player last name' variant='outlined' helperText="Last name" onChange={handleLastNameChange}/>
                        <TextField className='input-field' label='Season' variant='outlined' helperText="Season of contract" onChange={handleSeasonChange}/>
                    </Stack>
                    <Stack spacing={5} direction={'row'}>
                        <TextField className='input-field' label='Target points' variant='outlined' helperText="The target amount of points for the player to score" onChange={handleTargetPointsChange}/>
                        <TextField className='input-field' label='Points payout' variant='outlined' helperText="Amount you agree to pay the player for hitting the target points" onChange={handlePointsPayoutChange}/>
                    </Stack>
                    <Stack spacing={5} direction={'row'}>
                        <TextField className='input-field' label='Target games' variant='outlined' helperText="The target amount of games for the player to play" onChange={handleTargetGamesChange}/>
                        <TextField className='input-field' label='Games payout' variant='outlined' helperText="Amount you agree to pay the player for playing the target games" onChange={handleGamesPayoutChange}/>
                    </Stack>
                    
                    <Stack spacing={8} direction='row'>
                        <Link to="/contract">
                            <Button>Back</Button>
                        </Link> 
                        {/** Passes inputted form data to next page */}
                        <Link to="/contract/bonus/terms" state={{ playerAddress: recipientAddress, firstName: firstName, lastName: lastName, season: season, targetPoints: targetPoints, pointsPayout: pointsPayout, targetGames: targetGames, gamesPayout: gamesPayout }}>
                            <Button variant='contained'>Confirm</Button>
                        </Link>
                    </Stack>
                </Stack>
            </Paper>
        </div>
    );
};
  
export default BonusContract;
