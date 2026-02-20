const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting TodoList deployment...\n");

  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Get balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy contract
  console.log("⏳ Deploying TodoList contract...");
  const TodoList = await hre.ethers.getContractFactory("TodoList");
  const todoList = await TodoList.deploy();
  
  await todoList.waitForDeployment();
  const contractAddress = await todoList.getAddress();
  
  console.log("✅ TodoList deployed successfully!");
  console.log("📍 Contract address:", contractAddress);
  console.log("\n" + "=".repeat(60));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:          ", hre.network.name);
  console.log("Contract Address: ", contractAddress);
  console.log("Deployer:         ", deployer.address);
  console.log("Gas Used:          (check transaction)");
  console.log("=".repeat(60) + "\n");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber()
  };
  
  const outputPath = path.join(__dirname, "..", "deployment.json");
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("💾 Deployment info saved to: deployment.json");
  
  // Save ABI for frontend
  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "TodoList.sol", "TodoList.json");
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const abiPath = path.join(__dirname, "..", "frontend", "src", "TodoListABI.json");
    
    // Create directory if it doesn't exist
    const abiDir = path.dirname(abiPath);
    if (!fs.existsSync(abiDir)) {
      fs.mkdirSync(abiDir, { recursive: true });
    }
    
    fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
    console.log("📄 ABI saved to: frontend/src/TodoListABI.json");
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("NEXT STEPS");
  console.log("=".repeat(60));
  console.log("1. Copy the contract address above");
  console.log("2. Update CONTRACT_ADDRESS in frontend/src/App.js");
  console.log("3. Run: npm run frontend");
  console.log("=".repeat(60) + "\n");
  
  console.log("🎉 Deployment complete!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
