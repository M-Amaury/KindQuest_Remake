import "@nomicfoundation/hardhat-ethers";
import hre from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const KindToken = await hre.ethers.getContractFactory("KindToken");
    const kindToken = await KindToken.attach(contractAddress!);
    console.log("Contract address:", kindToken);

    const [owner] = await hre.ethers.getSigners();
    console.log("Owner address:", owner.address);

    const mintAmount = hre.ethers.parseEther("10000");
    const tx = await kindToken.mint(owner.address!, mintAmount);
    await tx.wait();

    console.log("Minted tokens to:", process.env.RECIPIENT_ADDRESS!);

    const balance = await kindToken.balanceOf(owner.address!);
    console.log("Balance:", balance);  
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });