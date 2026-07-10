-- Ensure all richer match logging columns exist.
--
-- Run this if the app reports a missing column such as `match_type`,
-- `opponent_archetype`, `player_order`, `turns_played`, `close_game`,
-- `setup_status`, `mvp_card`, or `notes`.

alter table public.deck_games
  add column if not exists match_type text not null default 'pvp';

alter table public.deck_games
  add column if not exists opponent_archetype text;

alter table public.deck_games
  add column if not exists player_order text;

alter table public.deck_games
  add column if not exists turns_played integer;

alter table public.deck_games
  add column if not exists close_game boolean not null default false;

alter table public.deck_games
  add column if not exists setup_status text;

alter table public.deck_games
  add column if not exists mvp_card text;

alter table public.deck_games
  add column if not exists notes text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'deck_games_match_type_check'
  ) then
    alter table public.deck_games
      add constraint deck_games_match_type_check
      check (match_type in ('solo', 'pvp'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'deck_games_player_order_check'
  ) then
    alter table public.deck_games
      add constraint deck_games_player_order_check
      check (player_order in ('first', 'second') or player_order is null);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'deck_games_turns_played_check'
  ) then
    alter table public.deck_games
      add constraint deck_games_turns_played_check
      check (turns_played is null or turns_played > 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'deck_games_setup_status_check'
  ) then
    alter table public.deck_games
      add constraint deck_games_setup_status_check
      check (setup_status in ('turn_2', 'turn_3', 'missed', 'unknown') or setup_status is null);
  end if;
end $$;

create index if not exists deck_games_deck_id_created_at_idx
  on public.deck_games(deck_id, created_at desc);

create index if not exists deck_games_opponent_archetype_idx
  on public.deck_games(opponent_archetype);

create index if not exists deck_games_match_type_idx
  on public.deck_games(match_type);
