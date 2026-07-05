# Neon SQL setup

Run these files in order from the Neon SQL Editor:

1. `001_schema.sql`
2. `002_rls_policies.sql`
3. `003_seed_cards_genetic_apex.sql`

The schema script creates the application tables and indexes. The RLS script enables row-level security, grants Data API roles access, and adds policies for Neon Auth users.

The Genetic Apex seed script inserts or updates the `cards` lookup rows for all 286 Genetic Apex (`A1`) cards.

Shared lookup tables (`cards` and `solo_battles`) are readable by both anonymous and authenticated users. User-owned tables (`decks`, `deck_cards`, and `deck_games`) are restricted to the current Neon Auth user via `auth.uid()`.
