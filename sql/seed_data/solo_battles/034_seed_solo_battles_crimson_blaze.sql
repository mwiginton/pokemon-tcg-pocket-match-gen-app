-- Crimson Blaze solo battle seed data for public.solo_battles.
-- Source: https://bulbapedia.bulbagarden.net/wiki/List_of_Crimson_Blaze_solo_battles_in_Pok%C3%A9mon_TCG_Pocket
-- Includes only permanent Crimson Blaze solo battles.

delete from public.solo_battles
where expansion = 'Crimson Blaze';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Beginner', 'Crimson Blaze', 'Bulbasaur Deck (Crimson Blaze)'),
  ('Beginner', 'Crimson Blaze', 'Charmander Deck (Crimson Blaze)'),
  ('Beginner', 'Crimson Blaze', 'Squirtle Deck (Crimson Blaze)'),
  ('Intermediate', 'Crimson Blaze', 'Venusaur Deck (Crimson Blaze)'),
  ('Intermediate', 'Crimson Blaze', 'Charizard Deck (Crimson Blaze)'),
  ('Intermediate', 'Crimson Blaze', 'Blastoise Deck (Crimson Blaze)'),
  ('Intermediate', 'Crimson Blaze', 'Hariyama Deck (Crimson Blaze)'),
  ('Intermediate', 'Crimson Blaze', 'Genesect Deck (Crimson Blaze)'),
  ('Advanced', 'Crimson Blaze', 'Mega Venusaur ex Deck (Crimson Blaze)'),
  ('Advanced', 'Crimson Blaze', 'Mega Charizard Y ex Deck (Crimson Blaze)'),
  ('Advanced', 'Crimson Blaze', 'Mega Blastoise ex Deck (Crimson Blaze)'),
  ('Advanced', 'Crimson Blaze', 'Mega Lopunny ex Deck (Crimson Blaze)'),
  ('Advanced', 'Crimson Blaze', 'Mega Steelix ex Deck (Crimson Blaze)'),
  ('Expert', 'Crimson Blaze', 'Mega Venusaur ex Deck (Crimson Blaze)'),
  ('Expert', 'Crimson Blaze', 'Mega Charizard Y ex & Entei ex Deck (Crimson Blaze)'),
  ('Expert', 'Crimson Blaze', 'Mega Blastoise ex Deck (Crimson Blaze)'),
  ('Expert', 'Crimson Blaze', 'Mega Lopunny ex & Hitmonchan ex Deck (Crimson Blaze)'),
  ('Expert', 'Crimson Blaze', 'Mega Steelix ex Deck (Crimson Blaze)');
