// test/PixelDevsUkraineDonation.test.js
const { expect, use } = require('chai');
const { solidity } = require('ethereum-waffle');

use(solidity);

const ipfs = 'ipfs://QmZiCUXCytbbnqCzJAujXLxeQS7MkE9TJKyYbV6LjSinN4/';
const pricing = [9, 29, 79, 199, 499, 999];

function tierPrice(index) {
    return ethers.utils.parseEther(pricing[index].toString());
}

describe('PixelDevsUkraineDonation', function () {
    before(async function () {
        this.Contract = await ethers.getContractFactory(
            'PixelDevsUkraineDonation'
        );

        const [owner, addr1] = await ethers.getSigners();
        this.owner = owner;
        this.otherUser = addr1;
    });

    beforeEach(async function () {
        this.contract = await this.Contract.deploy();
        await this.contract.deployed();
        await this.contract.setTierPricing(
            ...pricing.map((_, index) => tierPrice(index))
        );
    });

    describe('when setting properties', function () {
        it('should successfully setBaseURI and emit event', async function () {
            const newURI = 'ipfs://testuri';

            await expect(this.contract.setBaseURI(newURI))
                .to.emit(this.contract, 'BaseURIUpdated')
                .withArgs(ipfs, newURI);

            await expect(await this.contract.baseURI()).to.equal(newURI);
        });

        it('should successfully setTierPricing and emit events', async function () {
            const newPrices = [1, 2, 3, 4, 5, 6].map((price) =>
                ethers.utils.parseEther(price.toString())
            );

            await expect(this.contract.setTierPricing(...newPrices))
                .to.emit(this.contract, 'TierPricingUpdated')
                .withArgs('steel', tierPrice(0), newPrices[0]);

            await expect(await this.contract.tiers('steel')).to.equal(
                newPrices[0]
            );
        });
    });

    describe('when minting', async function () {
        it('should successfully increment tokenId, mint tokens 1 and 2, and emit events', async function () {
            await expect(
                this.contract.mint({
                    value: tierPrice(0),
                })
            )
                .to.emit(this.contract, 'LogTokenMinted')
                .withArgs(this.owner.address, 1, 'steel');

            await expect(await this.contract.ownerOf(1)).to.equal(
                this.owner.address
            );

            await expect(
                this.contract.mint({
                    value: tierPrice(1),
                })
            )
                .to.emit(this.contract, 'LogTokenMinted')
                .withArgs(this.owner.address, 2, 'bronze');

            await expect(await this.contract.ownerOf(2)).to.equal(
                this.owner.address
            );
        });

        it('should not mint if value is below the minimum tier', async function () {
            await expect(
                this.contract.mint({ value: ethers.utils.parseEther('1') })
            ).to.be.revertedWith(
                'Please send enough MATIC to meet the minimum threshold of a tier.'
            );
        });

        it('should have tier == STEEL', async function () {
            await expect(
                this.contract.mint({
                    value: tierPrice(0),
                })
            )
                .to.emit(this.contract, 'LogTokenMinted')
                .withArgs(this.owner.address, 1, 'steel');

            await expect(await this.contract.tokenURI(1)).to.equal(
                `${ipfs}steel.png`
            );
        });

        it('should have tier == BRONZE', async function () {
            await expect(
                this.contract.mint({
                    value: tierPrice(1),
                })
            )
                .to.emit(this.contract, 'LogTokenMinted')
                .withArgs(this.owner.address, 1, 'bronze');

            await expect(await this.contract.tokenURI(1)).to.equal(
                `${ipfs}bronze.png`
            );
        });

        it('should have donationType == SILVER', async function () {
            await expect(
                this.contract.mint({
                    value: tierPrice(2),
                })
            )
                .to.emit(this.contract, 'LogTokenMinted')
                .withArgs(this.owner.address, 1, 'silver');

            await expect(await this.contract.tokenURI(1)).to.equal(
                `${ipfs}silver.png`
            );
        });

        it('should have donationType == GOLD', async function () {
            await expect(
                this.contract.mint({
                    value: tierPrice(3),
                })
            )
                .to.emit(this.contract, 'LogTokenMinted')
                .withArgs(this.owner.address, 1, 'gold');

            await expect(await this.contract.tokenURI(1)).to.equal(
                `${ipfs}gold.png`
            );
        });

        it('should have donationType == DIAMOND', async function () {
            await expect(
                this.contract.mint({
                    value: tierPrice(4),
                })
            )
                .to.emit(this.contract, 'LogTokenMinted')
                .withArgs(this.owner.address, 1, 'diamond');

            await expect(await this.contract.tokenURI(1)).to.equal(
                `${ipfs}diamond.png`
            );
        });

        it('should have donationType == PLATINUM', async function () {
            await expect(
                this.contract.mint({
                    value: tierPrice(5),
                })
            )
                .to.emit(this.contract, 'LogTokenMinted')
                .withArgs(this.owner.address, 1, 'platinum');

            await expect(await this.contract.tokenURI(1)).to.equal(
                `${ipfs}platinum.png`
            );
        });

        it('should ensure each mint has its own tokenURI (and does not share one at contract level)', async function () {
            // Fixes https://github.com/Developer-DAO/ukraine-donation-nft/issues/16
            // where the donationType was being saved at contract level
            // so each mint would change the tokenURI for everybody.
            // This test mints two tokens, then checks to make sure first token
            // didn't lose its tokenURI.

            // mint first one
            await expect(
                this.contract.mint({
                    value: ethers.utils.parseEther('1000'),
                })
            )
                .to.emit(this.contract, 'LogTokenMinted')
                .withArgs(this.owner.address, 1, 'platinum');

            await expect(await this.contract.tokenURI(1)).to.equal(
                `${ipfs}platinum.png`
            );

            // mint second one
            await expect(
                this.contract.mint({
                    value: tierPrice(1),
                })
            )
                .to.emit(this.contract, 'LogTokenMinted')
                .withArgs(this.owner.address, 2, 'bronze');

            await expect(await this.contract.tokenURI(2)).to.equal(
                `${ipfs}bronze.png`
            );

            // ensure URI for first token is still correct
            await expect(await this.contract.tokenURI(1)).to.equal(
                `${ipfs}platinum.png`
            );
        });

        it('should mint if contractActive is true', async function () {
            await expect(await this.contract.contractActive()).to.equal(true);

            await expect(
                this.contract.mint({
                    value: tierPrice(0),
                })
            )
                .to.emit(this.contract, 'LogTokenMinted')
                .withArgs(this.owner.address, 1, 'steel');

            await expect(await this.contract.ownerOf(1)).to.equal(
                this.owner.address
            );
        });

        it('should fail mint if contractActive is false', async function () {
            await expect(await this.contract.contractActive()).to.equal(true);

            await expect(this.contract.toggleContractState())
                .to.emit(this.contract, 'ContractStateUpdated')
                .withArgs(true, false);

            await expect(await this.contract.contractActive()).to.equal(false);

            await expect(
                this.contract.mint({
                    value: tierPrice(0),
                })
            ).to.be.revertedWith(
                'This contract has been deactivated by the owner and does not currently accept anymore donations.'
            );
        });
    });

    describe('when withdrawing', function () {
        it('should withdraw as owner', async function () {
            await expect(
                this.contract.mint({
                    value: ethers.utils.parseEther('12'),
                })
            );

            const balanceBefore = await ethers.provider.getBalance(
                this.owner.address
            );
            const w = await this.contract.withdraw();
            const balanceAfter = await ethers.provider.getBalance(
                this.owner.address
            );

            // should be close to 12 MATIC (12 - gas fees)
            await expect(
                balanceAfter
                    .sub(balanceBefore)
                    .gt(ethers.utils.parseEther('11'))
            ).to.be.true;
        });

        it('should fail withdraw if not owner', async function () {
            await expect(
                this.contract.mint({
                    value: ethers.utils.parseEther('12'),
                })
            );

            await expect(
                this.contract.connect(this.otherUser).withdraw()
            ).to.be.revertedWith('Ownable: caller is not the owner');
        });
    });

    describe('when switching contract state', function () {
        it('should change as owner', async function () {
            await expect(await this.contract.contractActive()).to.equal(true);

            await expect(this.contract.toggleContractState())
                .to.emit(this.contract, 'ContractStateUpdated')
                .withArgs(true, false);

            await expect(await this.contract.contractActive()).to.equal(false);
        });

        it('should fail change if not owner', async function () {
            await expect(await this.contract.contractActive()).to.equal(true);

            await expect(
                this.contract.connect(this.otherUser).toggleContractState()
            ).to.be.revertedWith('Ownable: caller is not the owner');
        });
    });
});
