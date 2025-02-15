import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    xrpl: {
      url: process.env.XRPL_EVM_URL!,
      accounts: [process.env.PRIVATE_KEY!],
    }
  }
};

export default config;
