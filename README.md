# Turborepo Fullstack Boilerplate

This boilerplate combines the best of both worlds: Next.js's amazing developer experience and powerful frontend capabilities with NestJS's robust backend architecture. The idea is simple - use Next.js to build beautiful, interactive UIs while having a proper backend that can handle complex business logic, authentication, and database operations with NestJS. All tied together nicely in a Turborepo monorepo.

## Features

### Core

- 🚀 **Turborepo**: Efficient monorepo management.
- 🔒 **Strict Mode**: TypeScript strict mode enabled across all packages for enhanced type safety.
- 🎯 **ESLint**: Comprehensive linting configuration with TypeScript support and consistent code style enforcement.

### Server

- ⚡ **NestJS with Fastify**: Up to 2x faster than Express with better overall performance for handling HTTP requests.
- 🐘 **Drizzle**: Integration with PostgreSQL using Drizzle ORM.
- 🔐 **Authentication**: JWT-based authentication with Passport including refresh token.
- 💎 **Validation**: Data validation using NestJS Zod.
- 📚 **OpenAPI**: Swagger for API documentation and typed routes generation.

### Web

- ⚛️ **Next.js**: SSR, TypeScript support, smart bundling, route pre-fetching, and more.
- 👨‍🎨 **DaisyUI with Tailwind CSS**: Simple and beautiful UI components for Tailwind CSS.
- 🔐 **NextAuth.js**: Custom integration with JWT sessions and backend authentication.
- 📋 **React Hook Form**: Form validation and management with Zod.
- 🔄 **React Query**: Powerful data synchronization and state management.

### DevOps & Tools

- 🐳 **Docker Integration**: Containerization with Docker.
- 🐕 **Husky**: Git hooks for code quality and consistency.

## Apps and Packages

- `server`: A [NestJS](https://nestjs.com/) server application providing the backend API.
- `web`: A [Next.js](https://nextjs.org) web application.
- `@workspace/ui`: A stub React component library used by `web`.
- `@workspace/openapi`: OpenAPI schema and generated API client used by the web application.
- `@workspace/*-config`: Shared configurations for ESLint, TypeScript, etc.

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (version 20+ recommended).
- **pnpm**: This boilerplate uses pnpm as a package manager.
- **Docker**: Required for database and other services.

### Installation

1. **Clone the repository**:

   ```bash
   git clone <your-repo-url>
   cd <your-repo-directory>
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Set up environment variables**:

   - Copy `.env.example` to `.env` in both `apps/web` and `apps/server` directories and configure as needed.

4. **Start Docker services**:

   ```bash
   docker compose up -d
   ```

   This will start PostgreSQL and other required services in the background.

5. **Run the development server**:

   ```bash
   pnpm run dev
   ```

6. **Build for production**:
   ```bash
   pnpm run build
   ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
