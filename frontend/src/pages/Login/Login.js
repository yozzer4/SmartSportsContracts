import './Login.css';
import React, {useState} from "react";
import { ethers } from "ethers";
import { Card, CardActions, CardContent, Typography, Button } from '@mui/material';
import { useSDK } from '@metamask/sdk-react';

function Login() {
    const [account, setAccount] = useState("");
    const { sdk, connected, connecting, provider, chainId } = useSDK();

    const connect = async () => {
        try {
          const accounts = await sdk?.connect();
          setAccount(accounts?.[0]);
        } catch(err) {
          console.warn(`failed to connect..`, err);
        }
    };
 
    return (
        <div className="Login">
            <Card>
                <CardContent>
                    <Typography>
                        Account Address: 
                        {account}
                    </Typography>
                    <Typography>
                        Balance: 
                    </Typography>
                    <CardActions>
                        <Button onClick={connect}>
                            Connect to Wallet
                        </Button>
                    </CardActions>
                </CardContent>
            </Card>
        </div>
    );
};
  
export default Login;