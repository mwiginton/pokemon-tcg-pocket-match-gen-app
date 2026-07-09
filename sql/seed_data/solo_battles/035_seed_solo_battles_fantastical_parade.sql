-- Fantastical Parade solo battle seed data for public.solo_battles.
-- Source: https://bulbapedia.bulbagarden.net/wiki/List_of_Fantastical_Parade_solo_battles_in_Pok%C3%A9mon_TCG_Pocket
-- Includes only permanent Fantastical Parade solo battles.

delete from public.solo_battles
where expansion = 'Fantastical Parade';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Beginner', 'Fantastical Parade', 'Quilladin Deck (Fantastical Parade)'),
  ('Beginner', 'Fantastical Parade', 'Boldore Deck (Fantastical Parade)'),
  ('Beginner', 'Fantastical Parade', 'Galarian Linoone Deck (Fantastical Parade)'),
  ('Intermediate', 'Fantastical Parade', 'Roserade Deck (Fantastical Parade)'),
  ('Intermediate', 'Fantastical Parade', 'Cinderace Deck (Fantastical Parade)'),
  ('Intermediate', 'Fantastical Parade', 'Swampert Deck (Fantastical Parade)'),
  ('Intermediate', 'Fantastical Parade', 'Alolan Raichu Deck (Fantastical Parade)'),
  ('Intermediate', 'Fantastical Parade', 'Gardevoir Deck (Fantastical Parade)'),
  ('Intermediate', 'Fantastical Parade', 'Cornerstone Mask Ogerpon Deck (Fantastical Parade)'),
  ('Intermediate', 'Fantastical Parade', 'Aegislash Deck (Fantastical Parade)'),
  ('Intermediate', 'Fantastical Parade', 'Kangaskhan Deck (Fantastical Parade)'),
  ('Advanced', 'Fantastical Parade', 'Teal Mask Ogerpon ex Deck (Fantastical Parade)'),
  ('Advanced', 'Fantastical Parade', 'Blacephalon ex Deck (Fantastical Parade)'),
  ('Advanced', 'Fantastical Parade', 'Mega Swampert ex Deck (Fantastical Parade)'),
  ('Advanced', 'Fantastical Parade', 'Toxtricity ex Deck (Fantastical Parade)'),
  ('Advanced', 'Fantastical Parade', 'Mega Gardevoir ex Deck (Fantastical Parade)'),
  ('Advanced', 'Fantastical Parade', 'Gigalith ex Deck (Fantastical Parade)'),
  ('Advanced', 'Fantastical Parade', 'Mega Mawile ex Deck (Fantastical Parade)'),
  ('Advanced', 'Fantastical Parade', 'Mega Kangaskhan ex Deck (Fantastical Parade)'),
  ('Expert', 'Fantastical Parade', 'Teal Mask Ogerpon ex & Leafeon ex Deck (Fantastical Parade)'),
  ('Expert', 'Fantastical Parade', 'Blacephalon ex & Mega Blaziken ex Deck (Fantastical Parade)'),
  ('Expert', 'Fantastical Parade', 'Mega Swampert ex & Suicune ex Deck (Fantastical Parade)'),
  ('Expert', 'Fantastical Parade', 'Toxtricity ex & Raikou ex Deck (Fantastical Parade)'),
  ('Expert', 'Fantastical Parade', 'Mega Gardevoir ex & Mewtwo ex Deck (Fantastical Parade)'),
  ('Expert', 'Fantastical Parade', 'Gigalith ex & Passimian ex Deck (Fantastical Parade)'),
  ('Expert', 'Fantastical Parade', 'Mega Mawile ex Deck (Fantastical Parade)'),
  ('Expert', 'Fantastical Parade', 'Mega Kangaskhan ex Deck (Fantastical Parade)');
