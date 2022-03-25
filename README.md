# Storefront Backend Project

## Getting Started

This is a StoreFront backend API built with NodeJS and Express to set up an online store. It crafts a RESTful API that can be exploited by frontend developers.

## Getting Started

#### Prerequisites:

1. Install `docker` and `docker-compose` on your local machine.
2. You need to have node v12.22 or later.
3. Install _yarn_ (if not installed) by using `npm -g install yarn`

### Application Setup

1. #### Install Dependencies:

   `yarn install`

2. #### Create **.env** File:

```
PORT=3000
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_DB=full_stack_dev
POSTGRES_TEST_DB=full_stack_test
POSTGRES_USER=full_stack_user
POSTGRES_PASSWORD=password
NODE_ENV=dev
BCRYPT_PASSWORD=your-secret-password
SALT_ROUNDS=10
TOKEN_SECRET=your-token-secret
```

3. #### Setup Database:

   - Run `yarn dc-up` to start the postgres container on port **5432**
   - Run `yarn db-up` to setup the database tables

4. #### Build the Application
   `yarn build`
5. #### Start Server:

   - For **Dev**: run `yarn watch` or `npm run watch`

     or

   - For **Prod**: run `npm start` or `npm run start`

   The server will listen on port 3000

6. #### Open Browser and Navigate to [localhost:3000](http://localhost:3000):

   - Open [REQUIREMENTS.md](./REQUIREMENTS.md) file to see more details about the available endpoints.

### Testing

1. #### Create Test Database:
   1. Open terminal or command prompt.
   2. Run `docker exec -it storefront_db_1 bash` to connect to the postgres container.
   3. Run `psql full_stack_dev -U full_stack_user` to login to full_stack_dev database
   4. Run `CREATE DATABASE full_stack_test;`
2. #### Database Migration & Test Running:

   `yarn test` or `npm run test` to migrate database tables, build app, and run test suites.

### Styling

- #### Code Formatting:
  - `yarn format` or `npm run format`
- #### Linting:
  - `yarn lint` or `npm run lint`
