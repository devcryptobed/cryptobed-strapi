# 🌟 CryptoBed Project README 🌟

### Motivation 🚀

Our aim was to swiftly create a Minimum Viable Product (MVP) to validate the concept of a decentralized platform for temporary rentals.

To achieve this, several things had to happen. Primarily, it wasn't feasible to build everything from scratch. We needed a basic admin panel for CRUD operations, but also had to maintain minimum security standards, role control, and the potential for future email notifications. Economically, it wasn't viable to have microservices to separate responsibilities.

For these reasons, and having used it in other ventures, we chose Strapi in its version 4. This enabled us to address many of the initial requirements for testing.

However, it didn't magically cover all our needs. Our main challenge was Authentication. Strapi offers integration with multiple authentication providers for web 2.0, but we needed a Login/Register feature with wallet integration. This required users to sign a challenge with their wallet, which we then validated on our backend to generate a user and a JWT Token.

After researching available plugins, we created a custom version of a beta plugin for wallet-based user authentication.

The second issue was managing Escrow for user bookings. Ideally, this should be decentralized through a smart contract. However, with limited budget and expertise, and considering the costs of audits, blockchain nodes, transaction fees, etc., we opted for a custodial approach using TATUM for creating virtual user accounts, aiming to minimize transaction costs. We customized some Strapi endpoints and created cron jobs to release user funds. Our goal is to eventually migrate this to a smart contract.

Currently, we operate on the Ethereum Mainnet, considering a shift to Polygon for lower fees. Although custodial, Tatum operates on the blockchain, with operations impacting the chain only when releasing funds, which helped us overcome our lack of smart contract knowledge while retaining some control over funds. We understand this is a drawback for the community and our goal of being fully decentralized, but we're still in the phase of validating the idea and refining user experience.

After launching a very beta version 1.0, we received high-quality feedback, with many offering to contribute by improving code or testing features.

This led us to discuss with industry entrepreneurs, concluding that making our project open source was the best way to ensure transparency. Since we were already using technologies with an open-source approach, we decided to take this path.

We believe our Open Source project is still a work in progress (WIP), but we're confident in building a community with all who wish to contribute, helping us understand the right contribution policies and processes for the project.

We chose a GNU license as we believe it fits our needs.

### Next Steps 🛠️

- Integrate automated Kleros solutions for mediations (0%)
- Create high-quality technical documentation for clear code understanding (0%)
- Initially, develop unit tests for custom logic on Strapi for booking and Escrow management (0%)
- Migrate to a less costly chain, with most work already facilitated by our provider TATUM (70%)
- Isolate Escrow logic to later migrate to a microservices architecture (0%)
- Implement notifications for Guests and Hosts, initially via email (open to other methods) (0%)
- Clean up unnecessary collections and fields created during development (80%)
- Analyze and identify business logic parts that can be moved on-chain, possibly splitting into multiple smart contracts (0%)

### FAQ ❓

- How can I contribute?

We've prepared a contribution guide based on standard GitHub open-source repository workflows. We use GitHub's issue tracker, but we invite you to contact us directly to understand how you can contribute.

[Mail CryptoBed Dev](dev@cryptobed.xyz)

- What communication channels do you use?

Currently, we use Telegram. Write to us, and we can add you to our community [Mail CryptoBed Dev](dev@cryptobed.xyz)

Code Owners:

@devcryptobed @lciucini

# 🚀 Getting Started with Strapi

Strapi comes with a full-featured [Command Line Interface (CLI)](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html) which lets you scaffold and manage your project in seconds.

## `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-develop)

Prerequisites:

- Node JS 18
- NVM Node version manager (Optional)

* Install dependencies

```
yarn
```

- Run dev mode

```
yarn dev
```
