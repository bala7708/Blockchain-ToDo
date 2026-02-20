# 📝 Blockchain To-Do List 


## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Compile & Test
```bash
# Compile contract
npm run compile

# Run tests (optional but recommended)
npm test
```

### Step 3: Deploy & Run
```bash
# Terminal 1 - Start blockchain
npm run node

# Terminal 2 - Deploy contract
npm run deploy

# Terminal 3 - Start frontend
npm run frontend
```

---

## 📦 What You Need

### Software:
- **Node.js 18+** - https://nodejs.org/
- **MetaMask** - https://metamask.io/
- **VS Code** (recommended) - https://code.visualstudio.com/

### VS Code Extensions (Optional):
- Solidity by Juan Blanco
- ESLint
- Prettier

---

## 🔧 Detailed Setup

### 1. Install Everything (5 minutes)

```bash
# Install root packages
npm install

# This installs:
# - hardhat
# - ethers v6
# - OpenZeppelin contracts
# - Testing tools
# - All dependencies
```

```bash
# Install frontend packages
cd frontend
npm install

# This installs:
# - React
# - ethers
# - react-scripts
```

### 2. Compile Smart Contract (30 seconds)

```bash
npm run compile
```

✅ **Expected Output:**
```
Compiled 1 Solidity file successfully (evm target: paris).
```

### 3. Run Tests (1 minute)

```bash
npm test
```

✅ **Expected Output:**
```
  TodoList Contract
    Deployment
      ✔ Should deploy successfully
    Creating Tasks
      ✔ Should create a task successfully
      ✔ Should fail with empty content
      ✔ Should create multiple tasks
    Toggling Tasks
      ✔ Should toggle task to completed
    ...
  26 passing
```

### 4. Start Local Blockchain (Terminal 1)

```bash
npm run node
```

✅ **You'll see:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

⚠️ **IMPORTANT:** Keep this terminal running!
📋 **Copy the private key** for MetaMask setup

### 5. Deploy Contract (Terminal 2)

```bash
npm run deploy
```

✅ **You'll see:**
```
🚀 Starting TodoList deployment...
📝 Deploying with account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
⏳ Deploying TodoList contract...
✅ TodoList deployed successfully!
📍 Contract address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

📋 **Copy the contract address!**

### 6. Update Frontend

Open `frontend/src/App.js` and find line 19:

```javascript
// BEFORE:
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// AFTER (paste YOUR contract address):
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";
```

**Save the file!** (Ctrl+S or Cmd+S)

### 7. Setup MetaMask

**Add Network:**
1. Open MetaMask
2. Click network dropdown
3. Add Network → Add network manually
4. Fill in:
   - Network name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency symbol: `ETH`
5. Save

**Import Test Account:**
1. Click account icon
2. Import Account
3. Paste private key from Step 4
4. Import

💰 **You now have 10,000 test ETH!**

### 8. Start Frontend (Terminal 3)

```bash
npm run frontend
```

✅ **Browser opens at:** http://localhost:3000

---

## 🎮 How to Use

### Connect Wallet
1. Click **"🔗 Connect Wallet"**
2. MetaMask pops up
3. Click **"Connect"**
4. ✅ Connected!

### Add Task
1. Type in input box: "Buy groceries"
2. Click **"➕ Add Task"**
3. Confirm in MetaMask
4. Wait 2-3 seconds
5. Task appears!

### Complete Task
- Click checkbox next to task
- Confirm in MetaMask
- Task gets strikethrough ✅

### Edit Task
- Click ✏️ icon
- Type new content
- Click 💾 Save
- Confirm in MetaMask

### Delete Task
- Click 🗑️ icon
- Click OK to confirm
- Confirm in MetaMask
- Task removed!

---

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
# Solution: Clean install
rm -rf node_modules package-lock.json
npm install

cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 8545 already in use"
```bash
# Solution: Kill the process
# Mac/Linux:
lsof -ti:8545 | xargs kill -9

