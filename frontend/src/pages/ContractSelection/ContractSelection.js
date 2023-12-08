import './ContractSelection.css';
import React, {useState} from "react";
import { Paper, Typography, Button, Fab, Stack, TextField } from '@mui/material';
import { Link, Outlet } from "react-router-dom"

function ContractSelection() {
    return (
        <div className="contract-container">
            <Paper className="contract-card" elevation={5}>
                <Stack spacing={5} justifyContent="center" alignItems="center">
                    <Typography variant='h5'>
                        Select a type of contract to create:
                    </Typography>
                    <Link to="base">
                        <Fab variant='extended'>
                            Base Contract
                        </Fab>
                    </Link>
                    <Fab sx={{ width: '60%' }} variant='extended'>
                        Bonus Contract
                    </Fab>
                    <Fab sx={{ width: '60%' }} variant='extended'>
                        Tournament Payout
                    </Fab>
                </Stack>
            </Paper>
        </div>


    );
};
  
export default ContractSelection;