import './BaseContract.css';
import React, {useState} from "react";
import { Paper, Typography, Button, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import Web3 from 'web3';
import baseContractABI from '../../contracts/BaseContract.json'
/* global BigInt */

const contractAddress = '0x80EF8F81C862a0377EFCFE6F08120933C2Bfa69b'

function BaseContract() {
    const [open, setOpen] = useState(false);
    const [account, setAccount] = useState("");
    const [recepientAddress, setRecepientAddress] = useState("");
    const [totalPayment, setTotalPayment] = useState("");

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

    const handleRecepientAddressChange = (event) => {
        setRecepientAddress(event.target.value);
    }

    const handleTotalPaymentChange = (event) => {
        setTotalPayment(event.target.value);
    }

    const handleClickConfirm = () => {
        setOpen(true);
    }

    const handleClickAccept = () => {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(baseContractABI, contractAddress);
        contract.methods.initializeContract(web3.utils.toChecksumAddress(account), web3.utils.toChecksumAddress(recepientAddress), totalPayment).send({from: account}).then(()=>{
            contract.methods.salary().call().then((res) => {
                contract.methods.fund().send({from: account, value: res * BigInt(24)})
            })
        });

        setOpen(false);
    }
    
    const handleClose = () => {
        setOpen(false);
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
                    <Button variant='contained' onClick={handleClickConnect}>
                        Connect Wallet
                    </Button>
                    <Typography variant='p'>
                        Account Address: {account}
                    </Typography>
                    <TextField className='input-field' label='Recepient address' variant='outlined' helperText="Wallet address of the person you are signing a contract with" onChange={handleRecepientAddressChange}/>
                    <TextField className='input-field' label='Total payment' variant='outlined' helperText="Amount you agree to pay the person over a year in USD" onChange={handleTotalPaymentChange}/>
                    <Stack spacing={8} direction='row'>
                        <Button>Back</Button>
                        <Button variant='contained' onClick={handleClickConfirm}>Confirm</Button>
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
                </Stack>
            </Paper>
        </div>
    );
};
  
export default BaseContract;