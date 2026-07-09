-- Genetic Apex solo battle seed data for public.solo_battles.
-- Source: https://bulbapedia.bulbagarden.net/wiki/List_of_Genetic_Apex_solo_battles_in_Pok%C3%A9mon_TCG_Pocket
-- Includes only permanent Genetic Apex solo battles.

delete from public.solo_battles
where expansion = 'Genetic Apex';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Beginner', 'Genetic Apex', 'Ivysaur Deck (Genetic Apex)'),
  ('Beginner', 'Genetic Apex', 'Charmeleon Deck (Genetic Apex)'),
  ('Beginner', 'Genetic Apex', 'Wartortle Deck (Genetic Apex)'),
  ('Beginner', 'Genetic Apex', 'Heliolisk Deck (Genetic Apex)'),
  ('Beginner', 'Genetic Apex', 'Swoobat Deck (Genetic Apex)'),
  ('Beginner', 'Genetic Apex', 'Grapploct Deck (Genetic Apex)'),
  ('Beginner', 'Genetic Apex', 'Nidorina & Nidorino Deck (Genetic Apex)'),
  ('Intermediate', 'Genetic Apex', 'Venusaur & Exeggutor Deck (Genetic Apex)'),
  ('Intermediate', 'Genetic Apex', 'Charizard & Arcanine Deck (Genetic Apex)'),
  ('Intermediate', 'Genetic Apex', 'Blastoise & Gyarados Deck (Genetic Apex)'),
  ('Intermediate', 'Genetic Apex', 'Magneton & Eelektross Deck (Genetic Apex)'),
  ('Intermediate', 'Genetic Apex', 'Alakazam & Mewtwo Deck (Genetic Apex)'),
  ('Intermediate', 'Genetic Apex', 'Golem & Machamp Deck (Genetic Apex)'),
  ('Intermediate', 'Genetic Apex', 'Nidoking & Muk Deck (Genetic Apex)'),
  ('Advanced', 'Genetic Apex', 'Venusaur ex Deck (Genetic Apex)'),
  ('Advanced', 'Genetic Apex', 'Charizard ex Deck (Genetic Apex)'),
  ('Advanced', 'Genetic Apex', 'Blastoise ex Deck (Genetic Apex)'),
  ('Advanced', 'Genetic Apex', 'Pikachu ex Deck (Genetic Apex)'),
  ('Advanced', 'Genetic Apex', 'Mewtwo ex Deck (Genetic Apex)'),
  ('Advanced', 'Genetic Apex', 'Machamp ex Deck (Genetic Apex)'),
  ('Advanced', 'Genetic Apex', 'Nidoqueen & Nidoking Deck (Genetic Apex)'),
  ('Expert', 'Genetic Apex', 'Venusaur ex & Exeggutor ex Deck (Genetic Apex)'),
  ('Expert', 'Genetic Apex', 'Charizard ex & Moltres ex Deck (Genetic Apex)'),
  ('Expert', 'Genetic Apex', 'Starmie ex & Greninja Deck (Genetic Apex)'),
  ('Expert', 'Genetic Apex', 'Pikachu ex & Raichu Deck (Genetic Apex)'),
  ('Expert', 'Genetic Apex', 'Mewtwo ex & Gardevoir Deck (Genetic Apex)'),
  ('Expert', 'Genetic Apex', 'Machamp ex & Marowak ex Deck (Genetic Apex)');
