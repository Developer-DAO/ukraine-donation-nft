// test/DeveloperDAOforUkraine.test.js
const { expect, use } = require('chai');
const { solidity } = require('ethereum-waffle');

use(solidity);

const ipfs = 'ipfs://QmZiCUXCytbbnqCzJAujXLxeQS7MkE9TJKyYbV6LjSinN4/';
const ipfsContract = 'ipfs://QmZiCUXCytbbnqCzJAujXLxeQS7MkE9TJKyYbV6LjSinN4/';
const pricing = [9, 29, 79, 199, 499, 999];

function tierPrice(index) {
    return ethers.utils.parseEther(pricing[index].toString());
}

describe('DeveloperDAOforUkraine', function () {
    before(async function () {
        this.Contract = await ethers.getContractFactory(
            'DeveloperDAOforUkraine'
        );

        const [owner, addr2] = await ethers.getSigners();
        this.owner = owner;
        this.otherUser = addr2;
    });

    beforeEach(async function () {
        this.contract = await this.Contract.deploy();
        await this.contract.deployed();
        await this.contract.setTierPricing(
            ...pricing.map((_, index) => tierPrice(index))
        );
    });

    beforeEach(async function () {
        this.defaultAdminRole = await this.contract.DEFAULT_ADMIN_ROLE();
        this.withdrawRole = await this.contract.WITHDRAW_ROLE();
    });

    describe('when setting properties', function () {
        it('should successfully setBaseURI and emit event', async function () {
            const newURI = 'ipfs://testuri';

            await expect(this.contract.setBaseURI(newURI))
                .to.emit(this.contract, 'BaseURIUpdated')
                .withArgs(ipfs, newURI);

            await expect(await this.contract.baseURI()).to.equal(newURI);
        });

        it('should successfully setContractURI and emit event', async function () {
            const newURI = 'ipfs://testuri';

            await expect(this.contract.setContractURI(newURI))
                .to.emit(this.contract, 'ContractURIUpdated')
                .withArgs(ipfsContract, newURI);

            await expect(await this.contract.contractURI()).to.equal(newURI);
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
                `${ipfs}steel`
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
                `${ipfs}bronze`
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
                `${ipfs}silver`
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
                `${ipfs}gold`
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
                `${ipfs}diamond`
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
                `${ipfs}platinum`
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
                `${ipfs}platinum`
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
                `${ipfs}bronze`
            );

            // ensure URI for first token is still correct
            await expect(await this.contract.tokenURI(1)).to.equal(
                `${ipfs}platinum`
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
        it('should withdraw as user with withdraw role to withdraw wallet address', async function () {
            const beforeWithdrawWallet = await this.contract.withdrawWallet();

            await expect(
                this.contract.setWithdrawWallet(this.otherUser.address)
            )
                .to.emit(this.contract, 'WithdrawWalletUpdated')
                .withArgs(beforeWithdrawWallet, this.otherUser.address);

            await expect(await this.contract.withdrawWallet()).to.equal(
                this.otherUser.address
            );

            await expect(
                this.contract.mint({
                    value: ethers.utils.parseEther('12'),
                })
            );

            await expect(await this.contract.ownerOf(1)).to.equal(
                this.owner.address
            );

            const balanceBefore = await ethers.provider.getBalance(
                this.otherUser.address
            );

            const w = await this.contract.withdraw();

            const balanceAfter = await ethers.provider.getBalance(
                this.otherUser.address
            );

            // should be close to 12 MATIC (12 - gas fees)
            await expect(
                balanceAfter
                    .sub(balanceBefore)
                    .gt(ethers.utils.parseEther('11'))
            ).to.be.true;
        });

        it('should fail withdraw if user does not have withdraw role', async function () {
            await expect(
                this.contract.mint({
                    value: ethers.utils.parseEther('12'),
                })
            );

            await expect(await this.contract.ownerOf(1)).to.equal(
                this.owner.address
            );

            await expect(
                this.contract.connect(this.otherUser).withdraw()
            ).to.be.revertedWith(
                `AccessControl: account ${this.otherUser.address.toLowerCase()} is missing role ${
                    this.withdrawRole
                }`
            );
        });
    });

    describe('when switching contract state', function () {
        it('should change as admin', async function () {
            await expect(await this.contract.contractActive()).to.equal(true);

            await expect(this.contract.toggleContractState())
                .to.emit(this.contract, 'ContractStateUpdated')
                .withArgs(true, false);

            await expect(await this.contract.contractActive()).to.equal(false);
        });

        it('should fail change if not admin', async function () {
            await expect(await this.contract.contractActive()).to.equal(true);

            await expect(
                this.contract.connect(this.otherUser).toggleContractState()
            ).to.be.revertedWith(
                `AccessControl: account ${this.otherUser.address.toLowerCase()} is missing role ${
                    this.defaultAdminRole
                }`
            );
        });
    });

    describe('when setting withdraw wallet', function () {
        it('should change as admin', async function () {
            const beforeWithdrawWallet = await this.contract.withdrawWallet();

            await expect(
                this.contract.setWithdrawWallet(this.otherUser.address)
            )
                .to.emit(this.contract, 'WithdrawWalletUpdated')
                .withArgs(beforeWithdrawWallet, this.otherUser.address);

            await expect(await this.contract.withdrawWallet()).to.equal(
                this.otherUser.address
            );
        });

        it('should fail change if not admin', async function () {
            await expect(
                this.contract
                    .connect(this.otherUser)
                    .setWithdrawWallet(this.otherUser.address)
            ).to.be.revertedWith(
                `AccessControl: account ${this.otherUser.address.toLowerCase()} is missing role ${
                    this.defaultAdminRole
                }`
            );
        });
    });

    describe('when getting royaltyInfo', function () {
        it('should return a royalty of 1000 for a sale value of 10000 - 10%', async function () {
            const royaltyInfo = await this.contract.royaltyInfo(1, 10000);
            const receiver = royaltyInfo[0];
            const royalty = royaltyInfo[1].toNumber();

            await expect(receiver).to.equal(this.contract.address);
            await expect(royalty).to.equal(1000);
        });

        it('should return a royalty of 5000 for a sale value of 50000 - 10%', async function () {
            const royaltyInfo = await this.contract.royaltyInfo(1, 50000);
            const receiver = royaltyInfo[0];
            const royalty = royaltyInfo[1].toNumber();

            await expect(receiver).to.equal(this.contract.address);
            await expect(royalty).to.equal(5000);
        });
    });

    describe('when setting royalties', function () {
        it('should change as admin', async function () {
            await expect(this.contract.setRoyalties(2000))
                .to.emit(this.contract, 'RoyaltyUpdated')
                .withArgs(
                    this.contract.address,
                    1000,
                    this.contract.address,
                    2000
                );

            const royaltyInfo = await this.contract.royaltyInfo(1, 10000);
            const receiver = royaltyInfo[0];
            const royalty = royaltyInfo[1].toNumber();

            await expect(receiver).to.equal(this.contract.address);
            await expect(royalty).to.equal(2000);
        });

        it('should fail change if not admin', async function () {
            await expect(
                this.contract.connect(this.otherUser).setRoyalties(2000)
            ).to.be.revertedWith(
                `AccessControl: account ${this.otherUser.address.toLowerCase()} is missing role ${
                    this.defaultAdminRole
                }`
            );
        });
    });

    describe('when assigning withdraw role', function () {
        it('should succeed if executing user has default admin role.', async function () {
            await expect(
                this.contract.grantRole(this.withdrawRole, this.otherUser.address)
            )
                .to.emit(this.contract, 'RoleGranted')
                .withArgs(this.withdrawRole, this.otherUser.address, this.owner.address);
        });

        it('should fail if executing user does not have default admin role.', async function () {
            await expect(
                this.contract.connect(this.otherUser).grantRole(this.withdrawRole, this.otherUser.address)
            )
                .to.be.revertedWith(
                    `AccessControl: account ${this.otherUser.address.toLowerCase()} is missing role ${
                        this.defaultAdminRole
                    }`
                );
        });

        it('should allow more than one user to have the withdraw role', async function () {
            await expect(
                this.contract.grantRole(this.withdrawRole, this.otherUser.address)
            )
                .to.emit(this.contract, 'RoleGranted')
                .withArgs(this.withdrawRole, this.otherUser.address, this.owner.address);


            const withdrawUserCount = await this.contract.getRoleMemberCount(this.withdrawRole);
            const withdrawUsers = []; 

            for(let i = 0; i < withdrawUserCount; i++) {
                withdrawUsers.push(await this.contract.getRoleMember(this.withdrawRole, i));
            }

            expect(withdrawUsers).to.have.members([this.owner.address, this.otherUser.address]);
        });        
    });

    describe('when assigning default admin role', function () {
        it('should succeed if executing user has default admin role.', async function () {
            await expect(
                this.contract.grantRole(this.defaultAdminRole, this.otherUser.address)
            )
                .to.emit(this.contract, 'RoleGranted')
                .withArgs(this.defaultAdminRole, this.otherUser.address, this.owner.address);
        });

        it('should fail if executing user does not have default admin role.', async function () {
            await expect(
                this.contract.connect(this.otherUser).grantRole(this.defaultAdminRole, this.otherUser.address)
            )
                .to.be.revertedWith(
                    `AccessControl: account ${this.otherUser.address.toLowerCase()} is missing role ${
                        this.defaultAdminRole
                    }`
                );
        });

        it('should allow more than one user to have the default admin role', async function () {
            await expect(
                this.contract.grantRole(this.defaultAdminRole, this.otherUser.address)
            )
                .to.emit(this.contract, 'RoleGranted')
                .withArgs(this.defaultAdminRole, this.otherUser.address, this.owner.address);


            const defaultAdminUserCount = await this.contract.getRoleMemberCount(this.defaultAdminRole);
            const defaultAdminUsers = []; 

            for(let i = 0; i < defaultAdminUserCount; i++) {
                defaultAdminUsers.push(await this.contract.getRoleMember(this.defaultAdminRole, i));
            }

            expect(defaultAdminUsers).to.have.members([this.owner.address, this.otherUser.address]);
        });        
    });
});
