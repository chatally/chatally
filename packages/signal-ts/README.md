```sh
docker run -d \
  --name signal-cli \
  --publish 7583:7583 \
  --volume /some/local/dir/signal-cli-config:/var/lib/signal-cli \
  --tmpfs /tmp:exec \
  registry.gitlab.com/packaging/signal-cli/signal-cli-native:latest \
  daemon --tcp 0.0.0.0:7583
```

`-native:` could be replaced with `-jre:` in the above snippet for the JRE variant.
