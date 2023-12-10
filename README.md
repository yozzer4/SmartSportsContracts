# SmartSportsContracts

Sports contract facilitator website using Chainlink and smart contract technology. Developed for Constellation Hackathon 2023.

# Setup instructions

1. Install metamask in browser and set up a wallet
2. We used the Sepolia testnet so all the hardcoded variables in our smart contracts point to that. If you are using a different blockchain, you will need to find the corresponding datafeed address, don ID, and router addresses and replace those values in the smart contract.
3. Deploy the contracts on the blockchain you choose
4. Create a Chainlink Automation Upkeep that points to the "payBaseSalary()" function of the deployed BaseContract.sol contract address
5. Create a Chainlink Functions Subscription with the BonusContractBasketball.sol contract address as the consumer
6. Follow the README in the frontend folder to setup the frontend
7. Edit the contract address constants in both the BaseContract.js and BonusContractTerms.js files to match your corresponding deployed contract addresses
8. Edit the subscription id constant in the BonusContractTerms.js file to match your Chainlink functions subscription.
9. Launch the frontend and try out the application!
