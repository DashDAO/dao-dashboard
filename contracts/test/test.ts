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

  describe("Mark as Voted", function () {

    it("should mark a delegate as having voted", async function () {
      await dashboard.connect(owner).markDelegateAsVoted(daoAddress.address, delegate.address);
      const delegateData = await dashboard.daoDelegates(daoAddress.address, delegate.address);
      expect(delegateData.lastVotedTimestamp).to.not.equal(0);
    });

    it("should emit a DelegateVoted event when a delegate is marked as having voted", async function () {
      await expect(dashboard.connect(owner).markDelegateAsVoted(daoAddress.address, delegate.address))
        .to.emit(dashboard, "DelegateVoted")
        .withArgs(delegate.address, daoAddress.address);
    });

  });

  describe("Voting Deadline", function () {

    // This helper function helps to increase the EVM's time.
    async function increaseEVMTime(seconds) {
        await ethers.provider.send("evm_increaseTime", [seconds]);
        await ethers.provider.send("evm_mine", []);
    }

    it("should not emit NotVotedWithinDeadline event if there are more than 1 day until deadline (3 days scenario)", async function () {
      const threeDaysInSeconds = 3 * 24 * 60 * 60;
      const deadline = (await ethers.provider.getBlock()).timestamp + threeDaysInSeconds;

      // Set the voting time to be just more than 2 days from the current timestamp, so it doesn't fall into the 1-day window.
      await dashboard.connect(owner).markDelegateAsVoted(daoAddress.address, delegate.address);

      // Move the EVM's time 2 days ahead.
      await increaseEVMTime(2 * 24 * 60 * 60 - 100);  // 100 seconds less to be safe

      // Now there's just more than 1 day left to the deadline.
      await expect(dashboard.connect(owner).checkVotingStatus(daoAddress.address, delegate.address, deadline))
        .to.not.emit(dashboard, "NotVotedWithinDeadline");
    });

    it("should emit NotVotedWithinDeadline event if there's less than 1 day until deadline (12 hours scenario)", async function () {
      const twelveHoursInSeconds = 12 * 60 * 60;
      const deadline = (await ethers.provider.getBlock()).timestamp + twelveHoursInSeconds;

      // Move the EVM's time 12 hours ahead.
      await increaseEVMTime(12 * 60 * 60);

      // Now there's only 12 hours left to the deadline.
      await expect(dashboard.connect(owner).checkVotingStatus(daoAddress.address, delegate.address, deadline))
        .to.emit(dashboard, "NotVotedWithinDeadline")
        .withArgs(delegate.address, daoAddress.address);
        });
    });
});
