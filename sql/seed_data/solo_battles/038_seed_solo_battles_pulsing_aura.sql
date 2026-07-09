-- Pulsing Aura solo battle seed data for public.solo_battles.
-- Source: https://bulbapedia.bulbagarden.net/wiki/List_of_Pulsing_Aura_solo_battles_in_Pok%C3%A9mon_TCG_Pocket
-- Includes only permanent Pulsing Aura solo battles.

delete from public.solo_battles
where expansion = 'Pulsing Aura';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Beginner', 'Pulsing Aura', 'Masquerain Deck (Pulsing Aura)'),
  ('Beginner', 'Pulsing Aura', 'Carkol Deck (Pulsing Aura)'),
  ('Beginner', 'Pulsing Aura', 'Golbat Deck (Pulsing Aura)'),
  ('Intermediate', 'Pulsing Aura', 'Flapple Deck (Pulsing Aura)'),
  ('Intermediate', 'Pulsing Aura', 'Emboar Deck (Pulsing Aura)'),
  ('Intermediate', 'Pulsing Aura', 'Politoed Deck (Pulsing Aura)'),
  ('Intermediate', 'Pulsing Aura', 'Zekrom Deck (Pulsing Aura)'),
  ('Intermediate', 'Pulsing Aura', 'Meloetta Deck (Pulsing Aura)'),
  ('Intermediate', 'Pulsing Aura', 'Crobat Deck (Pulsing Aura)'),
  ('Intermediate', 'Pulsing Aura', 'Melmetal Deck (Pulsing Aura)'),
  ('Intermediate', 'Pulsing Aura', 'Blissey Deck (Pulsing Aura)'),
  ('Advanced', 'Pulsing Aura', 'Mega Sceptile ex Deck (Pulsing Aura)'),
  ('Advanced', 'Pulsing Aura', 'Mega Camerupt ex Deck (Pulsing Aura)'),
  ('Advanced', 'Pulsing Aura', 'Vaporeon ex Deck (Pulsing Aura)'),
  ('Advanced', 'Pulsing Aura', 'Magnezone ex Deck (Pulsing Aura)'),
  ('Advanced', 'Pulsing Aura', 'Mega Lucario ex Deck (Pulsing Aura)'),
  ('Advanced', 'Pulsing Aura', 'Zoroark ex Deck (Pulsing Aura)'),
  ('Advanced', 'Pulsing Aura', 'Corviknight ex Deck (Pulsing Aura)'),
  ('Advanced', 'Pulsing Aura', 'Flygon ex Deck (Pulsing Aura)'),
  ('Advanced', 'Pulsing Aura', 'Mega Audino ex Deck (Pulsing Aura)'),
  ('Expert', 'Pulsing Aura', 'Mega Sceptile ex Deck (Pulsing Aura)'),
  ('Expert', 'Pulsing Aura', 'Mega Camerupt ex Deck (Pulsing Aura)'),
  ('Expert', 'Pulsing Aura', 'Vaporeon ex Deck (Pulsing Aura)'),
  ('Expert', 'Pulsing Aura', 'Magnezone ex Deck (Pulsing Aura)'),
  ('Expert', 'Pulsing Aura', 'Mega Lucario ex Deck (Pulsing Aura)'),
  ('Expert', 'Pulsing Aura', 'Zoroark ex Deck (Pulsing Aura)'),
  ('Expert', 'Pulsing Aura', 'Corviknight ex Deck (Pulsing Aura)'),
  ('Expert', 'Pulsing Aura', 'Flygon ex Deck (Pulsing Aura)'),
  ('Expert', 'Pulsing Aura', 'Mega Audino ex Deck (Pulsing Aura)');
