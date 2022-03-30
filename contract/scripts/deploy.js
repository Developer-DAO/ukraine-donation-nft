// scripts/deploy.js

async function main() {
    const contract = await ethers.getContractFactory(
        'DeveloperDAOforUkraine'
    );

    console.log('Deploying contract...');

    const deployedContract = await contract.deploy();
    await deployedContract.deployed();

    console.log('Contract deployed to:', deployedContract.address);

    const prices = [9, 29, 79, 199, 499, 999]
        .map((price) =>
            process.env.DUMMY_PRICING === 'true' ? price / 1000 : price
        )
        .map((price) => ethers.utils.parseEther(price.toString()));

    await deployedContract.setTierPricing(...prices);

    console.log('Updated tier pricing');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
