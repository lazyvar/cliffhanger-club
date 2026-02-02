# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cliffhanger Club is a book club portal built with Cloudflare Workers, Hono framework, and D1 (SQLite) database. It features photo-based member login, book tracking, and a Spotify Wrapped-style year-in-review feature.

## Commands

```bash
npm run dev          # Start local dev server at localhost:8787
npm run db:init      # Initialize local D1 database with schema and seed data
npm run db:init:remote  # Initialize remote D1 database
npm run deploy       # Deploy to Cloudflare Workers
```

## Architecture

**Runtime**: Cloudflare Workers with Hono framework
**Database**: Cloudflare D1 (SQLite) bound as `env.DB`
**Static Assets**: Served from `public/` directory via wrangler assets config

### Key Files

- `src/index.ts` - Main worker entry point with all route definitions
- `src/auth.ts` - Authentication: password hashing, sessions, middleware
- `src/db.ts` - Database query functions (users, books, questions, answers)
- `src/styles.ts` - CSS exported as a string, served via `/styles.css` route
- `src/pages/*.ts` - HTML template functions returning string literals

### Data Flow

1. Routes in `index.ts` use auth middleware from `auth.ts`
2. Database queries go through functions in `db.ts`
3. Pages are server-rendered HTML from template functions in `pages/`
4. CSS is embedded in `styles.ts` and served dynamically (not from public/)

### Auth System

- Cookie-based sessions stored in `sessions` table
- Passwords hashed with SHA-256 using `username:password` format
- `mack` user has admin privileges (hardcoded check)

### Database Schema

Tables: `users`, `books`, `questions`, `answers`, `sessions`, `settings`

Key relationships:
- `books.added_by` → `users.id` (who picked the book)
- `answers.user_id` → `users.id`, `answers.question_id` → `questions.id`
