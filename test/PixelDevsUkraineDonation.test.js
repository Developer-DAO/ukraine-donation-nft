// test/PixelDevsUkraineDonation.test.js
const { expect, use } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("PixelDevsUkraineDonation", function() {
  before(async function() {
    this.Contract = await ethers.getContractFactory("PixelDevsUkraineDonation");

    const [owner, addr1] = await ethers.getSigners();
    this.owner = owner;
    this.otherUser = addr1;
  });

  beforeEach(async function() {
    this.contract = await this.Contract.deploy();
    await this.contract.deployed();
  });

  describe("when setting properties", function() {
    it("should successfully setBaseURI and emit event", async function() {
      const newURI = "ipfs://testuri";

      await expect(this.contract.setBaseURI(newURI))
        .to.emit(this.contract, "BaseURIUpdated")
        .withArgs("ipfs://abcd.../", newURI);

      await expect(await this.contract.baseURI()).to.equal(newURI);
    });

    it("should successfully setMinimumMintPrice and emit event", async function() {
      const newPrice = ethers.utils.parseEther("100");

      await expect(this.contract.setMinimumMintPrice(newPrice))
        .to.emit(this.contract, "MinimumMintPriceUpdated")
        .withArgs(ethers.utils.parseEther("12"), newPrice);

      await expect(await this.contract.minimumMintPrice()).to.equal(newPrice);
    });
  });

  describe("when minting", async function() {
    it("should successfully mint and emit event", async function() {
      await expect(
        this.contract.mint(1234, {
          value: ethers.utils.parseEther("12"),
        })
      )
        .to.emit(this.contract, "LogTokenMinted")
        .withArgs(this.owner.address, 1234);

      await expect(await this.contract.ownerOf(1234)).to.equal(
        this.owner.address
      );
    });

    it("should not mint if value is below the minimumMintPrice", async function() {
      await expect(
        this.contract.mint(1111, { value: ethers.utils.parseEther("1") })
      ).to.be.revertedWith("Not enough MATIC sent");
    });
  });

  describe("when withdrawing", function() {
    it("should withdraw as owner", async function() {
      await expect(
        this.contract.mint(1234, {
          value: ethers.utils.parseEther("12"),
        })
      );

      const balanceBefore = await ethers.provider.getBalance(
        this.owner.address
      );
      const w = await this.contract.withdraw();
      const balanceAfter = await ethers.provider.getBalance(this.owner.address);

      // should be close to 12 MATIC (12 - gas fees)
      await expect(
        balanceAfter.sub(balanceBefore).gt(ethers.utils.parseEther("11"))
      ).to.be.true;
    });

    it("should fail withdraw if not owner", async function() {
      await expect(
        this.contract.mint(1234, {
          value: ethers.utils.parseEther("12"),
        })
      );

      await expect(
        this.contract.connect(this.otherUser).withdraw()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
