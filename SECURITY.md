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

```bash
pnpm install
docker compose up -d
pnpm --filter @netthouse/api dev
pnpm --filter @netthouse/web dev
pnpm --filter @netthouse/site dev
Run the relevant tests before opening a pull request.
PS D:\netthouse> git status --short

 M .gitignore

PS D:\netthouse> git add .gitignore

warning: in the working copy of '.gitignore', LF will be replaced by CRLF the next time Git touches it

PS D:\netthouse> git commit -m "chore: ignore local backups and credentials"

[main d6a7d27] chore: ignore local backups and credentials

 1 file changed, 18 insertions(+), 1 deletion(-)

PS D:\netthouse>

Lite
Отлично, .gitignore сохранён локальным коммитом:
text
d6a7d27 chore: ignore local backups and credentials
Теперь создадим три публичных файла для репозитория. Они не содержат секретов и помогут пользователям и инвесторам понять, как работать с проектом.
Шаг 4. Создать SECURITY.md
Выполните в PowerShell из D:\netthouse:
powershell
@'
# Security Policy

## Reporting a vulnerability

Please do not report security vulnerabilities in public GitHub issues.

Send a private report to the project maintainers with:

- a clear description of the vulnerability;
- steps to reproduce it;
- the affected component or endpoint;
- the potential impact;
- any suggested mitigation.

Do not include private keys, API tokens, passwords, personal data, or production credentials in the report.

## Secrets

Never commit:

- `.env` files;
- database dumps or backups;
- API keys;
- private wallet keys;
- Stripe, Clerk, Neon, Render, Cloudflare, or GitHub credentials;
- production customer data.

Use environment variables or a dedicated secrets manager for local and production credentials.
