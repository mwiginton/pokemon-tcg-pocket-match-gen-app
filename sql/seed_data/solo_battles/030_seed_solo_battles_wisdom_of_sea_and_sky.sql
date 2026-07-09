-- Wisdom of Sea and Sky solo battle seed data for public.solo_battles.
-- Source: https://bulbapedia.bulbagarden.net/wiki/List_of_Wisdom_of_Sea_and_Sky_solo_battles_in_Pok%C3%A9mon_TCG_Pocket
-- Includes only permanent Wisdom of Sea and Sky solo battles.

delete from public.solo_battles
where expansion = 'Wisdom of Sea and Sky';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Beginner', 'Wisdom of Sea and Sky', 'Bayleef Deck (Wisdom of Sea and Sky)'),
  ('Beginner', 'Wisdom of Sea and Sky', 'Quilava Deck (Wisdom of Sea and Sky)'),
  ('Beginner', 'Wisdom of Sea and Sky', 'Croconaw Deck (Wisdom of Sea and Sky)'),
  ('Intermediate', 'Wisdom of Sea and Sky', 'Meganium Deck (Wisdom of Sea and Sky)'),
  ('Intermediate', 'Wisdom of Sea and Sky', 'Entei Deck (Wisdom of Sea and Sky)'),
  ('Intermediate', 'Wisdom of Sea and Sky', 'Suicune Deck (Wisdom of Sea and Sky)'),
  ('Intermediate', 'Wisdom of Sea and Sky', 'Raikou Deck (Wisdom of Sea and Sky)'),
  ('Intermediate', 'Wisdom of Sea and Sky', 'Togekiss Deck (Wisdom of Sea and Sky)'),
  ('Intermediate', 'Wisdom of Sea and Sky', 'Mamoswine Deck (Wisdom of Sea and Sky)'),
  ('Intermediate', 'Wisdom of Sea and Sky', 'Tyranitar Deck (Wisdom of Sea and Sky)'),
  ('Intermediate', 'Wisdom of Sea and Sky', 'Scizor Deck (Wisdom of Sea and Sky)'),
  ('Intermediate', 'Wisdom of Sea and Sky', 'Porygon-Z Deck (Wisdom of Sea and Sky)'),
  ('Advanced', 'Wisdom of Sea and Sky', 'Shuckle ex & Meganium Deck (Wisdom of Sea and Sky)'),
  ('Advanced', 'Wisdom of Sea and Sky', 'Ho-Oh ex & Entei Deck (Wisdom of Sea and Sky)'),
  ('Advanced', 'Wisdom of Sea and Sky', 'Kingdra ex Deck (Wisdom of Sea and Sky)'),
  ('Advanced', 'Wisdom of Sea and Sky', 'Lanturn ex Deck (Wisdom of Sea and Sky)'),
  ('Advanced', 'Wisdom of Sea and Sky', 'Espeon ex Deck (Wisdom of Sea and Sky)'),
  ('Advanced', 'Wisdom of Sea and Sky', 'Donphan ex Deck (Wisdom of Sea and Sky)'),
  ('Advanced', 'Wisdom of Sea and Sky', 'Umbreon ex Deck (Wisdom of Sea and Sky)'),
  ('Advanced', 'Wisdom of Sea and Sky', 'Skarmory ex & Scizor Deck (Wisdom of Sea and Sky)'),
  ('Advanced', 'Wisdom of Sea and Sky', 'Lugia ex Deck (Wisdom of Sea and Sky)'),
  ('Expert', 'Wisdom of Sea and Sky', 'Shuckle ex & Venusaur ex Deck (Wisdom of Sea and Sky)'),
  ('Expert', 'Wisdom of Sea and Sky', 'Lugia ex & Ho-Oh ex Deck (Wisdom of Sea and Sky)'),
  ('Expert', 'Wisdom of Sea and Sky', 'Kingdra ex Deck (Wisdom of Sea and Sky)'),
  ('Expert', 'Wisdom of Sea and Sky', 'Lanturn ex Deck (Wisdom of Sea and Sky)'),
  ('Expert', 'Wisdom of Sea and Sky', 'Espeon ex & Sylveon ex Deck (Wisdom of Sea and Sky)'),
  ('Expert', 'Wisdom of Sea and Sky', 'Donphan ex & Lucario Deck (Wisdom of Sea and Sky)'),
  ('Expert', 'Wisdom of Sea and Sky', 'Umbreon ex & Darkrai ex Deck (Wisdom of Sea and Sky)'),
  ('Expert', 'Wisdom of Sea and Sky', 'Skarmory ex & Scizor Deck (Wisdom of Sea and Sky)');
