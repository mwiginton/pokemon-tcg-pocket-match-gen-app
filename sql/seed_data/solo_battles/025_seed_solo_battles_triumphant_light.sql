-- Triumphant Light solo battle seed data for public.solo_battles.
-- Source: https://bulbapedia.bulbagarden.net/wiki/List_of_Triumphant_Light_solo_battles_in_Pok%C3%A9mon_TCG_Pocket
-- Includes only permanent Triumphant Light solo battles.

delete from public.solo_battles
where expansion = 'Triumphant Light';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Intermediate', 'Triumphant Light', 'Carnivine Deck (Triumphant Light)'),
  ('Intermediate', 'Triumphant Light', 'Abomasnow Deck (Triumphant Light)'),
  ('Intermediate', 'Triumphant Light', 'Tyranitar Deck (Triumphant Light)'),
  ('Intermediate', 'Triumphant Light', 'Magnezone Deck (Triumphant Light)'),
  ('Advanced', 'Triumphant Light', 'Leafeon ex Deck (Triumphant Light)'),
  ('Advanced', 'Triumphant Light', 'Arceus ex & Heatran Deck (Triumphant Light)'),
  ('Advanced', 'Triumphant Light', 'Glaceon ex Deck (Triumphant Light)'),
  ('Advanced', 'Triumphant Light', 'Arceus ex & Raichu Deck (Triumphant Light)'),
  ('Advanced', 'Triumphant Light', 'Garchomp ex Deck (Triumphant Light)'),
  ('Advanced', 'Triumphant Light', 'Arceus ex & Crobat Deck (Triumphant Light)'),
  ('Advanced', 'Triumphant Light', 'Probopass ex Deck (Triumphant Light)'),
  ('Expert', 'Triumphant Light', 'Leafeon ex & Yanmega ex Deck (Triumphant Light)'),
  ('Expert', 'Triumphant Light', 'Arceus ex & Infernape ex Deck (Triumphant Light)'),
  ('Expert', 'Triumphant Light', 'Glaceon ex & Palkia ex Deck (Triumphant Light)'),
  ('Expert', 'Triumphant Light', 'Arceus ex & Pachirisu ex Deck (Triumphant Light)'),
  ('Expert', 'Triumphant Light', 'Garchomp ex & Marshadow Deck (Triumphant Light)'),
  ('Expert', 'Triumphant Light', 'Arceus ex & Weavile ex Deck (Triumphant Light)'),
  ('Expert', 'Triumphant Light', 'Probopass ex & Dialga ex Deck (Triumphant Light)');