# Windows:
netstat -ano | findstr :8545
taskkill /PID <PID> /F
```

### Error: "MetaMask Nonce too high"
```bash
# Solution: Clear MetaMask activity
# 1. Open MetaMask
# 2. Settings → Advanced
# 3. Clear activity tab data
# 4. Click "Clear"
```

### Error: "Transaction failed"
```bash
# Solution: Check these things:
# 1. Is Terminal 1 (blockchain) still running?
# 2. Are you on "Hardhat Local" network in MetaMask?
# 3. Is contract address correct in App.js?
# 4. Try refreshing the page
```

### Error: "Failed to load tasks"
```bash
# Solution:
# 1. Check browser console (F12)
# 2. Verify contract address is correct
# 3. Make sure you're connected to correct network
# 4. Try disconnecting and reconnecting wallet
```

### Frontend won't start
```bash
# Solution:
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## 📁 Project Structure

```
blockchain-todo/
├── contracts/
│   └── TodoList.sol              # Smart contract
├── scripts/
│   └── deploy.js                 # Deployment script
├── test/
│   └── TodoList.test.js          # Test suite
├── frontend/
│   ├── public/
│   │   └── index.html            # HTML template
│   ├── src/
│   │   ├── App.js                # Main component
│   │   ├── App.css               # Styles
│   │   └── index.js              # Entry point
│   └── package.json              # Frontend deps
├── hardhat.config.js             # Hardhat config
├── package.json                  # Root deps
└── README.md                     # This file
```

---

## 🎓 What You Built

### Smart Contract Features:
- ✅ Create tasks
- ✅ Toggle complete/incomplete
- ✅ Edit task content
- ✅ Delete tasks
- ✅ Get statistics (total, completed, pending)
- ✅ User-specific task lists

### Frontend Features:
- ✅ MetaMask wallet connection
- ✅ Real-time task updates
- ✅ Statistics dashboard
- ✅ Inline editing
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design

---

## 💡 Tips

1. **Each MetaMask account has separate tasks**
2. **Keep Terminal 1 running** - it's your blockchain
3. **Gas fees are FREE** - test network
4. **Tasks persist** until you restart blockchain
5. **Switch accounts** in MetaMask to see different lists

---

## 🎯 Next Steps

Want to enhance the app? Try adding:

1. **Task Categories** - Home, Work, Personal
2. **Due Dates** - Deadline tracking
3. **Priority Levels** - High, Medium, Low
4. **Task Notes** - Additional descriptions
5. **Search/Filter** - Find tasks easily
6. **Task Sharing** - Share with other addresses

---

## 📚 Resources

- **Solidity Docs:** https://docs.soliditylang.org/
- **Hardhat Docs:** https://hardhat.org/docs
- **Ethers.js Docs:** https://docs.ethers.org/
- **React Docs:** https://react.dev/

---

## 🆘 Still Having Issues?

### Check These:

1. **Node.js version:**
   ```bash
   node --version  # Should be 18+
   ```

2. **All terminals running:**
   - Terminal 1: `npm run node` ✅
   - Terminal 2: Closed after deploy
   - Terminal 3: `npm run frontend` ✅

3. **MetaMask:**
   - On "Hardhat Local" network ✅
   - Test account imported ✅
   - Connected to the app ✅

4. **Contract address:**
   - Copied correctly ✅
   - Updated in App.js ✅
   - File saved ✅

---

## ✅ Verification Checklist

Before asking for help, verify:

- [ ] Node.js 18+ installed
- [ ] MetaMask installed
- [ ] `npm install` completed (root)
- [ ] `npm install` completed (frontend)
- [ ] `npm run compile` successful
- [ ] `npm test` all passing
- [ ] Terminal 1 running (`npm run node`)
- [ ] Contract deployed successfully
- [ ] Contract address copied
- [ ] Contract address updated in App.js
- [ ] File saved
- [ ] MetaMask network added
- [ ] Test account imported
- [ ] Frontend started (`npm run frontend`)
- [ ] Wallet connected

---

**🎉 Congratulations!**

You've successfully built and deployed your first blockchain application!

**Made with ❤️ for learning blockchain development**
