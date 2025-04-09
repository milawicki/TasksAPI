# Tasks API

## Project Description

The Tasks API is a simple RESTful API built with NestJS that allows users to create and manage tasks.

## Running the Project

### Prerequisites

- Docker

### Running the API

1. Build and start the Docker containers:

   ```sh
   docker compose up
   ```

2. The API will be available at `http://localhost:3000`.

### Running Tests

To run all tests, use the following command:

```sh
docker compose -f "docker-compose.test.yml" up
```

### Environment Variables

The following environment variables can be configured:

- `CREATE_TASK_USER_RATE_LIMIT`: The maximum number of tasks a user can create within the specified period.
- `CREATE_TASK_USER_RATE_PERIOD`: The period (in minutes) for the user rate limit.
- `CREATE_TASK_GLOBAL_RATE_LIMIT`: The maximum number of tasks that can be created globally within the specified period.
- `CREATE_TASK_GLOBAL_RATE_PERIOD`: The period (in minutes) for the global rate limit.

These variables can be set in a `.env` file or directly in the environment.
