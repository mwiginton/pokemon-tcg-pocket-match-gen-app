-- Allow logged games to be recorded as ties.
-- Existing win/loss records remain valid.

alter table public.deck_games
  drop constraint if exists deck_games_result_check;

alter table public.deck_games
  add constraint deck_games_result_check
  check (result in ('win', 'loss', 'tie'));
