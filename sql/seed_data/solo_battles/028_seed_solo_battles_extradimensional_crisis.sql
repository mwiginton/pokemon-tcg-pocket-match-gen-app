-- Extradimensional Crisis solo battle seed data for public.solo_battles.
-- Source: https://bulbapedia.bulbagarden.net/wiki/List_of_Extradimensional_Crisis_solo_battles_in_Pok%C3%A9mon_TCG_Pocket
-- Includes only permanent Extradimensional Crisis solo battles.

delete from public.solo_battles
where expansion = 'Extradimensional Crisis';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Beginner', 'Extradimensional Crisis', 'Luxio Deck (Extradimensional Crisis)'),
  ('Beginner', 'Extradimensional Crisis', 'Krokorok Deck (Extradimensional Crisis)'),
  ('Beginner', 'Extradimensional Crisis', 'Lairon Deck (Extradimensional Crisis)'),
  ('Intermediate', 'Extradimensional Crisis', 'Decidueye Deck (Extradimensional Crisis)'),
  ('Intermediate', 'Extradimensional Crisis', 'Zeraora Deck (Extradimensional Crisis)'),
  ('Intermediate', 'Extradimensional Crisis', 'Naganadel Deck (Extradimensional Crisis)'),
  ('Intermediate', 'Extradimensional Crisis', 'Stakataka Deck (Extradimensional Crisis)'),
  ('Intermediate', 'Extradimensional Crisis', 'Stoutland Deck (Extradimensional Crisis)'),
  ('Advanced', 'Extradimensional Crisis', 'Buzzwole ex Deck (Extradimensional Crisis)'),
  ('Advanced', 'Extradimensional Crisis', 'Tapu Koko ex Deck (Extradimensional Crisis)'),
  ('Advanced', 'Extradimensional Crisis', 'Lycanroc ex Deck (Extradimensional Crisis)'),
  ('Advanced', 'Extradimensional Crisis', 'Guzzlord ex Deck (Extradimensional Crisis)'),
  ('Advanced', 'Extradimensional Crisis', 'Alolan Dugtrio ex Deck (Extradimensional Crisis)'),
  ('Expert', 'Extradimensional Crisis', 'Buzzwole ex Deck (Extradimensional Crisis)'),
  ('Expert', 'Extradimensional Crisis', 'Tapu Koko ex & Pikachu ex Deck (Extradimensional Crisis)'),
  ('Expert', 'Extradimensional Crisis', 'Lycanroc ex & Passimian ex Deck (Extradimensional Crisis)'),
  ('Expert', 'Extradimensional Crisis', 'Guzzlord ex & Naganadel Deck (Extradimensional Crisis)'),
  ('Expert', 'Extradimensional Crisis', 'Alolan Dugtrio ex & Skarmory Deck (Extradimensional Crisis)');
