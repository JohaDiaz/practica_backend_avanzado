# NodeApp

## Deploy

### Install dependencies

```sh
npm install
```

On first deploy copy .env.example to .env and custimize environment variables

```sh
cp .env.example .env
```

You can run next command to empty the database and create initial data:

```js
npm run initDB
```

## Start

To start in production mode:

```sh
npm start
```

To start in development mode:

```sh
npm run dev
```

## API

Base URL: http://localhost:3000/api

### Product list

GET /api/product

```json
{
    "results": [
        {
            "_id": "677fa59fa76ebe22c5467e95",
            "name": "Calcetines",
            "owner": "677fa59fa76ebe22c5467e88",
            "price": 2000,
            "image": "",
            "tags": [
                "work",
                "lifestyle"
            ],
            "__v": 0
        }
    ],
    "count": 9
}
```