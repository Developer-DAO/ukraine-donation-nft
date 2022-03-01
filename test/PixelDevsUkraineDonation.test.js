// test/PixelDevsUkraineDonation.test.js
const { expect, use } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("PixelDevsUkraineDonation", function() {
  before(async function() {
    this.Donation = await ethers.getContractFactory("PixelDevsUkraineDonation");

    const [owner, addr1] = await ethers.getSigners();
    this.owner = owner;
    this.otherUser = addr1;
  });

  beforeEach(async function() {
    this.donation = await this.Donation.deploy();
    await this.donation.deployed();
  });

  it("successful mint emits an event", async function() {
    await expect(
      this.donation.mint(1234, {
        value: ethers.utils.parseEther("12"),
      })
    )
      .to.emit(this.donation, "LogTokenMinted")
      .withArgs(this.owner.address, 1234);
  });

  it("should not mint if value is below the minimum", async function() {
    await expect(
      this.donation.mint(1111, { value: ethers.utils.parseEther("1") })
    ).to.be.revertedWith("Not enough MATIC sent");
  });
});
