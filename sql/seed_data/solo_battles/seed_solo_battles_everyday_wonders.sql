-- Everyday Wonders solo battle seed data for public.solo_battles.
-- Includes only permanent Everyday Wonders solo battles.

delete from public.solo_battles
where expansion = 'Everyday Wonders';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Beginner', 'Everyday Wonders', 'Seaking Deck (Everyday Wonders)'),
  ('Beginner', 'Everyday Wonders', 'Slowbro Deck (Everyday Wonders)'),
  ('Beginner', 'Everyday Wonders', 'Scrafty Deck (Everyday Wonders)'),
  ('Intermediate', 'Everyday Wonders', 'Froslass Deck (Everyday Wonders)'),
  ('Intermediate', 'Everyday Wonders', 'Enamorous Deck (Everyday Wonders)'),
  ('Intermediate', 'Everyday Wonders', 'Toxapex Deck (Everyday Wonders)'),
  ('Advanced', 'Everyday Wonders', 'Iron Bundle ex Deck (Everyday Wonders)'),
  ('Advanced', 'Everyday Wonders', 'Milotic ex Deck (Everyday Wonders)'),
  ('Advanced', 'Everyday Wonders', 'Dedenne ex Deck (Everyday Wonders)'),
  ('Advanced', 'Everyday Wonders', 'Mega Diance ex Deck (Everyday Wonders)'),
  ('Advanced', 'Everyday Wonders', 'Mega Sableye ex Deck (Everyday Wonders)'),
  ('Advanced', 'Everyday Wonders', 'Hisuian Zoroark ex Deck (Everyday Wonders)'),
  ('Expert', 'Everyday Wonders', 'Milotic ex Deck (Everyday Wonders)'),
  ('Expert', 'Everyday Wonders', 'Dedenne ex Deck (Everyday Wonders)'),
  ('Expert', 'Everyday Wonders', 'Mega Diance ex Deck (Everyday Wonders)'),
  ('Expert', 'Everyday Wonders', 'Mega Sableye ex Deck (Everyday Wonders)'),
  ('Expert', 'Everyday Wonders', 'Hisuain Zoroark ex Deck (Everyday Wonders)')

