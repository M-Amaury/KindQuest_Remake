// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const KindTokenModule = buildModule("KindToken", (m) => {

  const kindToken = m.contract("KindToken");

  return { kindToken };
});

export default KindTokenModule;
