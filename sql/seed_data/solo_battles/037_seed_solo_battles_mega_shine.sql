-- Mega Shine solo battle seed data for public.solo_battles.
-- Source: https://bulbapedia.bulbagarden.net/wiki/List_of_Mega_Shine_solo_battles_in_Pok%C3%A9mon_TCG_Pocket
-- Includes only permanent Mega Shine solo battles.

delete from public.solo_battles
where expansion = 'Mega Shine';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Beginner', 'Mega Shine', 'Magmortar Deck (Mega Shine)'),
  ('Beginner', 'Mega Shine', 'Prinplup Deck (Mega Shine)'),
  ('Beginner', 'Mega Shine', 'Morpeko Deck (Mega Shine)'),
  ('Intermediate', 'Mega Shine', 'Paldean Tauros Deck (Mega Shine)'),
  ('Intermediate', 'Mega Shine', 'Empoleon Deck (Mega Shine)'),
  ('Intermediate', 'Mega Shine', 'Raichu Deck (Mega Shine)'),
  ('Intermediate', 'Mega Shine', 'Zoroark Deck (Mega Shine)'),
  ('Intermediate', 'Mega Shine', 'Revavroom Deck (Mega Shine)'),
  ('Advanced', 'Mega Shine', 'Mega Charizard X ex Deck (Mega Shine)'),
  ('Advanced', 'Mega Shine', 'Mega Slowbro ex Deck (Mega Shine)'),
  ('Advanced', 'Mega Shine', 'Mega Manectric ex Deck (Mega Shine)'),
  ('Advanced', 'Mega Shine', 'Mega Gengar ex Deck (Mega Shine)'),
  ('Advanced', 'Mega Shine', 'Mega Scizor ex Deck (Mega Shine)'),
  ('Expert', 'Mega Shine', 'Mega Charizard X ex & Entei ex Deck (Mega Shine)'),
  ('Expert', 'Mega Shine', 'Mega Slowbro ex Deck (Mega Shine)'),
  ('Expert', 'Mega Shine', 'Mega Manectric ex & Jolteon ex Deck (Mega Shine)'),
  ('Expert', 'Mega Shine', 'Mega Gengar ex Deck (Mega Shine)'),
  ('Expert', 'Mega Shine', 'Mega Scizor ex Deck (Mega Shine)');
