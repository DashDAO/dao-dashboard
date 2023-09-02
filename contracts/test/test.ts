const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("DelegateFollow", function () {
  let owner, delegate, follower1, follower2, dashboard;

  beforeEach(async function () {
    // Deploy the contract
    const DelegateFollow = await ethers.getContractFactory("DelegateFollow");
    dashboard = await DelegateFollow.deploy();

    // Get accounts
    [owner, delegate, follower1, follower2] = await ethers.getSigners();
  });

  describe("Follow & Unfollow", function () {

    it("should allow a user to follow a delegate", async function () {
      await dashboard.connect(follower1).follow(delegate.address);
      const isFollower1Following = await dashboard.isFollowing(follower1.address, delegate.address);
      expect(isFollower1Following).to.be.true;
    });

    it("should emit a Followed event when a user follows a delegate", async function () {
      await expect(dashboard.connect(follower1).follow(delegate.address))
        .to.emit(dashboard, "Followed")
        .withArgs(follower1.address, delegate.address);
    });

    it("should allow a user to unfollow a delegate", async function () {
      await dashboard.connect(follower1).follow(delegate.address);
      await dashboard.connect(follower1).unfollow(delegate.address);
      const isFollower1Following = await dashboard.isFollowing(follower1.address, delegate.address);
      expect(isFollower1Following).to.be.false;
    });

    it("should emit an Unfollowed event when a user unfollows a delegate", async function () {
      await dashboard.connect(follower1).follow(delegate.address);
      await expect(dashboard.connect(follower1).unfollow(delegate.address))
        .to.emit(dashboard, "Unfollowed")
        .withArgs(follower1.address, delegate.address);
    });

    it("should not allow a user to unfollow if not following", async function () {
      await expect(dashboard.connect(follower1).unfollow(delegate.address))
        .to.be.revertedWith("Not following");
    });
  });
});
