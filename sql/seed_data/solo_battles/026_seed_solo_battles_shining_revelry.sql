-- Shining Revelry solo battle seed data for public.solo_battles.
-- Source: https://bulbapedia.bulbagarden.net/wiki/List_of_Shining_Revelry_solo_battles_in_Pok%C3%A9mon_TCG_Pocket
-- Includes only permanent Shining Revelry solo battles.

delete from public.solo_battles
where expansion = 'Shining Revelry';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Advanced', 'Shining Revelry', 'Beedrill ex Deck (Shining Revelry)'),
  ('Advanced', 'Shining Revelry', 'Charizard ex Deck (Shining Revelry)'),
  ('Advanced', 'Shining Revelry', 'Wugtrio ex Deck (Shining Revelry)'),
  ('Advanced', 'Shining Revelry', 'Pikachu ex Deck (Shining Revelry)'),
  ('Advanced', 'Shining Revelry', 'Giratina ex Deck (Shining Revelry)'),
  ('Advanced', 'Shining Revelry', 'Lucario ex Deck (Shining Revelry)'),
  ('Advanced', 'Shining Revelry', 'Paldean Clodsire ex Deck (Shining Revelry)'),
  ('Advanced', 'Shining Revelry', 'Tinkaton ex Deck (Shining Revelry)'),
  ('Advanced', 'Shining Revelry', 'Bibarel ex Deck (Shining Revelry)'),
  ('Expert', 'Shining Revelry', 'Beedrill ex & Leafeon ex Deck (Shining Revelry)'),
  ('Expert', 'Shining Revelry', 'Charizard ex & Arceus ex Deck (Shining Revelry)'),
  ('Expert', 'Shining Revelry', 'Wugtrio ex & Vaporeon Deck (Shining Revelry)'),
  ('Expert', 'Shining Revelry', 'Pikachu ex & Magnezone Deck (Shining Revelry)'),
  ('Expert', 'Shining Revelry', 'Giratina ex & Mewtwo ex Deck (Shining Revelry)'),
  ('Expert', 'Shining Revelry', 'Lucario ex & Kangaskhan Deck (Shining Revelry)'),
  ('Expert', 'Shining Revelry', 'Paldean Clodsire ex & Darkrai ex Deck (Shining Revelry)'),
  ('Expert', 'Shining Revelry', 'Tinkaton ex & Skarmory Deck (Shining Revelry)'),
  ('Expert', 'Shining Revelry', 'Bibarel ex & Dialga ex Deck (Shining Revelry)');
