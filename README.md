# Letymind API - Old V

A modern API built with Hono.js and Cloudflare Workers, featuring OpenAPI documentation and robust error handling.

## 🚀 Features

- Built with [Hono.js](https://hono.dev/) for optimal performance
- OpenAPI documentation with Scalar API Reference
- Cloudflare Workers deployment
- TypeScript support
- Drizzle ORM for database operations
- Zod for schema validation
- ESLint for code quality
- Cloudflare D1 as database
- Zero configuration deployment
- Type-safe API endpoints

## 📋 Prerequisites

- Node.js 18 or higher
- Cloudflare account with Workers subscription
- Wrangler CLI (`bun install -g wrangler`)
- Bun (optional, but recommended)

## 🛠 Installation

1. **Clone and Install**

```bash
git clone <your-repository-url>
cd letymind-api
bun install
```

2. **Cloudflare D1 Setup**

```bash
# Login to Cloudflare (if not already logged in)
wrangler login

# Create a new D1 database
wrangler d1 create letymind-db

# The command above will output something like:
# ✅ Successfully created DB 'letymind-db' in region ENAM
# Created database 'letymind-db' at id: fc080c58-f6c6-4948-bacd-83440a7317d2
```

3. **Configure wrangler.jsonc**

```jsonc
{
  "name": "letymind-api",
  "compatibility_date": "2023-01-01",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "letymind-db",
      "database_id": "<your-database-id>" // Replace with the ID from step 2
    }
  ]
}
```

4. **Initialize Database Schema**

```bash
# Run migrations
bun run migrate

# Optional: Start Drizzle Studio to manage your data
bun run studio
```

## 💻 Development

To start the development server, run:

```bash
bun run dev
```

## Available Scripts

- `bun run dev`: Starts the development server
- `bun run deploy`: Deploys the application to Cloudflare Workers
- `bun run lint`: Run ESLint
- `bun run lint:fix`: Fix ESLint issues
- `bun run generate`: Generate Drizzle migrations
- `bun run migrate`: Run Drizzle migrations
- `bun run studio`: Start Drizzle Studio

## 📚 API Documentation

Once the server is running, you can access:

- OpenAPI documentation: `/doc`
- API Reference UI: `/reference`

## 🏗 Project Structure

```
src/
├── app.ts              # Application entry point
├── constants/          # Constants and enums
├── controllers/        # Request handlers
├── db/                 # Database configuration
├── helpers/            # Helper functions
├── lib/                # Core libraries
├── middleware/         # Custom middleware
├── routes/             # API routes
├── schemas/            # Zod schemas
└── utils/              # Utility functions
```

## 🚀 Deployment

To deploy to Cloudflare Workers:

1. **Ensure your wrangler.jsonc is configured correctly**

2. **Deploy your application**

```bash
bun run deploy
```

3. **Verify your deployment**
   Visit your Workers domain to confirm the deployment was successful.

## 🧪 Testing

Coming soon

## 👥 Contributing

1. Fork the repository

```bash
git clone <your-repository-url>
cd letymind-api
```

2. Create your feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m 'Add some amazing feature'
```

4. Push to the branch

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

## 🙏 Acknowledgments

- [Hono.js](https://hono.dev/) - The web framework used
- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless platform
- [D1 Cloudflare](https://developers.cloudflare.com/d1/) - Serverless SQL database
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [Zod](https://zod.dev/) - Schema validation
