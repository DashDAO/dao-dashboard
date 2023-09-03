“Made during ETHWarsaw 2023 hackathon”

# dao-dashboard

Better visibility for your DAOs, your Votes and your Delegates

# The problem

Delegations are our only hope of making crypto work. To build new systems we need participation, and delegation is the best way of getting it.

The problem is delegation sucks.

Users have no way to track their delegations nor what the delegates are doing. Information is spread all over. Decision making is complex and overwhelming. UX of most tools and interfaces is very bad.

# The solution

DashDao is a tracking and alert system for delegations. Users are able to see clear and relevant DAO and delegate information, follow the delegates they want to watch closely and receive alerts related to delegate participation.

By giving the users tools to see which delegates are more active, we create a "Darwin effect". Less active delegates will lose their delegations to more active delegates and overall governance participation will therefore increase.

Additionally, it helps users pick delegates they are more aligned with, improving their sense of beloning and consecuently community engagement.

# How it's built

We used nextJS, snapshot APIs, smart contracts to store follow information on-chain and PUSH protocol to send alerts.

We used smart contracts on different chains, including Mantle, Celo and Aleph Zero, to be able to save the follow/unfollow information that we need to build users profiles and send notification. The key innovation of saving this info through onchain logs instead of using a centralized database is that we allow anyone to take the code and fork it for their own DAOs and data needs. Our application is 100% serverless which means it doesn't depend on us and can easily be replicated or made better.

# Team members

- Giulio de Cadilhac
- Santiago Cristobal
- Bertan Kofon
- Marcus Pang Yu Yang
- Kacper Karbownik

# Bounties hunted

- ETHWarsaw Foundation
- Mantle - Build on Mantle (Pool bounty)
- Mantle - Best UX
- AZERO.ID - Integration of AZERO.ID
- Aleph Zero - Tooling/Infrastructure - Create Developer/Infrastructure Tooling for the Aleph Zero Ecosystem
- Celo Foundation

# Relevant links

Presentation: [https://docs.google.com/presentation/d/1Zy4U8UU6ElQneNqQRJyV5edMNFlPSj2sKDVRn78vY40/edit?usp=sharing](https://docs.google.com/presentation/d/1tP3yIemoTnKHdR_74WdTxpG80uu8hxg2Pe1J7A_h_Vg/edit?usp=sharing)

Demo:
https://www.youtube.com/watch?v=d9XXHUQZIgw&ab_channel=SantiagoCristobal
