## Gitlab Download

Download Gitlab Repository using Gitlab Private Tokens

### Requirements

1. NodeJS v8.9.1 or latest LTS


## Installation

```shell
$ npm i
```

### How to use

```
 $ GITLAB_PRIVATE_TOKEN=YOUR_PRIVATE_TOKEN NODE_DEBUG=request GITLAB_REPO_URL=YOUR_GITLAB_REPO_URL node index.js
```

## Environments

- `GITLAB_PRIVATE_TOKEN`: Private token https://docs.gitlab.com/ce/user/profile/personal_access_tokens.html
- `NODE_DEBUG`: Set this to `request` if you want to see the request coming. See https://github.com/request/request#debugging
- `GITLAB_REPO_URL`: Your gitlab private host `https`
- `DEST_DIR`: Directory destination, default to `download` folder
- `OUT_EXTENSION`: Desired extension, supported extensions `tar`, `zip`, `.tar.bz2`
- `DOWNLOAD_CONCURRENCY`: Number of concurrent requests to download repository, default to `1`


## Author

2017-2018 (c) Rheza Satria

---

Made with :love: in JKT
