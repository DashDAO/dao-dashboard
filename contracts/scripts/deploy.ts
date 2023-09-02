import { ethers } from "hardhat";

async function main() {
  const DelegateFollow = await ethers.getContractFactory("DelegateFollow");
  const contract = await DelegateFollow.deploy()

  console.log(`Deployed at address ${await contract.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
