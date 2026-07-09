-- Mega Rising solo battle seed data for public.solo_battles.
-- Source: https://bulbapedia.bulbagarden.net/wiki/List_of_Mega_Rising_solo_battles_in_Pok%C3%A9mon_TCG_Pocket
-- Includes only permanent Mega Rising solo battles.

delete from public.solo_battles
where expansion = 'Mega Rising';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Beginner', 'Mega Rising', 'Pinsir Deck (Mega Rising)'),
  ('Beginner', 'Mega Rising', 'Combusken Deck (Mega Rising)'),
  ('Beginner', 'Mega Rising', 'Frogadier Deck (Mega Rising)'),
  ('Beginner', 'Mega Rising', 'Luxio Deck (Mega Rising)'),
  ('Beginner', 'Mega Rising', 'Gothorita Deck (Mega Rising)'),
  ('Beginner', 'Mega Rising', 'Carkol Deck (Mega Rising)'),
  ('Beginner', 'Mega Rising', 'Absol Deck (Mega Rising)'),
  ('Intermediate', 'Mega Rising', 'Beautifly & Dustox Deck (Mega Rising)'),
  ('Intermediate', 'Mega Rising', 'Ho-Oh & Blaziken Deck (Mega Rising)'),
  ('Intermediate', 'Mega Rising', 'Gyarados & Keldeo Deck (Mega Rising)'),
  ('Intermediate', 'Mega Rising', 'Luxray & Ampharos Deck (Mega Rising)'),
  ('Intermediate', 'Mega Rising', 'Gothitelle & Altaria Deck (Mega Rising)'),
  ('Intermediate', 'Mega Rising', 'Krookodile & Terrakion Deck (Mega Rising)'),
  ('Intermediate', 'Mega Rising', 'Hydreigon & Grimmsnarl Deck (Mega Rising)'),
  ('Intermediate', 'Mega Rising', 'Aegislash & Corviknight Deck (Mega Rising)'),
  ('Advanced', 'Mega Rising', 'Mega Pinsir ex Deck (Mega Rising)'),
  ('Advanced', 'Mega Rising', 'Mega Blaziken ex Deck (Mega Rising)'),
  ('Advanced', 'Mega Rising', 'Mega Gyarados ex Deck (Mega Rising)'),
  ('Advanced', 'Mega Rising', 'Jolteon ex Deck (Mega Rising)'),
  ('Advanced', 'Mega Rising', 'Mega Altaria ex Deck (Mega Rising)'),
  ('Advanced', 'Mega Rising', 'Hitmonchan ex Deck (Mega Rising)'),
  ('Advanced', 'Mega Rising', 'Mega Absol ex Deck (Mega Rising)'),
  ('Advanced', 'Mega Rising', 'Melmetal ex Deck (Mega Rising)'),
  ('Expert', 'Mega Rising', 'Mega Pinsir ex & Leafeon ex Deck (Mega Rising)'),
  ('Expert', 'Mega Rising', 'Mega Blaziken ex & Entei ex Deck (Mega Rising)'),
  ('Expert', 'Mega Rising', 'Mega Gyarados ex & Jellicent Deck (Mega Rising)'),
  ('Expert', 'Mega Rising', 'Jolteon ex & Pikachu ex Deck (Mega Rising)'),
  ('Expert', 'Mega Rising', 'Mega Altaria ex & Indeedee ex Deck (Mega Rising)'),
  ('Expert', 'Mega Rising', 'Hitmonchan ex & Donphan ex Deck (Mega Rising)'),
  ('Expert', 'Mega Rising', 'Mega Absol ex & Hydreigon Deck (Mega Rising)'),
  ('Expert', 'Mega Rising', 'Melmetal ex & Dialga ex Deck (Mega Rising)');
