# ChatAlly

ChatAlly empowers small organizations and communities to deploy their own chatbots affordably and GDPR-compliant. While there may seem to be open-source or free platforms at first glance, the quotas of free offerings are severely limited, and open-source typically only refers to the Software Development Kit (SDK). Data control usually lies with the platform providers.

While there are FOSS alternatives such as frameworks and libraries for chatbots, they are complex to set up and do not support seamless integration with popular messenger clients. With ChatAlly, our aim is to bring these components together into a plug-and-play solution that can be easily self-hosted.

## Overview

Detailed documentation and descriptions of examples and much more can be found at [chatally.org](https://chatally.org).

All code for the documentation website can be found in [app/docs](https://github.com/chatally/chatally/tree/main/apps/docs).

The source for the different modules (npm packages) can be found in [packages](https://github.com/chatally/chatally/tree/main/packages).

Installable packages are deployed to [npmjs.com](https://www.npmjs.com/search?q=%40chatally).

## Contribute

We welcome contributions from everyone, regardless of their level of experience. If you're looking to contribute, the easiest way is by opening a well written [issue](https://github.com/chatally/chatally/issues).

If you want to contribute by coding, start by forking the repository, making your changes, and then submitting a pull request. Please ensure that your code adheres to our coding standards and includes appropriate tests. If you're unsure about anything or need guidance, feel free to open an issue to discuss your ideas or ask for help. We appreciate your interest in improving our project and look forward to your contributions!

### Changesets

We follow semantic versioning and use `changesets` to manage version bumping and releases. Use the command

```sh
npm run changeset:add
```

to provide a changeset.
