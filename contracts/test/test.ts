import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";

describe("DelegateFollow", function() {
    let delegateFollow: Contract;
    let owner: Signer, daoAddress: Signer, delegateAddress1: Signer, delegateAddress2: Signer, follower: Signer;

    beforeEach(async () => {
        const DelegateFollow = await ethers.getContractFactory("DelegateFollow");
        [owner, daoAddress, delegateAddress1, delegateAddress2, follower] = await ethers.getSigners();
        
        delegateFollow = await DelegateFollow.deploy();
    });

    describe("Follow", function() {
        it("Should allow users to follow delegates", async function() {
            await delegateFollow.connect(follower).follow(daoAddress.address, delegateAddress1.address);
            
            const delegateData = await delegateFollow.daoDelegates(daoAddress.address, delegateAddress1.address);
            expect(delegateData.followersCount).to.equal(1);
        });

        it("Should not allow users to follow the same delegate twice", async function() {
            await delegateFollow.connect(follower).follow(daoAddress.address, delegateAddress1.address);
            await expect(delegateFollow.connect(follower).follow(daoAddress.address, delegateAddress1.address)).to.be.revertedWith("Already following");
        });

        it("Should emit the Followed event correctly", async function() {
            await expect(delegateFollow.connect(follower).follow(daoAddress.address, delegateAddress1.address))
                .to.emit(delegateFollow, 'Followed')
                .withArgs(follower.address, daoAddress.address, delegateAddress1.address);
        });
    });

    describe("Unfollow", function() {
        beforeEach(async () => {
            await delegateFollow.connect(follower).follow(daoAddress.address, delegateAddress1.address);
        });

        it("Should allow users to unfollow delegates", async function() {
            await delegateFollow.connect(follower).unfollow(daoAddress.address, delegateAddress1.address);
            
            const delegateData = await delegateFollow.daoDelegates(daoAddress.address, delegateAddress1.address);
            expect(delegateData.followersCount).to.equal(0);
        });

        it("Should not allow users to unfollow delegates they aren't following", async function() {
            await expect(delegateFollow.connect(follower).unfollow(daoAddress.address, delegateAddress2.address)).to.be.revertedWith("Not following");
        });

        it("Should emit the Unfollowed event correctly", async function() {
            await expect(delegateFollow.connect(follower).unfollow(daoAddress.address, delegateAddress1.address))
                .to.emit(delegateFollow, 'Unfollowed')
                .withArgs(follower.address, daoAddress.address, delegateAddress1.address);
        });
    });
});
