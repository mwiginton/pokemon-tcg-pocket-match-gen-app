# Neon SQL setup

Run these files in order from the Neon SQL Editor:

1. `001_schema.sql`
2. `002_rls_policies.sql`

The schema script creates the application tables and indexes. The RLS script enables row-level security, grants Data API roles access, and adds policies for Neon Auth users.

Shared lookup tables (`cards` and `solo_battles`) are readable by both anonymous and authenticated users. User-owned tables (`decks`, `deck_cards`, and `deck_games`) are restricted to the current Neon Auth user via `auth.uid()`.
