# Task Management API

## Overview

The Task Management API is a powerful tool designed to streamline project-related operations. It offers a set of RESTful endpoints for managing projects, users, tags, stages, tickets, comments, and more. This README provides essential information to get started with the API.

This is our project for the Software Engineering course for HCMIU. Our front-end can be found [here](https://github.com/tpSpace/task_manager_fe)

For our Swagger Documentation, you can found it [here](https://app.swaggerhub.com/apis/QuangPham/tasKing/1.0.0#/)

For our deployed server, you can found it [here](https://taskings-docker-version.onrender.com/), since we are using a free instance on Render, it can take a while to reach the server if remained unactive.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment and Dockerization](#deployment-and-dockerization)

## Features

- Full CRUD functionality for projects, users, tags, stages, tickets, and comments.
- Secure authentication using JSON Web Tokens (JWT).
- Robust request validation using Zod.
- Scalable and flexible MongoDB as the database backend.

## Prerequisites

Before you begin, ensure you have the following prerequisites:

- Node.js: [Install Node.js](https://nodejs.org/)
- Yarn: [Install Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)

## Installation

1. Clone the repository:

 ```bash
 git clone https://github.com/your-username/project-management-api.git
```
   
2. Install dependencies:

```bash
cd task_manager_be
yarn install
```

## Configuration
Create a .env file in the project root:

```
PORT=3001
MONGODB_URL=your_mongodb_database
SECRET_KEY=your_jwt_secret_key
```
Adjust the values according to your preferences.

## Usage
Start the API server:

### Without Docker

1. Run yarn to install dependencies

```bash
yarn
```

2. Start the server

Your server should run on port 3001
```bash
yarn run dev
```

3. Format the code

```bash
yarn prettier --write "src/**/*.ts"
```

### With Docker

1. Build Container

```bash
docker build -t tasking .
```

2. Run Container

Your server should run on port 3001
```bash
docker run -p 3001:3001 -d tasking
```

## API Documentation
For detailed API documentation, refer to the [Swagger documentation](https://app.swaggerhub.com/apis/QuangPham/tasKing/1.0.0#/). 

## Testing
Most of the testing was done on Postman, the workplace can found here [Postman Workspace](https://www.postman.com/lively-trinity-614277/workspace/task-manager-project/overview)

We also implemented basic intergration test via Mocha, which tests all of the basic functionalities of the API:

```bash
yarn run integration-test
```

## Deployment and Dockerization
For the deployment we have a very simple CI/CD pipeline:
- First, we would run an integration test whenever a pull request is created.
- Build and Push our Docker's Image to the repository. Our Docker's Repo can be found [here](https://hub.docker.com/r/quangpham09112003/tasking) 
- Push the Image to the cloud. We are using [Render](https://render.com/) for our cloud hosting solution, we chose it mainly because it is free. This free instance types will spin down with inactivity, therefore it might take a while for our deployment to run (30s)

Our deployed instance can be found [here](https://taskings-docker-version.onrender.com/)

