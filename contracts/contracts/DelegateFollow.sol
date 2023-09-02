// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract DelegateFollow {
    
    address public owner;

    // Struct for Delegate
    struct Delegate {
        bool isDelegate;
        uint256 followersCount;
        mapping(address => bool) followers;
    }

    // Mapping for DAO address -> Delegate address -> Delegate details
    mapping(address => mapping(address => Delegate)) public daoDelegates;

    // Events
    event Followed(address indexed follower, address indexed daoAddress, address indexed delegate);
    event Unfollowed(address indexed follower, address indexed daoAddress, address indexed delegate);

    constructor() {
        owner = msg.sender;  // Set the contract deployer as the owner
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    // Follow a delegate in a specific DAO
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

    // Unfollow a delegate in a specific DAO
    function unfollow(address daoAddress, address delegateAddress) external {
        Delegate storage delegateData = daoDelegates[daoAddress][delegateAddress];
        require(delegateData.followers[msg.sender], "Not following");
        
        delete delegateData.followers[msg.sender];
        delegateData.followersCount--;

        emit Unfollowed(msg.sender, daoAddress, delegateAddress);
    }
}
