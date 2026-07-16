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
22. `022_seed_solo_battles_genetic_apex.sql`
23. `023_seed_solo_battles_mythical_island.sql`
24. `024_seed_solo_battles_space_time_smackdown.sql`
25. `025_seed_solo_battles_triumphant_light.sql`
26. `026_seed_solo_battles_shining_revelry.sql`
27. `027_seed_solo_battles_celestial_guardians.sql`
28. `028_seed_solo_battles_extradimensional_crisis.sql`
29. `029_seed_solo_battles_eevee_grove.sql`
30. `030_seed_solo_battles_wisdom_of_sea_and_sky.sql`
31. `031_seed_solo_battles_secluded_springs.sql`
32. `032_seed_solo_battles_deluxe_pack_ex.sql`
33. `033_seed_solo_battles_mega_rising.sql`
34. `034_seed_solo_battles_crimson_blaze.sql`
35. `035_seed_solo_battles_fantastical_parade.sql`
36. `036_seed_solo_battles_paldean_wonders.sql`
37. `037_seed_solo_battles_mega_shine.sql`
38. `038_seed_solo_battles_pulsing_aura.sql`
39. `039_seed_solo_battles_paradox_drive.sql`
40. `040_fix_neon_auth_rls_user_id.sql`
41. `041_add_deck_game_details.sql`
42. `042_add_deck_game_match_type.sql`
43. `043_ensure_deck_game_logging_columns.sql`
44. `044_allow_tie_game_results.sql`
45. `045_add_deck_game_solo_difficulty.sql`

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

The Genetic Apex solo battles seed script replaces the `solo_battles` lookup rows for all 27 permanent Genetic Apex solo battles.

The Mythical Island solo battles seed script replaces the `solo_battles` lookup rows for all 16 permanent Mythical Island solo battles.

The Space-Time Smackdown solo battles seed script replaces the `solo_battles` lookup rows for all 25 permanent Space-Time Smackdown solo battles.

The Triumphant Light solo battles seed script replaces the `solo_battles` lookup rows for all 18 permanent Triumphant Light solo battles.

The Shining Revelry solo battles seed script replaces the `solo_battles` lookup rows for all 18 permanent Shining Revelry solo battles.

The Celestial Guardians solo battles seed script replaces the `solo_battles` lookup rows for all 27 permanent Celestial Guardians solo battles.

The Extradimensional Crisis solo battles seed script replaces the `solo_battles` lookup rows for all 18 permanent Extradimensional Crisis solo battles.

The Eevee Grove solo battles seed script replaces the `solo_battles` lookup rows for all 19 permanent Eevee Grove solo battles.

The Wisdom of Sea and Sky solo battles seed script replaces the `solo_battles` lookup rows for all 29 permanent Wisdom of Sea and Sky solo battles.

The Secluded Springs solo battles seed script replaces the `solo_battles` lookup rows for all 21 permanent Secluded Springs solo battles.

The Deluxe Pack: ex solo battles seed script replaces the `solo_battles` lookup rows for all 30 permanent Deluxe Pack: ex solo battles.

The Mega Rising solo battles seed script replaces the `solo_battles` lookup rows for all 31 permanent Mega Rising solo battles.

The Crimson Blaze solo battles seed script replaces the `solo_battles` lookup rows for all 18 permanent Crimson Blaze solo battles.

The Fantastical Parade solo battles seed script replaces the `solo_battles` lookup rows for all 27 permanent Fantastical Parade solo battles.

The Paldean Wonders solo battles seed script replaces the `solo_battles` lookup rows for all 18 permanent Paldean Wonders solo battles.

The Mega Shine solo battles seed script replaces the `solo_battles` lookup rows for all 18 permanent Mega Shine solo battles.

The Pulsing Aura solo battles seed script replaces the `solo_battles` lookup rows for all 29 permanent Pulsing Aura solo battles.

The Paradox Drive solo battles seed script replaces the `solo_battles` lookup rows for all 16 permanent Paradox Drive solo battles.

Shared lookup tables (`cards` and `solo_battles`) are readable by both anonymous and authenticated users. User-owned tables (`decks`, `deck_cards`, and `deck_games`) are restricted to the current Neon Auth user via `public.current_neon_auth_user_id()`, which reads the Data API JWT subject from PostgREST request settings.

The deck game details migration adds optional fields for opponent archetype, first/second turn order, turns played, close-game flag, setup timing, MVP card, and notes.

The match type migration marks each deck game as either `solo` or `pvp`, defaulting existing records to `pvp`.

The tie result migration allows logged games to be recorded as `win`, `loss`, or `tie`.

The solo difficulty migration stores the solo battle difficulty on future logged solo matches so win rates can be grouped by difficulty.

If the app reports a missing `deck_games` column while saving a match, run `043_ensure_deck_game_logging_columns.sql`. It safely creates all richer match logging columns and constraints even if one of the previous match logging migrations was skipped.
