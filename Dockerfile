FROM debian:bullseye-slim AS prod

ENV CEDAR_VERSION=2.7.1

ENV NGINX_VERSION   1.23.4  
ENV NJS_VERSION     0.7.11
ENV PKG_RELEASE     1~bullseye 

RUN set -x \
# create nginx user/group first, to be consistent throughout docker variants
    && addgroup --system --gid 101 nginx \
    && adduser --system --disabled-login --ingroup nginx --no-create-home --home /nonexistent --gecos "nginx user" --shell /bin/false --uid 101 nginx \
    && apt-get update \
    && apt-get install --no-install-recommends --no-install-suggests -y gnupg1 ca-certificates \
    && \
    NGINX_GPGKEY=573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62; \
    NGINX_GPGKEY_PATH=/usr/share/keyrings/nginx-archive-keyring.gpg; \
    export GNUPGHOME="$(mktemp -d)"; \
    found=''; \
    for server in \
        hkp://keyserver.ubuntu.com:80 \
        pgp.mit.edu \
    ; do \
        echo "Fetching GPG key $NGINX_GPGKEY from $server"; \
        gpg1 --keyserver "$server" --keyserver-options timeout=10 --recv-keys "$NGINX_GPGKEY" && found=yes && break; \
    done; \
    test -z "$found" && echo >&2 "error: failed to fetch GPG key $NGINX_GPGKEY" && exit 1; \
    gpg1 --export "$NGINX_GPGKEY" > "$NGINX_GPGKEY_PATH" ; \
    rm -rf "$GNUPGHOME"; \
    apt-get remove --purge --auto-remove -y gnupg1 && rm -rf /var/lib/apt/lists/* \
    && dpkgArch="$(dpkg --print-architecture)" \
    && nginxPackages=" \
        nginx=${NGINX_VERSION}-${PKG_RELEASE} \
        nginx-module-xslt=${NGINX_VERSION}-${PKG_RELEASE} \
        nginx-module-geoip=${NGINX_VERSION}-${PKG_RELEASE} \
        nginx-module-image-filter=${NGINX_VERSION}-${PKG_RELEASE} \
        nginx-module-njs=${NGINX_VERSION}+${NJS_VERSION}-${PKG_RELEASE} \
    " \
    && case "$dpkgArch" in \
        amd64|arm64) \
# arches officialy built by upstream
            echo "deb [signed-by=$NGINX_GPGKEY_PATH] https://nginx.org/packages/mainline/debian/ bullseye nginx" >> /etc/apt/sources.list.d/nginx.list \
            && apt-get update \
            ;; \
        *) \
# we're on an architecture upstream doesn't officially build for
# let's build binaries from the published source packages
            echo "deb-src [signed-by=$NGINX_GPGKEY_PATH] https://nginx.org/packages/mainline/debian/ bullseye nginx" >> /etc/apt/sources.list.d/nginx.list \
            \
# new directory for storing sources and .deb files
            && tempDir="$(mktemp -d)" \
            && chmod 777 "$tempDir" \
# (777 to ensure APT's "_apt" user can access it too)
            \
# save list of currently-installed packages so build dependencies can be cleanly removed later
            && savedAptMark="$(apt-mark showmanual)" \
            \
# build .deb files from upstream's source packages (which are verified by apt-get)
            && apt-get update \
            && apt-get build-dep -y $nginxPackages \
            && ( \
                cd "$tempDir" \
                && DEB_BUILD_OPTIONS="nocheck parallel=$(nproc)" \
                    apt-get source --compile $nginxPackages \
            ) \
# we don't remove APT lists here because they get re-downloaded and removed later
            \
# reset apt-mark's "manual" list so that "purge --auto-remove" will remove all build dependencies
# (which is done after we install the built packages so we don't have to redownload any overlapping dependencies)
            && apt-mark showmanual | xargs apt-mark auto > /dev/null \
            && { [ -z "$savedAptMark" ] || apt-mark manual $savedAptMark; } \
            \
# create a temporary local APT repo to install from (so that dependency resolution can be handled by APT, as it should be)
            && ls -lAFh "$tempDir" \
            && ( cd "$tempDir" && dpkg-scanpackages . > Packages ) \
            && grep '^Package: ' "$tempDir/Packages" \
            && echo "deb [ trusted=yes ] file://$tempDir ./" > /etc/apt/sources.list.d/temp.list \
# work around the following APT issue by using "Acquire::GzipIndexes=false" (overriding "/etc/apt/apt.conf.d/docker-gzip-indexes")
#   Could not open file /var/lib/apt/lists/partial/_tmp_tmp.ODWljpQfkE_._Packages - open (13: Permission denied)
#   ...
#   E: Failed to fetch store:/var/lib/apt/lists/partial/_tmp_tmp.ODWljpQfkE_._Packages  Could not open file /var/lib/apt/lists/partial/_tmp_tmp.ODWljpQfkE_._Packages - open (13: Permission denied)
            && apt-get -o Acquire::GzipIndexes=false update \
            ;; \
    esac \
    \
    && apt-get install --no-install-recommends --no-install-suggests -y \
                        $nginxPackages \
                        gettext-base \
                        curl \
    && apt-get remove --purge --auto-remove -y && rm -rf /var/lib/apt/lists/* /etc/apt/sources.list.d/nginx.list \
    \
# if we have leftovers from building, let's purge them (including extra, unnecessary build deps)
    && if [ -n "$tempDir" ]; then \
        apt-get purge -y --auto-remove \
        && rm -rf "$tempDir" /etc/apt/sources.list.d/temp.list; \
    fi \
# forward request and error logs to docker log collector
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log \
# create a docker-entrypoint.d directory
    && mkdir /docker-entrypoint.d

#COPY docker-entrypoint.sh /
#COPY 10-listen-on-ipv6-by-default.sh /docker-entrypoint.d
#COPY 20-envsubst-on-templates.sh /docker-entrypoint.d
#COPY 30-tune-worker-processes.sh /docker-entrypoint.d

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

STOPSIGNAL SIGQUIT

#-------------------

ENV DEBIAN_FRONTEND noninteractive

USER root

# Update and install curl
RUN \
apt-get update && \
apt-get install -y apt-utils && \
apt-get install -y curl

# Install nodejs
RUN \
apt-get install -y gnupg2 && \
curl -sL https://deb.nodesource.com/setup_22.x | bash - && \
apt-get install -y nodejs && \
apt-get purge -y apt-transport-https && \
apt-get autoremove -y && \
apt-get clean all

ENV CEDAR_HOME /srv/cedar
ENV CEDAR_TEMPLATE_EDITOR_HOME ${CEDAR_HOME}/cedar-template-editor/

# Make CEDAR appplication home directory
RUN mkdir -p ${CEDAR_TEMPLATE_EDITOR_HOME}

# Make CEDAR home the default work directory
WORKDIR ${CEDAR_TEMPLATE_EDITOR_HOME}

ENV EDITOR_TARBALL cedar-template-editor-${CEDAR_VERSION}.tgz
ENV EDITOR_URI ${CEDAR_NPM_NEXUS_REPO}/cedar-template-editor/-/${EDITOR_TARBALL}

RUN echo ${EDITOR_URI}

# Download and extract the frontend source
# RUN \
# curl --fail --show-error --location --remote-name ${EDITOR_URI} && \
# tar --extract --file ${EDITOR_TARBALL} --directory ${CEDAR_TEMPLATE_EDITOR_HOME} --strip 1 && \
# rm ${EDITOR_TARBALL}

# Copy the entire application source code into the container
COPY . .

# Install dependencies
RUN \
npm install --production && \
npm install -g gulp-cli

# Add the entry point
ADD scripts/docker-entrypoint.sh /
# Add nginx config
ADD config/default.conf /etc/nginx/conf.d/

# Set env vars for the gulp task
ENV CEDAR_ANALYTICS_KEY="false" CEDAR_DATACITE_ENABLED="false" CEDAR_FRONTEND_BEHAVIOR="server" CEDAR_FRONTEND_TARGET="local" CEDAR_VERSION_MODIFIER="" CEDAR_FRONTEND_local_USER1_LOGIN="" CEDAR_FRONTEND_local_USER1_PASSWORD="" CEDAR_FRONTEND_local_USER1_NAME="" CEDAR_FRONTEND_local_USER2_LOGIN="" CEDAR_FRONTEND_local_USER2_PASSWORD="" CEDAR_FRONTEND_local_USER2_NAME=""

# Set up log folder
ENV LOGDIR /log
RUN mkdir -p "$LOGDIR"
VOLUME $LOGDIR

EXPOSE 80

CMD ["bash", "-c", "node api/src/index.js & nginx && wait"]

ENTRYPOINT [ "/docker-entrypoint.sh" ]

#######################################################################################################################
#######################################################################################################################
#######################################################################################################################

FROM prod AS dev

# Define build arguments
ARG UID
ARG GID
ARG USER

ENV CEDAR_HOST $HOSTNAME
ENV CEDAR_FRONTEND_BEHAVIOR="develop"

# Install Vim, Git and other necessary packages
RUN apt-get update && apt-get install -y vim git sudo htop procps

# Install dev dependencies
RUN npm install

# Create the user and group and add sudo to it just in case it needs it
RUN groupadd -g $GID $USER \
    # without the --no-log-init flag the image size goes to 525GB
    && useradd -u $UID -g $GID -m --no-log-init $USER \ 
    && echo "$USER ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Switch to user
USER $USER

# Set Bash as the default shell
SHELL ["/bin/bash", "-c"]

# Add ll alias in the .bashrc
RUN echo "alias ll='ls -lsatr'" >> ~/.bashrc

