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
    mapping(uint256 => bool) public supportedChains;

    // Events
    event Followed(address indexed follower, address indexed daoAddress, address indexed delegate);
    event Unfollowed(address indexed follower, address indexed daoAddress, address indexed delegate);

  
    constructor() {
        owner = msg.sender;  // Set the contract deployer as the owner
        supportedChains[5001] = true;   // Initialized with mantle testnet
        supportedChains[44787] = true;  // Initialized with celo testnet
    }

    modifier onlySupportedChain(uint256 chainId) {
        require(supportedChains[chainId], "Chain not supported");
        _;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    // Add new supported chain
    function addSupportedChain(uint256 chainId) external onlyOwner {
        supportedChains[chainId] = true;
    }

    // Remove a supported chain
    function removeSupportedChain(uint256 chainId) external onlyOwner {
        delete supportedChains[chainId];
    }

    // Follow a delegate in a specific DAO on a specific chain
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

    // Unfollow a delegate in a specific DAO on a specific chain
    function unfollow(address daoAddress, address delegateAddress, uint256 chainId) external onlySupportedChain(chainId) {
        Delegate storage delegateData = daoDelegates[daoAddress][delegateAddress];
        require(delegateData.followers[msg.sender], "Not following");
        
        delete delegateData.followers[msg.sender];
        delegateData.followersCount--;

        emit Unfollowed(msg.sender, daoAddress, delegateAddress);
    }
}
