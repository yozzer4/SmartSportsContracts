import './ContractSelection.css';
import React from "react";
import { Paper, Typography, Fab, Stack } from '@mui/material';
import { Link } from "react-router-dom"

function ContractSelection() {
    return (
        <div className="contract-container">
            <Paper className="contract-card" elevation={5}>
                <Stack spacing={5} justifyContent="center" alignItems="center">
                    <Typography variant='h5'>
                        Select a type of contract to create:
                    </Typography>
                    <Link className='button-link' to="base">
                        <Fab variant='extended'>
                            Base Contract
                        </Fab>
                    </Link>
                    <Link className='button-link' to="bonus">
                        <Fab variant='extended'>
                            Bonus Contract
                        </Fab>
                    </Link>
                    <Fab sx={{ width: '60%' }} variant='extended' disabled={true}>
                        Tournament Payout
                    </Fab>
                </Stack>
            </Paper>
        </div>


    );
};
  
export default ContractSelection;