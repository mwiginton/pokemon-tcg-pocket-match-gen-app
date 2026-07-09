-- Paradox Drive solo battle seed data for public.solo_battles.
-- Source: https://bulbapedia.bulbagarden.net/wiki/List_of_Paradox_Drive_solo_battles_in_Pok%C3%A9mon_TCG_Pocket
-- Includes only permanent Paradox Drive solo battles.

delete from public.solo_battles
where expansion = 'Paradox Drive';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Beginner', 'Paradox Drive', 'Golduck Deck (Paradox Drive)'),
  ('Beginner', 'Paradox Drive', 'Houndstone Deck (Paradox Drive)'),
  ('Beginner', 'Paradox Drive', 'Farigiraf Deck (Paradox Drive)'),
  ('Intermediate', 'Paradox Drive', 'Vaporeon Deck (Paradox Drive)'),
  ('Intermediate', 'Paradox Drive', 'Espathra Deck (Paradox Drive)'),
  ('Intermediate', 'Paradox Drive', 'Dudunsparce Deck (Paradox Drive)'),
  ('Advanced', 'Paradox Drive', 'Iron Bundle ex Deck (Paradox Drive)'),
  ('Advanced', 'Paradox Drive', 'Miraidon ex Deck (Paradox Drive)'),
  ('Advanced', 'Paradox Drive', 'Flutter Mane ex Deck (Paradox Drive)'),
  ('Advanced', 'Paradox Drive', 'Koraidon ex Deck (Paradox Drive)'),
  ('Advanced', 'Paradox Drive', 'Terapagos ex Deck (Paradox Drive)'),
  ('Expert', 'Paradox Drive', 'Iron Bundle ex Deck (Paradox Drive)'),
  ('Expert', 'Paradox Drive', 'Miraidon ex Deck (Paradox Drive)'),
  ('Expert', 'Paradox Drive', 'Flutter Mane ex Deck (Paradox Drive)'),
  ('Expert', 'Paradox Drive', 'Koraidon ex Deck (Paradox Drive)'),
  ('Expert', 'Paradox Drive', 'Terapagos ex Deck (Paradox Drive)');
