# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index - `/api/products` [GET]
- Show - `/api/products/:id` [GET]
- Create **[token required]** - `/api/products` [POST]
- Update **[token required]** - `/api/products/:id` [PUT]
- Delete **[token required]** - `/api/products/:id` [DELETE]
  <!-- - [OPTIONAL] Top 5 most popular products -->
  <!-- - [OPTIONAL] Products by category (args: product category) -->

#### Users

- Index **[token required]** - `/api/users` [GET]
- Show **[token required]** - `/api/users/:id` [GET]
- Create - `/api/users` [POST]
- Update **[token required]** - `/api/users/:id` [PUT]
- Delete **[token required]** - `/api/users/:id` [DELETE]
- Authenticate - `/api/users/authenticate` [POST]

#### Orders

- Index - **[token required]** - `/api/orders` [GET]
- Show - **[token required]** - `/api/orders/:id` [GET]
- Create **[token required]** - `/api/orders` [POST]
- Update **[token required]** - `/api/orders/:id` [PUT]
- Delete **[token required]** - `/api/orders/:id` [DELETE]
- Current Order by user (args: user id) **[token required]** - `/api/orders/users/:user_id` [GET]
<!-- - [OPTIONAL] Completed Orders by user (args: user id)[token required] -->

## Data Shapes

#### Product

- id
- name
- price
- [OPTIONAL] category

###### Schema

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    price integer,
    category VARCHAR(50)
);
```

#### User

- id
- username
- firstName
- lastName
- password

###### Schema

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    password VARCHAR(255)
);
```

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

###### Schema

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(15),
    user_id bigint REFERENCES users(id)
);

CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    quantity integer,
    order_id bigint REFERENCES orders(id),
    product_id bigint REFERENCES products(id)
);
```
