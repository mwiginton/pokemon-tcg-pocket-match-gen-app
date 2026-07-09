-- Celestial Guardians solo battle seed data for public.solo_battles.
-- Source: https://bulbapedia.bulbagarden.net/wiki/List_of_Celestial_Guardians_solo_battles_in_Pok%C3%A9mon_TCG_Pocket
-- Includes only permanent Celestial Guardians solo battles.

delete from public.solo_battles
where expansion = 'Celestial Guardians';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Beginner', 'Celestial Guardians', 'Dartrix Deck (Celestial Guardians)'),
  ('Beginner', 'Celestial Guardians', 'Torracat Deck (Celestial Guardians)'),
  ('Beginner', 'Celestial Guardians', 'Brionne Deck (Celestial Guardians)'),
  ('Intermediate', 'Celestial Guardians', 'Alolan Exeggutor Deck (Celestial Guardians)'),
  ('Intermediate', 'Celestial Guardians', 'Turtonator Deck (Celestial Guardians)'),
  ('Intermediate', 'Celestial Guardians', 'Alolan Ninetales Deck (Celestial Guardians)'),
  ('Intermediate', 'Celestial Guardians', 'Alolan Golem Deck (Celestial Guardians)'),
  ('Intermediate', 'Celestial Guardians', 'Necrozma Deck (Celestial Guardians)'),
  ('Intermediate', 'Celestial Guardians', 'Lycanroc Deck (Celestial Guardians)'),
  ('Intermediate', 'Celestial Guardians', 'Alolan Persian Deck (Celestial Guardians)'),
  ('Intermediate', 'Celestial Guardians', 'Alolan Dugtrio Deck (Celestial Guardians)'),
  ('Advanced', 'Celestial Guardians', 'Decidueye ex Deck (Celestial Guardians)'),
  ('Advanced', 'Celestial Guardians', 'Incineroar ex Deck (Celestial Guardians)'),
  ('Advanced', 'Celestial Guardians', 'Crabominable ex Deck (Celestial Guardians)'),
  ('Advanced', 'Celestial Guardians', 'Alolan Raichu ex Deck (Celestial Guardians)'),
  ('Advanced', 'Celestial Guardians', 'Lunala ex Deck (Celestial Guardians)'),
  ('Advanced', 'Celestial Guardians', 'Passimian ex Deck (Celestial Guardians)'),
  ('Advanced', 'Celestial Guardians', 'Alolan Muk ex Deck (Celestial Guardians)'),
  ('Advanced', 'Celestial Guardians', 'Solgaleo ex Deck (Celestial Guardians)'),
  ('Expert', 'Celestial Guardians', 'Decidueye ex & Lurantis Deck (Celestial Guardians)'),
  ('Expert', 'Celestial Guardians', 'Incineroar ex & Moltres ex Deck (Celestial Guardians)'),
  ('Expert', 'Celestial Guardians', 'Crabominable ex & Primarina Deck (Celestial Guardians)'),
  ('Expert', 'Celestial Guardians', 'Alolan Raichu ex & Oricorio Deck (Celestial Guardians)'),
  ('Expert', 'Celestial Guardians', 'Lunala ex & Giratina ex Deck (Celestial Guardians)'),
  ('Expert', 'Celestial Guardians', 'Passimian ex & Lucario ex Deck (Celestial Guardians)'),
  ('Expert', 'Celestial Guardians', 'Alolan Muk ex & Toxapex Deck (Celestial Guardians)'),
  ('Expert', 'Celestial Guardians', 'Solgaleo ex & Excadrill Deck (Celestial Guardians)');
