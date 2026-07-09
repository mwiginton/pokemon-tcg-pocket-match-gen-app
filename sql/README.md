# Neon SQL setup

Run these files in order from the Neon SQL Editor:

1. `001_schema.sql`
2. `002_rls_policies.sql`
3. `003_seed_cards_genetic_apex.sql`
4. `004_fix_cards_anonymous_reads.sql`
5. `005_seed_cards_mythical_island.sql`
6. `006_seed_cards_space_time_smackdown.sql`
7. `007_seed_cards_triumphant_light.sql`
8. `008_seed_cards_shining_revelry.sql`
9. `009_seed_cards_extradimensional_crisis.sql`
10. `010_seed_cards_celestial_guardians.sql`
11. `011_seed_cards_wisdom_of_sea_and_sky.sql`
12. `012_seed_cards_eevee_grove.sql`
13. `013_seed_cards_deluxe_pack_ex.sql`
14. `014_seed_cards_mega_rising.sql`
15. `015_seed_cards_crimson_blaze.sql`
16. `016_seed_cards_fantastical_parade.sql`
17. `017_seed_cards_paldean_wonders.sql`
18. `018_seed_cards_mega_shine.sql`
19. `019_seed_cards_pulsing_aura.sql`
20. `020_seed_cards_paradox_drive.sql`
21. `021_seed_cards_everyday_wonders.sql`

The schema script creates the application tables and indexes. The RLS script enables row-level security, grants Data API roles access, and adds policies for Neon Auth users.

The Genetic Apex seed script inserts or updates the `cards` lookup rows for all 286 Genetic Apex (`A1`) cards.

The Mythical Island seed script inserts or updates the `cards` lookup rows for all 86 Mythical Island (`A1a`) cards.

The Space-Time Smackdown seed script inserts or updates the `cards` lookup rows for all 207 Space-Time Smackdown (`A2`) cards.

The Triumphant Light seed script inserts or updates the `cards` lookup rows for all 96 Triumphant Light (`A2a`) cards.

The Shining Revelry seed script inserts or updates the `cards` lookup rows for all 111 Shining Revelry (`A2b`) cards.

The Extradimensional Crisis seed script inserts or updates the `cards` lookup rows for all 103 Extradimensional Crisis (`A3a`) cards.

The Celestial Guardians seed script inserts or updates the `cards` lookup rows for all 239 Celestial Guardians (`A3`) cards.

The Wisdom of Sea and Sky seed script inserts or updates the `cards` lookup rows for all 241 Wisdom of Sea and Sky (`A4`) cards.

The Eevee Grove seed script inserts or updates the `cards` lookup rows for all 107 Eevee Grove (`A3b`) cards.

The Deluxe Pack: ex seed script inserts or updates the `cards` lookup rows for all 379 Deluxe Pack: ex (`A4b`) cards.

The Mega Rising seed script inserts or updates the `cards` lookup rows for all 331 Mega Rising (`B1`) cards.

The Crimson Blaze seed script inserts or updates the `cards` lookup rows for all 103 Crimson Blaze (`B1a`) cards.

The Fantastical Parade seed script inserts or updates the `cards` lookup rows for all 234 Fantastical Parade (`B2`) cards.

The Paldean Wonders seed script inserts or updates the `cards` lookup rows for all 131 Paldean Wonders (`B2a`) cards.

The Mega Shine seed script inserts or updates the `cards` lookup rows for all 117 Mega Shine (`B2b`) cards.

The Pulsing Aura seed script inserts or updates the `cards` lookup rows for all 234 Pulsing Aura (`B3`) cards.

The Paradox Drive seed script inserts or updates the `cards` lookup rows for all 109 Paradox Drive (`B3a`) cards.

The Everyday Wonders seed script inserts or updates the `cards` lookup rows for all 106 Everyday Wonders (`B3b`) cards.

Shared lookup tables (`cards` and `solo_battles`) are readable by both anonymous and authenticated users. User-owned tables (`decks`, `deck_cards`, and `deck_games`) are restricted to the current Neon Auth user via `auth.uid()`.
