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
    it("should successfully increment tokenId, mint tokens 1 and 2, and emit events", async function() {
      await expect(
        this.contract.mint({
          value: ethers.utils.parseEther("12"),
        })
      )
        .to.emit(this.contract, "LogTokenMinted")
        .withArgs(this.owner.address, 1, "bronze");

      await expect(await this.contract.ownerOf(1)).to.equal(this.owner.address);

      await expect(
        this.contract.mint({
          value: ethers.utils.parseEther("12"),
        })
      )
        .to.emit(this.contract, "LogTokenMinted")
        .withArgs(this.owner.address, 2, "bronze");

      await expect(await this.contract.ownerOf(2)).to.equal(this.owner.address);
    });

    it("should not mint if value is below the minimumMintPrice", async function() {
      await expect(
        this.contract.mint({ value: ethers.utils.parseEther("1") })
      ).to.be.revertedWith("Not enough MATIC sent");
    });

    it("should have donationType == BRONZE", async function() {
      await expect(
        this.contract.mint({
          value: ethers.utils.parseEther("25"),
        })
      )
        .to.emit(this.contract, "LogTokenMinted")
        .withArgs(this.owner.address, 1, "bronze");

      await expect(await this.contract.tokenURI(1)).to.equal(
        "ipfs://abcd.../bronze"
      );
    });

    it("should have donationType == SILVER", async function() {
      await expect(
        this.contract.mint({
          value: ethers.utils.parseEther("50"),
        })
      )
        .to.emit(this.contract, "LogTokenMinted")
        .withArgs(this.owner.address, 1, "silver");

      await expect(await this.contract.tokenURI(1)).to.equal(
        "ipfs://abcd.../silver"
      );
    });

    it("should have donationType == GOLD", async function() {
      await expect(
        this.contract.mint({
          value: ethers.utils.parseEther("100"),
        })
      )
        .to.emit(this.contract, "LogTokenMinted")
        .withArgs(this.owner.address, 1, "gold");

      await expect(await this.contract.tokenURI(1)).to.equal(
        "ipfs://abcd.../gold"
      );
    });

    it("should have donationType == DIAMOND", async function() {
      await expect(
        this.contract.mint({
          value: ethers.utils.parseEther("500"),
        })
      )
        .to.emit(this.contract, "LogTokenMinted")
        .withArgs(this.owner.address, 1, "diamond");

      await expect(await this.contract.tokenURI(1)).to.equal(
        "ipfs://abcd.../diamond"
      );
    });

    it("should have donationType == PLATINUM", async function() {
      await expect(
        this.contract.mint({
          value: ethers.utils.parseEther("1000"),
        })
      )
        .to.emit(this.contract, "LogTokenMinted")
        .withArgs(this.owner.address, 1, "platinum");

      await expect(await this.contract.tokenURI(1)).to.equal(
        "ipfs://abcd.../platinum"
      );
    });

    it("should ensure each mint has its own tokenURI (and does not share one at contract level)", async function() {
      // Fixes https://github.com/Developer-DAO/ukraine-donation-nft/issues/16
      // where the donationType was being saved at contract level
      // so each mint would change the tokenURI for everybody.
      // This test mints two tokens, then checks to make sure first token
      // didn't lose its tokenURI.

      // mint first one
      await expect(
        this.contract.mint({
          value: ethers.utils.parseEther("1000"),
        })
      )
        .to.emit(this.contract, "LogTokenMinted")
        .withArgs(this.owner.address, 1, "platinum");

      await expect(await this.contract.tokenURI(1)).to.equal(
        "ipfs://abcd.../platinum"
      );

      // mint second one
      await expect(
        this.contract.mint({
          value: ethers.utils.parseEther("12"),
        })
      )
        .to.emit(this.contract, "LogTokenMinted")
        .withArgs(this.owner.address, 2, "bronze");

      await expect(await this.contract.tokenURI(2)).to.equal(
        "ipfs://abcd.../bronze"
      );

      // ensure URI for first token is still correct
      await expect(await this.contract.tokenURI(1)).to.equal(
        "ipfs://abcd.../platinum"
      );
    });
    
    it("should mint if contractState is true", async function() { 
      await expect(await this.contract.contractState()).to.equal(true);

      await expect(
        this.contract.mint({
          value: ethers.utils.parseEther("12"),
        })
      )
        .to.emit(this.contract, "LogTokenMinted")
        .withArgs(this.owner.address, 1, "bronze");

      await expect(await this.contract.ownerOf(1)).to.equal(
        this.owner.address
      );
    });

    it("should fail mint if contractState is false", async function() { 
      await expect(await this.contract.contractState()).to.equal(true);

      await expect(this.contract.switchContractState())
      .to.emit(this.contract, "ContractStateUpdated")
      .withArgs(true, false);

      await expect(await this.contract.contractState()).to.equal(false);

      await expect(
        this.contract.mint({
          value: ethers.utils.parseEther("12"),
        })
      ).to.be.revertedWith("Contract must be active to mint");

    });

  });

  describe("when withdrawing", function() {
    it("should withdraw as owner", async function() {
      await expect(
        this.contract.mint({
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
        this.contract.mint({
          value: ethers.utils.parseEther("12"),
        })
      );

      await expect(
        this.contract.connect(this.otherUser).withdraw()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });


  describe("when switching contract state", function() {
    it("should change as owner", async function() {
      await expect(await this.contract.contractState()).to.equal(true);

      await expect(this.contract.switchContractState())
      .to.emit(this.contract, "ContractStateUpdated")
      .withArgs(true, false);

      await expect(await this.contract.contractState()).to.equal(false);
    });

    it("should fail change if not owner", async function() {
      await expect(await this.contract.contractState()).to.equal(true);

      await expect(
        this.contract.connect(this.otherUser).switchContractState()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
