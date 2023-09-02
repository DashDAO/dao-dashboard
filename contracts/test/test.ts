const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("DelegateDashboard", function () {
  let owner, daoAddress, delegate, follower1, follower2, dashboard;

  beforeEach(async function () {
    // Deploy the contract
    const DelegateDashboard = await ethers.getContractFactory("DelegateDashboard");
    dashboard = await DelegateDashboard.deploy();

    // Get accounts
    [owner, daoAddress, delegate, follower1, follower2] = await ethers.getSigners();
  });

  describe("Follow & Unfollow", function () {

    it("should allow a user to follow a delegate", async function () {
      await dashboard.connect(follower1).follow(daoAddress.address, delegate.address);
      const isFollower1Following = await dashboard.isFollowing(daoAddress.address, delegate.address, follower1.address);
      expect(isFollower1Following).to.be.true;
    });

    it("should emit a Followed event when a user follows a delegate", async function () {
      await expect(dashboard.connect(follower1).follow(daoAddress.address, delegate.address))
        .to.emit(dashboard, "Followed")
        .withArgs(follower1.address, daoAddress.address, delegate.address);
    });

    it("should allow a user to unfollow a delegate", async function () {
      await dashboard.connect(follower1).follow(daoAddress.address, delegate.address);
      await dashboard.connect(follower1).unfollow(daoAddress.address, delegate.address);
      const isFollower1Following = await dashboard.isFollowing(daoAddress.address, delegate.address, follower1.address);
      expect(isFollower1Following).to.be.false;
    });

    it("should emit an Unfollowed event when a user unfollows a delegate", async function () {
      await dashboard.connect(follower1).follow(daoAddress.address, delegate.address);
      await expect(dashboard.connect(follower1).unfollow(daoAddress.address, delegate.address))
        .to.emit(dashboard, "Unfollowed")
        .withArgs(follower1.address, daoAddress.address, delegate.address);
    });
  });
});
