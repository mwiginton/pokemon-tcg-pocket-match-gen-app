-- Fix public lookup reads through Neon Data API.
-- Neon anonymous JWTs use the PostgreSQL role "anonymous", not "anon".

grant usage on schema public to anonymous, authenticated;

grant select on public.cards to anonymous, authenticated;
grant select on public.solo_battles to anonymous, authenticated;

drop policy if exists "cards are publicly readable" on public.cards;
create policy "cards are publicly readable"
  on public.cards
  for select
  to anonymous, authenticated
  using (true);

drop policy if exists "solo battles are publicly readable" on public.solo_battles;
create policy "solo battles are publicly readable"
  on public.solo_battles
  for select
  to anonymous, authenticated
  using (true);

notify pgrst, 'reload schema';
