
# Game Store Rental Tracker – MVP Functional Specification

## Overview

**Game Store Rental Tracker** is a web application designed for Local Game Stores (LGS) and tabletop lounges to manage their inventory of games and hardware, track checkouts and returns, and maintain a transparent log of rental activities. The MVP focuses on providing essential features for viewing inventory, updating item status, and auditing changes for accountability.

**Tech Stack:**  
- Next.js (App Router, TypeScript)  
- Tailwind CSS  
- Prisma ORM  
- Supabase (PostgreSQL)

---

## Objectives

- Enable staff to clearly view the inventory with current status.
- Facilitate check-out and return operations via action modals or drawers.
- Maintain a real-time activity feed/audit log of inventory status changes.

---

## Features

### 1. Inventory Table/Grid

- **Purpose:** Display all games and hardware available for rental.
- **Display Aspects:**
  - Table or grid layout for quick scanning.
  - Each row/card presents:
    - Game/Hardware Name
    - Unique ID (SKU or inventory code)
    - Status badge:  
      - `AVAILABLE`
      - `RENTED`
      - `MAINTENANCE`
    - Optional: Thumbnail image
- **Functional Requirements:**
  - Inventory must be dynamically loaded from the database (Supabase/Postgres via Prisma).
  - Should support sorting/filtering by status and search by name.
  - Visual indications (badges or colors) reflecting real-time status.

### 2. Status Update Action (Checkout/Return Modal or Drawer)

- **Purpose:** Allow staff to update the status of an item (e.g., check out a game to a customer, return it, or mark for maintenance).
- **Interaction:**
  - Accessible via a button or action on the inventory view.
  - When an action is initiated, open a modal or side drawer.
- **Modal/Drawer Content:**
  - Current item details and status.
  - Action selector (Check out, Return, Mark as Maintenance/Available).
  - Optional: Input for customer/renter name if checking out.
  - Optional: Notes or comments.
  - Confirm/cancel buttons.
- **Functional Requirements:**
  - Updating an item's status triggers a change in the database.
  - Upon status update, inventory and audit log should immediately reflect the change.

### 3. Activity Feed / Audit Log

- **Purpose:** Display a timeline of all status changes made to inventory items for transparency and tracking.
- **Display Aspects:**
  - Chronological timeline or feed.
  - Each entry includes:
    - Timestamp of the change
    - Item affected
    - Previous and new status
    - User performing the action
    - Optional: Notes/comments
- **Functional Requirements:**
  - Feed must be automatically updated when new actions occur.
  - Supports filtering by item or user (optional for MVP).

---

## Non-Functional Requirements

- **Authentication:**  
  - Staff authentication via Supabase.
  - Only authenticated users may change item statuses.
- **Responsiveness:**  
  - UI must be usable on tablets and desktops.
- **Accessibility:**  
  - Modal/dialogs must be accessible via keyboard navigation and screen readers.

---

## Out of Scope

- Customer self-serve portal
- Payment processing or billing
- Game or hardware reservations
- Inventory import/export tools

---

## Data Model (MVP Overview)

- **Item**  
  - id: UUID  
  - name: String  
  - status: Enum (`AVAILABLE`, `RENTED`, `MAINTENANCE`)  
  - image_url: String?  
  - created_at: Timestamp  
  - updated_at: Timestamp  
- **StatusChange (Audit Log Entry)**  
  - id: UUID  
  - item_id: UUID  
  - previous_status: Enum  
  - new_status: Enum  
  - changed_by: User Reference  
  - note: String?  
  - created_at: Timestamp  
- **User**  
  - id: UUID  
  - email: String  
  - name: String

---

## MVP Success Criteria

- Staff can log in and view the inventory.
- Staff can check out and return items, and update statuses as needed.
- Status changes are reliably captured in an audit log visible in the activity feed.
- Application operates reliably on supported browsers and remains responsive during usage.

---

