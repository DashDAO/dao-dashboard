// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DelegateFollow {

    struct Delegate {
        bool isDelegate;
        uint256 followersCount;
        mapping(address => bool) followers;
    }

    mapping(address => mapping(address => Delegate)) public daoDelegates;  // DAO address -> Delegate address -> Delegate details
    mapping(uint256 => bool) public supportedChains;

    event Followed(address indexed follower, address indexed daoAddress, address indexed delegate);
    event Unfollowed(address indexed follower, address indexed daoAddress, address indexed delegate);

    constructor() {
        // Initializing with chain IDs 5001 and 44787 as supported - mantle and celo testnets, we can add more
        supportedChains[5001] = true;
        supportedChains[44787] = true;
    }

    modifier onlySupportedChain(uint256 chainId) {
        require(supportedChains[chainId], "Chain not supported");
        _;
    }

    function follow(address daoAddress, address delegateAddress, uint256 chainId) external onlySupportedChain(chainId) {
        Delegate storage delegateData = daoDelegates[daoAddress][delegateAddress];
        require(!delegateData.followers[msg.sender], "Already following");

        if (!delegateData.isDelegate) {
            delegateData.isDelegate = true;
        }

        delegateData.followers[msg.sender] = true;
        delegateData.followersCount++;

        emit Followed(msg.sender, daoAddress, delegateAddress);
    }

    function unfollow(address daoAddress, address delegateAddress, uint256 chainId) external onlySupportedChain(chainId) {
        Delegate storage delegateData = daoDelegates[daoAddress][delegateAddress];
        require(delegateData.followers[msg.sender], "Not following");

        delegateData.followers[msg.sender] = false;
        delegateData.followersCount--;

        emit Unfollowed(msg.sender, daoAddress, delegateAddress);
    }
}
