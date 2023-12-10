import './BaseContract.css';
import React, {useState} from "react";
import { Paper, Typography, Button, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Link } from "react-router-dom"
import Web3 from 'web3';
import baseContractABI from '../../contracts/BaseContract.json'
/* global BigInt */

// hardcoded to deployed contract address
const contractAddress = '0xbD3Bb99008E80B90fA5B2Ed6eE07eB77F169dc32'

function BaseContract() {
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [account, setAccount] = useState("");
    const [recipientAddress, setRecipientAddress] = useState("");
    const [totalPayment, setTotalPayment] = useState("");

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

    // handler for inputting recipient address
    const handleRecipientAddressChange = (event) => {
        setRecipientAddress(event.target.value);
    }

    // handler for inputting total payment
    const handleTotalPaymentChange = (event) => {
        setTotalPayment(event.target.value);
    }

    // handler for clicking confirm button, opens confirmation modal
    const handleClickConfirm = () => {
        setOpen(true);
    }

    // handler for clicking accept button in confirmation modal, initializes contract using the data inputted by user in the web form, then funds the contract from the user's account
    const handleClickAccept = () => {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(baseContractABI, contractAddress);
        contract.methods.initializeContract(web3.utils.toChecksumAddress(account), web3.utils.toChecksumAddress(recipientAddress), totalPayment).send({from: account}).then(()=>{
            contract.methods.salary().call().then((res) => {
                contract.methods.fund().send({from: account, value: res * BigInt(24)}).then(() => {
                    setSuccess(true);
                })
            })
        });

        setOpen(false);
    }
    
    // handler to close confirmation modal
    const handleClose = () => {
        setOpen(false);
    };

    // handler to close success modal
    const handleSuccessClose = (event, reason) => {
        if (reason && reason === "backdropClick") 
            return;
        setSuccess(false);
    }

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
                    <Button variant='contained' onClick={handleClickConnect}>
                        Connect Wallet
                    </Button>
                    <Typography variant='p'>
                        Account Address: {account}
                    </Typography>
                    <TextField className='input-field' label='Recipient address' variant='outlined' helperText="Wallet address of the person you are signing a contract with" onChange={handleRecipientAddressChange}/>
                    <TextField className='input-field' label='Total payment' variant='outlined' helperText="Amount you agree to pay the person over a year in USD" onChange={handleTotalPaymentChange}/>
                    <Stack spacing={8} direction='row'>
                        <Link to="/contract">
                            <Button>Back</Button>
                        </Link>
                        <Button variant='contained' onClick={handleClickConfirm} disabled={!account || !recipientAddress || !totalPayment}>Confirm</Button>
                    </Stack>

                    <Dialog
                        open={open}
                        onClose={handleClose}
                    >
                        <DialogTitle>
                            Confirmation
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Accepting this will initialize the smart contract. 
                                <br/>
                                It will cause MetaMask to prompt you twice: once to initizalize the contract and once to fund the contract.
                                <br/>
                                Ensure you have enough funds in your wallet before confirming
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleClickAccept} autoFocus>
                                Accept
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={success}
                        onClose={handleSuccessClose}
                    >
                        <DialogTitle>
                            Success!
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                You've successfully initialized a contract with your player!
                                Click the button below to return to the contract selection page.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Link to="/contract">
                                <Button>Return</Button>
                            </Link>
                        </DialogActions>
                    </Dialog>
                </Stack>
            </Paper>
        </div>
    );
};
  
export default BaseContract;
