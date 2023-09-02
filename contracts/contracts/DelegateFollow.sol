// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Interface for potential interactions with DAO voting systems (to be implemented as needed)
interface IGoverner {
    // Placeholder for potential functions you'd want to interact with
    // e.g., function getVoteTimestamp(address delegateAddress) external view returns (uint256);
}

contract DelegateFollow {
    
    address public owner;

    // Struct for Delegate
    struct Delegate {
        bool isDelegate;
        uint256 followersCount;
        uint256 lastVotedTimestamp;
        mapping(address => bool) followers;
    }

    // Mapping for DAO address -> Delegate address -> Delegate details
    mapping(address => mapping(address => Delegate)) public daoDelegates;

    // Events
    event Followed(address indexed follower, address indexed daoAddress, address indexed delegate);
    event Unfollowed(address indexed follower, address indexed daoAddress, address indexed delegate);
    event Voted(address indexed delegate, address indexed daoAddress);
    event NotVotedWithinDeadline(address indexed delegate, address indexed daoAddress);

    constructor() {
        owner = msg.sender;  // Set the contract deployer as the owner
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function follow(address daoAddress, address delegateAddress) external {
        Delegate storage delegateData = daoDelegates[daoAddress][delegateAddress];
        require(!delegateData.followers[msg.sender], "Already following");

        if (!delegateData.isDelegate) {
            delegateData.isDelegate = true;
        }

        delegateData.followers[msg.sender] = true;
        delegateData.followersCount++;

        emit Followed(msg.sender, daoAddress, delegateAddress);
    }

    function unfollow(address daoAddress, address delegateAddress) external {
        Delegate storage delegateData = daoDelegates[daoAddress][delegateAddress];
        require(delegateData.followers[msg.sender], "Not following");
        
        delete delegateData.followers[msg.sender];
        delegateData.followersCount--;

        emit Unfollowed(msg.sender, daoAddress, delegateAddress);
    }

    function setVotedTimestamp(address daoAddress, address delegateAddress, uint256 timestamp) external onlyOwner {
        Delegate storage delegateData = daoDelegates[daoAddress][delegateAddress];
        require(delegateData.isDelegate, "Not a delegate");

        delegateData.lastVotedTimestamp = timestamp;

        emit Voted(delegateAddress, daoAddress);
    }

    function checkVotingStatus(address daoAddress, address delegateAddress, uint256 deadlineTimestamp) external {
        Delegate storage delegateData = daoDelegates[daoAddress][delegateAddress];
        require(delegateData.isDelegate, "Not a delegate");
        
        uint256 oneDay = 1 days;
        if (block.timestamp >= deadlineTimestamp - oneDay && delegateData.lastVotedTimestamp < deadlineTimestamp - oneDay) {
            emit NotVotedWithinDeadline(delegateAddress, daoAddress);
        }
    }
}
