# Contributing to Netthouse

Thanks for your interest in Netthouse.

## Before opening an issue

Please search existing issues first. For bugs, include:

- operating system;
- Node.js and pnpm versions;
- the affected package or application;
- exact steps to reproduce;
- expected and actual behavior;
- relevant logs with secrets and personal data removed.

## Development

Install dependencies:

    pnpm install

Start the local database:

    docker compose up -d

Start the API:

    pnpm --filter @netthouse/api dev

Start the dashboard:

    pnpm --filter @netthouse/web dev

Start the site:

    pnpm --filter @netthouse/site dev

Run the relevant tests before opening a pull request.

## Pull requests

Keep pull requests focused and explain:

- what changed;
- why the change is needed;
- how it was tested;
- whether documentation must be updated.

Never commit credentials, database dumps, private keys, or production data.
