# Shadcn View Table (Next)

A modern data table component built with Next.js and Shadcn UI, featuring server-side sorting, pagination, and filtering capabilities.

<img width="1440" alt="Screenshot 2025-02-15 at 8 03 07 PM" src="https://github.com/user-attachments/assets/a53123c3-45d1-46df-8e8d-549c84383cd0">

## Features

- 🌓 Light/dark mode toggle
- 📱 Fully responsive design
- 📊 Server-side pagination
- 🔍 Advanced filtering
- ↕️ Column sorting
- 📎 Export to CSV
- 🎯 Column visibility toggle
- 🔒 Row selection
- 🚀 Fast and optimized performance

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui
- **Table Management:** @tanstack/react-table
- **Database ORM:** Prisma
- **URL State Management:** nuqs
- **Type Validation:** Zod

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+
- PNPM package manager
- PostgreSQL database

## Running Locally

1. Clone the repository

```bash
git clone https://github.com/dandnirv7/next-table-view
cd next-table-view
```

2. Install dependencies using pnpm

```bash
pnpm install
```

3. Copy the `.env.example` to `.env` and update the variables

```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
```

5. Run database migrations

```bash
npx prisma migrate dev
```

6. Seed the database

```bash
npx prisma db seed
```

7. Start the development server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Database Schema

```prisma
model Users {
  id        String    @id @default(uuid()) @db.Uuid
  email     String    @unique
  username  String    @unique
  fullName  String
  password  String
  status    Status    @default(active)
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @default(now()) @map("updated_at")
  deletedAt DateTime? @map("deleted_at")
  role      String    @default("user")
}

enum Status {
  active
  inactive
}
```

## API Routes

| Endpoint          | Method | Description                                         | Query Parameters                                                |
| ----------------- | ------ | --------------------------------------------------- | --------------------------------------------------------------- |
| `/api/users`      | GET    | Fetch users with pagination, sorting, and filtering | `page`, `pageSize`, `sort`, `order`, `search`, `status`, `role` |
| `/api/users/{id}` | GET    | Get single user by ID                               | -                                                               |
| `/api/users`      | POST   | Create new user                                     | -                                                               |
| `/api/users/{id}` | PUT    | Full update of data                                 | -                                                               |
| `/api/users/{id}` | PATCH  | Partial update of data                              | -                                                               |
| `/api/users/{id}` | DELETE | Delete user                                         | -                                                               |

### Query Parameters Details

- `page`: Current page number (default: 1)
- `pageSize`: Number of items per page (default: 10)
- `sort`: Column to sort by (e.g., 'email', 'username')
- `order`: Sort order ('asc' or 'desc')
- `search`: Search term for filtering
- `status`: Filter by user status ('active' or 'inactive')
- `role`: Filter by user role ('user', 'admin' or 'super admin')

## Environment Variables

```env
DATABASE_URL=
BASE_URL_DEV=
BASE_URL_PROD=
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful components
- [Tanstack Table](https://tanstack.com/table/v8) for the powerful table features
- [Prisma](https://www.prisma.io/) for the excellent database toolkit
