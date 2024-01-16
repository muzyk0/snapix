<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white" alt="Conventional Commits" /></a>
<a href="https://github.com/KamenshikBackTeam/snapix/releases" target="_blank"><img src="https://img.shields.io/badge/version-0.0.1-blue" alt="Version" /></a>
<a href="https://github.com/KamenshikBackTeam/snapix" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="License" /></a>
<a href="https://9art.ru" target="_blank"><img src="https://img.shields.io/badge/production-brightgreen.svg" alt="Production"/></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Snapix

PhotoShare is a photo-sharing service that allows users to upload, view, like and comment on photos of other users. In
addition, users can subscribe to paid services that give them access to additional features, such as advanced search,
photo editing, private albums, etc.

## Commit Standards

To improve the readability of the commit history, we follow the standards
of [Conventional Commits](https://products.groupdocs.app/translation/markdown), which define the format of commit
messages and versioning rules.

## Authentication

To authenticate on our service, we use email and password, as well as support login via OAuth 2.0 using the following
providers:

- GitHub
- Google
- VK

To implement OAuth 2.0, we use the library [@nestjs/passport], which integrates with the NestJS framework and provides
various authentication strategies.

## Project Structure

Our project consists of several microservices that work together to provide the functionality of our service. We use the
NestJS framework to create microservices that communicate with each other using transport layers, such as TCP, Redis or
MQTT. Here are the main microservices of our project:

- main: the main backend application that handles requests from clients, interacts with the database and other
  microservices. This microservice contains the main logic of our service, such as registration, authentication, upload,
  view, like and comment on photos, as well as manage profile and settings of the user.
- billing: the microservice that handles payments and subscriptions of users to our service. This microservice
  integrates with the Stripe payment system and ensures the security and reliability of transactions.
- storage: the microservice that handles the storage of files and documents of users on the S3 server. This microservice
  provides efficient and scalable data storage, as well as protection from unauthorized access.
- notifier: the microservice that handles sending email messages to users about various events on our service, such as
  confirmation of registration, password recovery, notifications of new photos, comments and likes, promotional and
  informational newsletters, etc. This microservice uses the Nodemailer library to send email messages via SMTP.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development with watch mode and debug mode
$ yarn run start:debug

```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
