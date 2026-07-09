-- Eevee Grove solo battle seed data for public.solo_battles.
-- Source: https://bulbapedia.bulbagarden.net/wiki/List_of_Eevee_Grove_solo_battles_in_Pok%C3%A9mon_TCG_Pocket
-- Includes only permanent Eevee Grove solo battles.

delete from public.solo_battles
where expansion = 'Eevee Grove';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Beginner', 'Eevee Grove', 'Steenee Deck (Eevee Grove)'),
  ('Beginner', 'Eevee Grove', 'Torracat Deck (Eevee Grove)'),
  ('Beginner', 'Eevee Grove', 'Brionne Deck (Eevee Grove)'),
  ('Intermediate', 'Eevee Grove', 'Leafeon Deck (Eevee Grove)'),
  ('Intermediate', 'Eevee Grove', 'Flareon Deck (Eevee Grove)'),
  ('Intermediate', 'Eevee Grove', 'Vaporeon & Glaceon Deck (Eevee Grove)'),
  ('Intermediate', 'Eevee Grove', 'Jolteon Deck (Eevee Grove)'),
  ('Intermediate', 'Eevee Grove', 'Espeon & Sylveon Deck (Eevee Grove)'),
  ('Intermediate', 'Eevee Grove', 'Umbreon Deck (Eevee Grove)'),
  ('Intermediate', 'Eevee Grove', 'Melmetal Deck (Eevee Grove)'),
  ('Advanced', 'Eevee Grove', 'Flareon ex & Eevee ex Deck (Eevee Grove)'),
  ('Advanced', 'Eevee Grove', 'Primarina ex Deck (Eevee Grove)'),
  ('Advanced', 'Eevee Grove', 'Sylveon ex & Eevee ex Deck (Eevee Grove)'),
  ('Advanced', 'Eevee Grove', 'Dragonite ex Deck (Eevee Grove)'),
  ('Advanced', 'Eevee Grove', 'Snorlax ex Deck (Eevee Grove)'),
  ('Expert', 'Eevee Grove', 'Tsareena & Buzzwole ex Deck (Eevee Grove)'),
  ('Expert', 'Eevee Grove', 'Flareon ex & Flareon Deck (Eevee Grove)'),
  ('Expert', 'Eevee Grove', 'Primarina ex & Pyukumuku Deck (Eevee Grove)'),
  ('Expert', 'Eevee Grove', 'Sylveon ex & Sylveon Deck (Eevee Grove)');
