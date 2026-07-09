-- Paldean Wonders solo battle seed data for public.solo_battles.
-- Source: https://bulbapedia.bulbagarden.net/wiki/List_of_Paldean_Wonders_solo_battles_in_Pok%C3%A9mon_TCG_Pocket
-- Includes only permanent Paldean Wonders solo battles.

delete from public.solo_battles
where expansion = 'Paldean Wonders';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Beginner', 'Paldean Wonders', 'Floragato Deck (Paldean Wonders)'),
  ('Beginner', 'Paldean Wonders', 'Pawmo Deck (Paldean Wonders)'),
  ('Beginner', 'Paldean Wonders', 'Tinkatuff Deck (Paldean Wonders)'),
  ('Intermediate', 'Paldean Wonders', 'Wo-Chien Deck (Paldean Wonders)'),
  ('Intermediate', 'Paldean Wonders', 'Skeledirge Deck (Paldean Wonders)'),
  ('Intermediate', 'Paldean Wonders', 'Quaquaval Deck (Paldean Wonders)'),
  ('Intermediate', 'Paldean Wonders', 'Miraidon Deck (Paldean Wonders)'),
  ('Intermediate', 'Paldean Wonders', 'Tinkaton Deck (Paldean Wonders)'),
  ('Advanced', 'Paldean Wonders', 'Meowscarada ex Deck (Paldean Wonders)'),
  ('Advanced', 'Paldean Wonders', 'Skeledirge Deck (Paldean Wonders)'),
  ('Advanced', 'Paldean Wonders', 'Chien-Pao ex Deck (Paldean Wonders)'),
  ('Advanced', 'Paldean Wonders', 'Bellibolt ex Deck (Paldean Wonders)'),
  ('Advanced', 'Paldean Wonders', 'Gholdengo ex Deck (Paldean Wonders)'),
  ('Expert', 'Paldean Wonders', 'Meowscarada ex & Teal Mask Ogerpon ex Deck (Paldean Wonders)'),
  ('Expert', 'Paldean Wonders', 'Skeledirge Deck (Paldean Wonders)'),
  ('Expert', 'Paldean Wonders', 'Chien-Pao ex & Suicune ex Deck (Paldean Wonders)'),
  ('Expert', 'Paldean Wonders', 'Bellibolt ex & Tapu Koko ex Deck (Paldean Wonders)'),
  ('Expert', 'Paldean Wonders', 'Gholdengo ex & Dialga ex Deck (Paldean Wonders)');
