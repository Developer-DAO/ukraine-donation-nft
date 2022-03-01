// test/Box.test.js
const { expect, use } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Box", function() {
  before(async function() {
    this.Box = await ethers.getContractFactory("Box");

    const [owner, addr1] = await ethers.getSigners();
    this.owner = owner;
    this.otherUser = addr1;
  });

  beforeEach(async function() {
    this.box = await this.Box.deploy();
    await this.box.deployed();
  });

  it("retrieve returns a value previously stored", async function() {
    await this.box.store(42);
    const retrievedValue = (await this.box.retrieve()).toString();

    expect(retrievedValue).to.equal("42");
  });

  it("store emits an event", async function() {
    await expect(this.box.store(1234))
      .to.emit(this.box, "ValueChanged")
      .withArgs(1234);
  });

  it("non-owner cannot store a value", async function() {
    await expect(
      this.box.connect(this.otherUser).store(1234)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
