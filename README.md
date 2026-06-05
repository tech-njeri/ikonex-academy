# Ikonex Academy — Student Management System

> Developed by **Joy Njeri Wairimu** | Ikonex Systems Intern Assessment | June 2026

A full-stack web application for managing class streams, students, subjects, scores, results, and PDF report cards.

---

## Live Demo

- **Application:** https://ikonex-academy.vercel.app
- **Repository:** https://github.com/tech-njeri/ikonex-academy

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (React) + Tailwind CSS |
| Backend | Next.js API Routes (Node.js) |
| Database | PostgreSQL (Railway) |
| ORM | Prisma |
| PDF | @react-pdf/renderer |
| Deployment | Vercel + Railway |

---

## Features

- **Class Streams** — Create, edit, delete class streams
- **Students** — Register, edit, delete students assigned to streams
- **Subjects** — Create, edit, delete subjects; assign to streams
- **Scores** — Record exam and CAT scores per student per subject; prevent duplicates
- **Results** — Auto-calculate totals, averages, grades, and class positions
- **PDF Reports** — Individual student report cards and full class performance reports

---

## Local Setup

### Prerequisites

- Node.js v18+
- npm
- PostgreSQL database (Railway recommended)

### Steps

1. Clone the repository:
```bash
git clone https://github.com/tech-njeri/ikonex-academy.git
cd ikonex-academy
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root folder:
```
DATABASE_URL="your-postgresql-url-here"
```

4. Run database migrations:
```bash
npx prisma migrate dev --name init
```

5. Generate Prisma client:
```bash
npx prisma generate
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

### Database (Railway)
1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project** → **Provision PostgreSQL**
3. Copy the **Public Network** DATABASE_URL from the Connect tab

### Application (Vercel)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** and import this repository
3. Add environment variable: `DATABASE_URL` = your Railway URL
4. Click **Deploy**

---

## Database Schema

```
Stream        — class groups (Form 1A, Form 2B, etc.)
Student       — registered students linked to a stream
Subject       — subjects offered by the school
StreamSubject — links subjects to streams (many-to-many)
Score         — exam and CAT scores per student per subject
GradeScale    — configurable grading boundaries
```

---

## Grading Scale

| Grade | Score Range | Description |
|---|---|---|
| A | 80 - 100 | Excellent |
| B | 60 - 79 | Good |
| C | 50 - 59 | Average |
| D | 40 - 49 | Below Average |
| E | 0 - 39 | Fail |

---

## Project Structure

```
ikonex-academy/
  app/
    api/
      streams/route.js
      students/route.js
      students/[id]/route.js
      subjects/route.js
      stream-subjects/route.js
      scores/route.js
      results/route.js
    streams/page.js
    students/page.js
    subjects/page.js
    stream-subjects/page.js
    scores/page.js
    results/page.js
    reports/[studentId]/page.js
    reports/class/page.js
    layout.js
  prisma/
    schema.prisma
  lib/
    prisma.js
```

---

## Usage Guide

### 1. Set Up Streams
Go to **Streams** → create class streams like Form 1A, Form 2B.

### 2. Add Subjects
Go to **Subjects** → add subjects like Mathematics, English, Science.

### 3. Assign Subjects to Streams
Go to **Assign Subjects** → select a stream and assign subjects to it.

### 4. Register Students
Go to **Students** → register students and assign them to a stream.

### 5. Record Scores
Go to **Scores** → select a stream, then a student, then enter exam and CAT scores per subject.

### 6. View Results
Go to **Results** → select a stream and click View Results to see grades and class positions.

### 7. Download Reports
- Click **Report Card** next to any student for an individual PDF
- Go to **Class Report** for a full class performance PDF

---

## Copyright

© 2026 Joy Njeri Wairimu. Submitted for Ikonex Systems Intern Assessment. All rights reserved.
