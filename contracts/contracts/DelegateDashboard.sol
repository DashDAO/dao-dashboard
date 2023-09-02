// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract DelegateFollow {
    address public owner;

    mapping(address => mapping(address => bool)) private followers;

    // Events
    event Followed(address indexed follower, address indexed delegate);
    event Unfollowed(address indexed follower, address indexed delegate);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function follow(address delegateAddress) external {
        require(delegateAddress != address(0), "Invalid delegate address");
        require(delegateAddress != msg.sender, "Cannot follow yourself");
        require(!followers[msg.sender][delegateAddress], "Already following");

        followers[msg.sender][delegateAddress] = true;
        emit Followed(msg.sender, delegateAddress);
    }

    function unfollow(address delegateAddress) external {
        require(delegateAddress != address(0), "Invalid delegate address");
        require(delegateAddress != msg.sender, "Cannot unfollow yourself");
        require(followers[msg.sender][delegateAddress], "Not following");

        followers[msg.sender][delegateAddress] = false;
        emit Unfollowed(msg.sender, delegateAddress);
    }

    function isFollowing(address follower, address delegateAddress) external view returns (bool) {
        return followers[follower][delegateAddress];
    }
}
