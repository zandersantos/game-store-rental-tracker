
# Database Schema Design

This schema is tailored for the Game Store Rental Tracker MVP, using Prisma ORM and Supabase (PostgreSQL). The schema models games/hardware inventory, staff users, and a status change log for auditing all rental actions.

---

## 1. Entity Relationships & Rationale

- **Item ⟶ StatusLog**:  
  - **1-to-many**: Each inventory item can have multiple status changes over time (e.g., checked out, returned, sent to maintenance). `StatusLog` (aka audit log) tracks each event for transparency and accountability.
- **User ⟶ StatusLog**:  
  - **1-to-many**: Each user (staff) may perform many actions; each status change is attributed to the staff who performed it.
- Item can be a **game** or **hardware**; this is stored in a `category` field (enum).

---

## 2. Prisma Schema Code

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ItemCategory {
  GAME
  HARDWARE
}

enum ItemStatus {
  AVAILABLE
  RENTED
  MAINTENANCE
}

model User {
  id        String      @id @default(uuid())
  email     String      @unique
  name      String
  // Optionally add role/permissions fields in the future

  statusLogs StatusLog[]  @relation("UserStatusLogs")
}

model Item {
  id         String      @id @default(uuid())
  name       String
  category   ItemCategory
  status     ItemStatus
  imageUrl   String?
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  statusLogs StatusLog[] @relation("ItemStatusLogs")
}

model StatusLog {
  id             String      @id @default(uuid())
  item           Item        @relation("ItemStatusLogs", fields: [itemId], references: [id])
  itemId         String

  previousStatus ItemStatus
  newStatus      ItemStatus

  changedBy      User        @relation("UserStatusLogs", fields: [changedById], references: [id])
  changedById    String

  note           String?
  createdAt      DateTime    @default(now())
}
```

---

## 3. Migration & Seeding Strategy

1. **Migration**
   - Use `prisma migrate dev` or `prisma migrate deploy` to create the initial tables based on the schema above.
   - This will auto-generate the database structure in Supabase/PostgreSQL.

2. **Seeding**
    - Create a seed script to add:
      - Several demo users (staff/admin accounts).
      - A set of sample items (both games and hardware).
      - Optionally, a few initial status logs (e.g., initial stock, "available" entries).
    - Seeding can be done using Prisma's [seed script](https://www.prisma.io/docs/guides/database/seed-database).
    - Example:  
      ```typescript
      await prisma.user.createMany(/* ...staff */)
      await prisma.item.createMany(/* ...games/hardware */)
      await prisma.statusLog.createMany(/* ...initial logs */)
      ```

---

**This schema ensures inventory accuracy, full status/audit tracking, and staff accountability, forming a robust foundation for the MVP.**

