ARG VARIANT=lts
FROM node:${VARIANT}

USER root

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#    && apt-get -y install --no-install-recommends <your-package-list-here>

ARG NPM_PACKAGES=""
RUN npm cache clean --force > /dev/null 2>&1 \
    && npm install -g npm@latest ${NPM_PACKAGES} \
    && npm cache clean --force > /dev/null 2>&1

USER node
