# Game Store Rental Tracker

Game Store Rental Tracker is a spec-driven MVP for local game stores and tabletop lounges that need a fast, auditable way to manage rental inventory. The application focuses on the operational core of the workflow: viewing inventory at a glance, applying atomic status updates, and preserving a reliable audit trail of every change.

## Project Overview

The user experience is centered on an interactive inventory dashboard that staff can use to scan the state of the store in real time. Inventory can be filtered server-side, status changes are handled through a dedicated update modal, and a log drawer exposes the full change history for each item.

Core capabilities include:

- Interactive inventory dashboard for games and hardware.
- Server-driven filtering and query-backed data presentation.
- Atomic status updates for checkout, return, and maintenance workflows.
- Audit log drawer for transparent review of inventory changes.
- Type-safe full-stack data handling from UI to database.

## AI Development Methodology & Workflow

This repository was built to demonstrate an end-to-end AI-assisted development workflow rather than a one-off code generation exercise. The process emphasized specification first, implementation second, with the AI operating inside explicit architectural and quality boundaries.

The workflow used here combined:

- Spec-driven prompts to define the MVP scope, domain rules, and feature boundaries before implementation.
- Iterative architecture design, using the product spec and schema as the primary source of truth.
- Rule enforcement through repo instructions and workflow guidance to keep the AI aligned with project standards.
- Context indexing and selective file loading so the AI could reason across the full stack without losing type safety or domain consistency.

In practice, that meant the AI was used to move from product requirements to schema design, then from schema design to UI and server logic, while keeping the implementation tightly coupled to the actual data model and application behavior.

## Tech Stack & Architecture

The stack is intentionally modern and portfolio-friendly:

- Next.js App Router for the application shell and server-first rendering model.
- Server Actions for mutation-heavy workflows such as inventory status updates.
- TypeScript for end-to-end type safety across UI, server, and data access layers.
- Prisma 7 for schema management, database access, and seed workflows.
- Supabase PostgreSQL as the backing relational datastore.
- Tailwind CSS for utility-driven styling and fast UI iteration.

The domain model is centered on three related entities:

- InventoryItem, represented in the Prisma schema as `Item`, stores the catalog entry, category, current status, and optional image URL.
- StaffUser, represented in the Prisma schema as `User`, identifies the authenticated staff member responsible for a change.
- StatusLog records each transition from one status to another, linking the item, the staff user, timestamps, and optional notes.

This structure keeps the current inventory state and the historical audit trail separate, which makes the system easier to query, safer to mutate, and more defensible for operational review.

## Getting Started & Setup

1. Install dependencies:

	```bash
	npm install
	```

2. Create your local environment file from the example template:

	```bash
	copy .env.example .env
	```

	Populate `.env` with your Supabase PostgreSQL connection strings.

3. Push the Prisma schema to the database:

	```bash
	npx prisma db push
	```

4. Seed the database with starter data:

	```bash
	npx prisma db seed
	```

5. Start the development server:

	```bash
	npm run dev
	```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Repository Structure

- `src/app/` - App Router routes, global styles, and server actions.
- `src/components/inventory/` - Inventory dashboard UI, filters, badges, dialogs, and table views.
- `src/lib/` - Shared infrastructure utilities, including Prisma client setup.
- `prisma/` - Database schema, seed script, and migration history.
- `docs/` - Product specification, schema design notes, and AI workflow guidance.
- `public/` - Static assets served by Next.js.

## Notes

This repository is intentionally scoped as an MVP portfolio piece. The goal is to demonstrate clear product thinking, disciplined AI-assisted engineering, and a maintainable full-stack architecture rather than to present a feature-complete retail system.