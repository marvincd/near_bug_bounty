# BugBounty

**BugBounty** is a blockchain-powered platform on the NEAR ecosystem that allows organizations to post bounties for fixing bugs or implementing new features. Skilled developers (bounty hunters) can claim and complete these tasks for rewards, promoting collaborative software development and community-driven security.

## Getting Started

To set up and run the BugBounty platform locally, please follow the instructions below.

### Prerequisites

- **Node.js** (v14 or later)
- **NEAR CLI** (for deploying contracts)
- **NEAR Wallet**: You’ll need a NEAR wallet to sign in to the application. [Create a wallet here](https://wallet.near.org).

### Installation and Deployment

1. **Clone the Repository**  
   Clone the BugBounty repository from GitHub and navigate into the project directory:
   ```bash
   https://github.com/marvincd/near_bug_bounty.git
   cd bugbounty
2. **Navigate to the Contract Directory**
   Change to the contract directory to access the smart contract files.
 ```bash
 cd contract
```
2. **Build the Contract**
   Run the build.sh script to compile the smart contract:
   ```bash
   ./build.sh
3. **Deploy the Contract**
   Once built, deploy the contract to the NEAR blockchain by running:
   ```bash
   ./deploy.sh
    
4. **Return to the Main Directory**
   ```bash
    cd ..
5. **Start the Application**
   Install dependencies and start the app using the following commands:
    ```bash
    npm install
    npm run dev
    
**ScreenShot**
<img width="1920" alt="Screenshot 2024-10-31 at 19 19 35" src="https://github.com/user-attachments/assets/249428dc-a360-4105-bc5d-d79c4a4680a6">




