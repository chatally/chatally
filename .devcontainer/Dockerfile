ARG ALPINE_VERSION=3.18
ARG NODE_VERSION=21

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION}

RUN node --version

# [Option] Install zsh
ARG INSTALL_ZSH="true"

# Install needed packages and setup non-root user. 
COPY library-scripts/*.sh library-scripts/*.env /tmp/library-scripts/
RUN apk update && ash /tmp/library-scripts/common-alpine.sh "${INSTALL_ZSH}" "${USERNAME}" "${USER_UID}" "${USER_GID}" \
    && rm -rf /tmp/library-scripts

#Use a separate RUN statement to add your own dependencies.
# ** [Optional] Uncomment this section to install additional packages. **
# RUN apk update \
#     && apk add --no-cache <your-package-list-here>

# Install some global NPM packages for DevOps scripts
# (tsx, commander, listr, ...)
ARG NPM_PACKAGES=
RUN npm install -g ${NPM_PACKAGES}
