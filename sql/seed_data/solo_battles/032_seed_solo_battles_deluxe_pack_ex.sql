-- Deluxe Pack: ex solo battle seed data for public.solo_battles.
-- Source: https://bulbapedia.bulbagarden.net/wiki/List_of_Deluxe_Pack%3A_ex_solo_battles_in_Pok%C3%A9mon_TCG_Pocket
-- Includes only permanent Deluxe Pack: ex solo battles.

delete from public.solo_battles
where expansion = 'Deluxe Pack: ex';

insert into public.solo_battles (difficulty, expansion, deck_name)
values
  ('Beginner', 'Deluxe Pack: ex', 'Skiploom Deck (Deluxe Pack: ex)'),
  ('Beginner', 'Deluxe Pack: ex', 'Frogadier Deck (Deluxe Pack: ex)'),
  ('Beginner', 'Deluxe Pack: ex', 'Gabite Deck (Deluxe Pack: ex)'),
  ('Intermediate', 'Deluxe Pack: ex', 'Meowscarada Deck (Deluxe Pack: ex)'),
  ('Intermediate', 'Deluxe Pack: ex', 'Heatran Deck (Deluxe Pack: ex)'),
  ('Intermediate', 'Deluxe Pack: ex', 'Greninja Deck (Deluxe Pack: ex)'),
  ('Intermediate', 'Deluxe Pack: ex', 'Magnezone Deck (Deluxe Pack: ex)'),
  ('Intermediate', 'Deluxe Pack: ex', 'Giratina Deck (Deluxe Pack: ex)'),
  ('Intermediate', 'Deluxe Pack: ex', 'Lucario Deck (Deluxe Pack: ex)'),
  ('Intermediate', 'Deluxe Pack: ex', 'Umbreon Deck (Deluxe Pack: ex)'),
  ('Intermediate', 'Deluxe Pack: ex', 'Excadrill Deck (Deluxe Pack: ex)'),
  ('Intermediate', 'Deluxe Pack: ex', 'Silvally Deck (Deluxe Pack: ex)'),
  ('Advanced', 'Deluxe Pack: ex', 'Buzzwole ex & Shuckle ex Deck (Deluxe Pack: ex)'),
  ('Advanced', 'Deluxe Pack: ex', 'Charizard ex & Moltres ex Deck (Deluxe Pack: ex)'),
  ('Advanced', 'Deluxe Pack: ex', 'Palkia ex & Articuno ex Deck (Deluxe Pack: ex)'),
  ('Advanced', 'Deluxe Pack: ex', 'Pikachu ex & Alolan Raichu Deck (Deluxe Pack: ex)'),
  ('Advanced', 'Deluxe Pack: ex', 'Mewtwo ex & Mew ex Deck (Deluxe Pack: ex)'),
  ('Advanced', 'Deluxe Pack: ex', 'Lucario ex & Garchomp ex Deck (Deluxe Pack: ex)'),
  ('Advanced', 'Deluxe Pack: ex', 'Guzzlord ex & Crobat ex Deck (Deluxe Pack: ex)'),
  ('Advanced', 'Deluxe Pack: ex', 'Solgaleo ex & Skarmory ex Deck (Deluxe Pack: ex)'),
  ('Advanced', 'Deluxe Pack: ex', 'Lugia ex & Ho-Oh ex Deck (Deluxe Pack: ex)'),
  ('Expert', 'Deluxe Pack: ex', 'Buzzwole ex & Decidueye ex Deck (Deluxe Pack: ex)'),
  ('Expert', 'Deluxe Pack: ex', 'Charizard ex & Moltres ex Deck (Deluxe Pack: ex)'),
  ('Expert', 'Deluxe Pack: ex', 'Palkia ex & Articuno ex Deck (Deluxe Pack: ex)'),
  ('Expert', 'Deluxe Pack: ex', 'Pikachu ex & Alolan Raichu ex Deck (Deluxe Pack: ex)'),
  ('Expert', 'Deluxe Pack: ex', 'Mewtwo ex & Mew ex Deck (Deluxe Pack: ex)'),
  ('Expert', 'Deluxe Pack: ex', 'Lucario ex & Donphan ex Deck (Deluxe Pack: ex)'),
  ('Expert', 'Deluxe Pack: ex', 'Guzzlord ex & Darkrai ex Deck (Deluxe Pack: ex)'),
  ('Expert', 'Deluxe Pack: ex', 'Solgaleo ex & Dialga ex Deck (Deluxe Pack: ex)'),
  ('Expert', 'Deluxe Pack: ex', 'Lugia ex & Ho-Oh ex Deck (Deluxe Pack: ex)');
