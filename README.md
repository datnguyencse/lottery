# lottery
Simple Lottery contract and UI using FAU faucet token.
## Guide
1. Create an admin account on metamask. Save your mnemonic to secrets.json.
2. Create https://infura.io/ account and setup a project on kovan networ. Save your projectId  to secrets.json.
3. Create https://etherscan.io/apis account and save your api_key to secrets.json. This api key need for verify contract.
4. Get some ETH and FAU faucet token at https://gitter.im/kovan-testnet/faucet and https://erc20faucet.com/ to 3 accounts.
4. Run commands to compile, deploy and verify contracts.
```
npm i -g truffle
yarn
truffle deploy --reset --network kovan
truffle run verify Lottery --network kovan
```
If all above commands success, you should see this
```
2_deploy_contracts.js
=====================

   Deploying 'Lottery'
   -------------------
   > transaction hash:    0x38ae5213b4bba32631d8aaec33425559e4fc9d12d1e587233e931ea5adf5f3ec
   > Blocks: 2            Seconds: 9
   > contract address:    0x3d5e53BA7FF88E743c143bAAB17C1D4f77d3001a
   > block number:        31487044
   > block timestamp:     1651995368
   > account:             0x28Eb5E921c4E5a3D0dDa2E27FE6E73e834342D7d
   > balance:             4.990765068289621661
   > gas used:            1298246 (0x13cf46)
   > gas price:           2.500000007 gwei
   > value sent:          0 ETH
   > total cost:          0.003245615009087722 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:     0.003245615009087722 ETH

Summary
=======
> Total deployments:   1
> Final cost:          0.003245615009087722 ETH


datnguyen@Dats-MacBook-Pro lottery % truffle run verify Lottery --network kovan
Verifying Lottery
Unable to locate ContractCode at 0x3d5e53BA7FF88E743c143bAAB17C1D4f77d3001a
Failed to verify 1 contract(s): Lottery
datnguyen@Dats-MacBook-Pro lottery % truffle run verify Lottery --network kovan
Verifying Lottery
Pass - Verified: https://kovan.etherscan.io/address/0x3d5e53BA7FF88E743c143bAAB17C1D4f77d3001a#code
Successfully verified 1 contract(s).
```

5. Copy `build/contracts/Lottery.json` to `public/abi/lottery.js`
6. Run `node index.js` to start web UI.
