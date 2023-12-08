import './BaseContract.css';
import React, {useState} from "react";
import { Paper, Typography, Button, InputLabel, Stack, TextField } from '@mui/material';

function BaseContract() {
    const [term, setTerm] = React.useState('');

    const handleChange = (event) => {
        setTerm(event.target.value);
    };

    return (
        <div className="contract-container">
            <Paper className="contract-card" elevation={5}>
                <Stack spacing={5} justifyContent="center" alignItems="center">
                    <Typography variant='h5'>
                        Base Contract
                    </Typography>
                    <Typography variant='p'>
                        This is a base contract for teams to create with their players. Once both parties have agreed on terms about payment, have the team connect their wallet and enter the information here. Payment will occur biweekly until a year is up.
                    </Typography>
                    <TextField className='input-field' label='Recepient address' variant='outlined' helperText="Wallet address of the person you are signing a contract with" />
                    <TextField className='input-field' label='Total payment' variant='outlined' helperText="Amount you agree to pay the person over a year in USD" />
                </Stack>
            </Paper>
        </div>
    );
};
  
export default BaseContract;