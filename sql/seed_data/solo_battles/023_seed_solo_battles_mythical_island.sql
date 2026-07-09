-- Mythical Island solo battle seed data for public.solo_battles.
-- Source: https://bulbapedia.bulbagarden.net/wiki/List_of_Mythical_Island_solo_battles_in_Pok%C3%A9mon_TCG_Pocket
-- Includes only permanent Mythical Island solo battles.

delete from public.solo_battles
where expansion = 'Mythical Island';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Advanced', 'Mythical Island', 'Celebi ex Deck (Mythical Island)'),
  ('Advanced', 'Mythical Island', 'Volcarona & Blaine Deck (Mythical Island)'),
  ('Advanced', 'Mythical Island', 'Gyarados ex Deck (Mythical Island)'),
  ('Advanced', 'Mythical Island', 'Raichu & Lt. Surge Deck (Mythical Island)'),
  ('Advanced', 'Mythical Island', 'Mew ex Deck (Mythical Island)'),
  ('Advanced', 'Mythical Island', 'Aerodactyl ex Deck (Mythical Island)'),
  ('Advanced', 'Mythical Island', 'Golem & Brock Deck (Mythical Island)'),
  ('Advanced', 'Mythical Island', 'Blue & Pidgeot ex Deck (Mythical Island)'),
  ('Expert', 'Mythical Island', 'Venusaur ex & Serperior Deck (Mythical Island)'),
  ('Expert', 'Mythical Island', 'Celebi ex & Serperior Deck (Mythical Island)'),
  ('Expert', 'Mythical Island', 'Volcarona & Moltres ex Deck (Mythical Island)'),
  ('Expert', 'Mythical Island', 'Gyarados ex & Vaporeon Deck (Mythical Island)'),
  ('Expert', 'Mythical Island', 'Raichu & Magneton Deck (Mythical Island)'),
  ('Expert', 'Mythical Island', 'Mew ex & Mewtwo ex Deck (Mythical Island)'),
  ('Expert', 'Mythical Island', 'Aerodactyl ex & Marowak ex Deck (Mythical Island)'),
  ('Expert', 'Mythical Island', 'Blue & Pidgeot ex Deck (Mythical Island)');
