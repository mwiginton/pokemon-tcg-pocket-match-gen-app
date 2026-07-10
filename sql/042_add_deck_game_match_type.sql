-- Track whether a logged game was a solo battle or PvP match.
-- Existing records are treated as PvP so previous manual logs stay classified.

alter table public.deck_games
  add column if not exists match_type text not null default 'pvp';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'deck_games_match_type_check'
  ) then
    alter table public.deck_games
      add constraint deck_games_match_type_check
      check (match_type in ('solo', 'pvp'));
  end if;
end $$;

create index if not exists deck_games_match_type_idx
  on public.deck_games(match_type);
