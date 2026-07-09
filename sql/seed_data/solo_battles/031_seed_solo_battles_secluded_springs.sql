-- Secluded Springs solo battle seed data for public.solo_battles.
-- Source: https://bulbapedia.bulbagarden.net/wiki/List_of_Secluded_Springs_solo_battles_in_Pok%C3%A9mon_TCG_Pocket
-- Includes only permanent Secluded Springs solo battles.

delete from public.solo_battles
where expansion = 'Secluded Springs';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Beginner', 'Secluded Springs', 'Fletchinder Deck (Secluded Springs)'),
  ('Beginner', 'Secluded Springs', 'Poliwhirl Deck (Secluded Springs)'),
  ('Beginner', 'Secluded Springs', 'Eelektrik Deck (Secluded Springs)'),
  ('Intermediate', 'Secluded Springs', 'Sunflora Deck (Secluded Springs)'),
  ('Intermediate', 'Secluded Springs', 'Talonflame Deck (Secluded Springs)'),
  ('Intermediate', 'Secluded Springs', 'Milotic Deck (Secluded Springs)'),
  ('Intermediate', 'Secluded Springs', 'Eelektross Deck (Secluded Springs)'),
  ('Intermediate', 'Secluded Springs', 'Latios & Latias Deck (Secluded Springs)'),
  ('Intermediate', 'Secluded Springs', 'Donphan Deck (Secluded Springs)'),
  ('Advanced', 'Secluded Springs', 'Jumpluff ex Deck (Secluded Springs)'),
  ('Advanced', 'Secluded Springs', 'Entei ex Deck (Secluded Springs)'),
  ('Advanced', 'Secluded Springs', 'Suicune ex Deck (Secluded Springs)'),
  ('Advanced', 'Secluded Springs', 'Raikou ex Deck (Secluded Springs)'),
  ('Advanced', 'Secluded Springs', 'Latios & Latias Deck (Secluded Springs)'),
  ('Advanced', 'Secluded Springs', 'Poliwrath ex Deck (Secluded Springs)'),
  ('Expert', 'Secluded Springs', 'Jumpluff ex & Shuckle ex Deck (Secluded Springs)'),
  ('Expert', 'Secluded Springs', 'Entei ex & Flareon ex Deck (Secluded Springs)'),
  ('Expert', 'Secluded Springs', 'Suicune ex & Milotic Deck (Secluded Springs)'),
  ('Expert', 'Secluded Springs', 'Raikou ex & Pikachu ex Deck (Secluded Springs)'),
  ('Expert', 'Secluded Springs', 'Latios & Latias Deck (Secluded Springs)'),
  ('Expert', 'Secluded Springs', 'Poliwrath ex & Politoed Deck (Secluded Springs)');
