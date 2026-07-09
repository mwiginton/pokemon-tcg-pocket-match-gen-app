-- Space-Time Smackdown solo battle seed data for public.solo_battles.
-- Source: https://bulbapedia.bulbagarden.net/wiki/List_of_Space-Time_Smackdown_solo_battles_in_Pok%C3%A9mon_TCG_Pocket
-- Includes only permanent Space-Time Smackdown solo battles.

delete from public.solo_battles
where expansion = 'Space-Time Smackdown';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Intermediate', 'Space-Time Smackdown', 'Torterra & Shaymin Deck (Space-Time Smackdown)'),
  ('Intermediate', 'Space-Time Smackdown', 'Magmortar & Regigigas Deck (Space-Time Smackdown)'),
  ('Intermediate', 'Space-Time Smackdown', 'Glaceon & Mamoswine Deck (Space-Time Smackdown)'),
  ('Intermediate', 'Space-Time Smackdown', 'Magnezone & Electivire Deck (Space-Time Smackdown)'),
  ('Intermediate', 'Space-Time Smackdown', 'Togekiss & Giratina Deck (Space-Time Smackdown)'),
  ('Intermediate', 'Space-Time Smackdown', 'Rampardos & Rhyperior Deck (Space-Time Smackdown)'),
  ('Intermediate', 'Space-Time Smackdown', 'Darkrai & Regigigas Deck (Space-Time Smackdown)'),
  ('Intermediate', 'Space-Time Smackdown', 'Bastiodon & Heatran Deck (Space-Time Smackdown)'),
  ('Advanced', 'Space-Time Smackdown', 'Yanmega ex Deck (Space-Time Smackdown)'),
  ('Advanced', 'Space-Time Smackdown', 'Infernape ex Deck (Space-Time Smackdown)'),
  ('Advanced', 'Space-Time Smackdown', 'Palkia ex Deck (Space-Time Smackdown)'),
  ('Advanced', 'Space-Time Smackdown', 'Pachirisu ex Deck (Space-Time Smackdown)'),
  ('Advanced', 'Space-Time Smackdown', 'Mismagius ex Deck (Space-Time Smackdown)'),
  ('Advanced', 'Space-Time Smackdown', 'Gallade ex Deck (Space-Time Smackdown)'),
  ('Advanced', 'Space-Time Smackdown', 'Darkrai ex Deck (Space-Time Smackdown)'),
  ('Advanced', 'Space-Time Smackdown', 'Dialga ex Deck (Space-Time Smackdown)'),
  ('Advanced', 'Space-Time Smackdown', 'Lickilicky ex Deck (Space-Time Smackdown)'),
  ('Expert', 'Space-Time Smackdown', 'Yanmega ex & Exeggutor ex Deck (Space-Time Smackdown)'),
  ('Expert', 'Space-Time Smackdown', 'Infernape ex & Rapidash Deck (Space-Time Smackdown)'),
  ('Expert', 'Space-Time Smackdown', 'Palkia ex & Vaporeon Deck (Space-Time Smackdown)'),
  ('Expert', 'Space-Time Smackdown', 'Pachirisu ex & Pikachu ex Deck (Space-Time Smackdown)'),
  ('Expert', 'Space-Time Smackdown', 'Mismagius ex & Gardevoir Deck (Space-Time Smackdown)'),
  ('Expert', 'Space-Time Smackdown', 'Gallade ex & Lucario Deck (Space-Time Smackdown)'),
  ('Expert', 'Space-Time Smackdown', 'Darkrai ex & Weavile ex Deck (Space-Time Smackdown)'),
  ('Expert', 'Space-Time Smackdown', 'Dialga ex & Melmetal Deck (Space-Time Smackdown)');
