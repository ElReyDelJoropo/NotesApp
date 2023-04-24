# Notes api
<!--toc:start-->
- [Description](#description)
- [Installation](#installation)
- [Running the app](#running-the-app)
  - [Using docker](#using-docker)
  - [Without docker](#without-docker)
- [Test](#test)
<!--toc:end-->

## Description

Note app backend written in [Nest](https://github.com/nestjs/nest) for
educational purposes, trying to follow good practices

## Installation

- First we need define some enviroment variables, so copy .env.example file:

```bash
cp .env.example .env
```

- Then install all dependencies

```bash
npm install
```

## Running the app

### Using docker

```bash
docker compose up -d dev
```

### Without docker

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
