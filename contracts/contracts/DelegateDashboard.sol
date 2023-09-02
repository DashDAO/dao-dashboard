// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract DelegateDashboard {
    address public owner;

    struct Delegate {
        mapping(address => bool) followers;
        uint256 lastVotedTimestamp;
    }

    mapping(address => mapping(address => Delegate)) public daoDelegates;

    // Events
    event Followed(address indexed follower, address indexed daoAddress, address indexed delegateAddress);
    event Unfollowed(address indexed follower, address indexed daoAddress, address indexed delegateAddress);
    event DelegateVoted(address indexed delegateAddress, address indexed daoAddress);
    event NotVotedWithinDeadline(address indexed delegateAddress, address indexed daoAddress);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function follow(address daoAddress, address delegateAddress) external {
        Delegate storage delegateData = daoDelegates[daoAddress][delegateAddress];
        require(!delegateData.followers[msg.sender], "Already following");
        delegateData.followers[msg.sender] = true;
        emit Followed(msg.sender, daoAddress, delegateAddress);
    }

    function unfollow(address daoAddress, address delegateAddress) external {
        Delegate storage delegateData = daoDelegates[daoAddress][delegateAddress];
        require(delegateData.followers[msg.sender], "Not following");
        delete delegateData.followers[msg.sender];
        emit Unfollowed(msg.sender, daoAddress, delegateAddress);
    }
    
    function isFollowing(address daoAddress, address delegateAddress, address follower) external view returns (bool) {
        return daoDelegates[daoAddress][delegateAddress].followers[follower];
    }


    function markDelegateAsVoted(address daoAddress, address delegateAddress) external {
        // Consider modifying this to not be onlyOwner if other entities need to call this.
        Delegate storage delegateData = daoDelegates[daoAddress][delegateAddress];
        delegateData.lastVotedTimestamp = block.timestamp;
        emit DelegateVoted(delegateAddress, daoAddress);
    }

    function checkVotingStatus(address daoAddress, address delegateAddress, uint256 deadlineTimestamp) external onlyOwner {
        Delegate storage delegateData = daoDelegates[daoAddress][delegateAddress];
        uint256 oneDay = 1 days;
        if (block.timestamp >= deadlineTimestamp - oneDay && delegateData.lastVotedTimestamp < deadlineTimestamp - oneDay) {
            emit NotVotedWithinDeadline(delegateAddress, daoAddress);
        }
    }
}
