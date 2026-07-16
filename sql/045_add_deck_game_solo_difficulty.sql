-- Track the solo battle difficulty for logged solo games.

alter table public.deck_games
  add column if not exists solo_difficulty text;

create index if not exists deck_games_solo_difficulty_idx
  on public.deck_games(solo_difficulty);
