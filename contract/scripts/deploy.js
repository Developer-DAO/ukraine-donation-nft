// scripts/deploy.js

async function main() {
  const PixelDevsUkraineDonation = await ethers.getContractFactory("PixelDevsUkraineDonation");
  console.log("Deploying PixelDevsUkraineDonation...");
  const pixelDevsUkraineDonation = await PixelDevsUkraineDonation.deploy();
  await pixelDevsUkraineDonation.deployed();
  console.log("PixelDevsUkraineDonation deployed to:", pixelDevsUkraineDonation.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
