# Contribution Guide

## Development Guide

Before create a pull-request, you need to test using `npm test`.

```bash
git clone https://github.com/uetchy/niconico.git && cd niconico
npm install
npm run dev
NICONICO_EMAIL=<email> NICONICO_PASSWORD=<password> npm test
```

## Release Guide (Maintainers only)

```bash
release-it
```
