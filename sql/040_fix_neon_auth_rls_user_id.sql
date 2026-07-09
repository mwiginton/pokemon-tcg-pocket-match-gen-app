-- Fix user-owned RLS checks for Neon Data API JWTs.
--
-- The Data API exposes JWT claims through PostgREST request settings. This
-- helper reads the authenticated JWT subject directly instead of depending on
-- a provider-specific auth.uid() implementation.

create or replace function public.current_neon_auth_user_id()
returns uuid
language sql
stable
as $$
  with jwt as (
    select coalesce(
      nullif(current_setting('request.jwt.claim.sub', true), ''),
      nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'
    ) as subject
  )
  select case
    when subject ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      then subject::uuid
    else null
  end
  from jwt;
$$;

drop policy if exists "users can read own decks" on public.decks;
create policy "users can read own decks"
  on public.decks
  for select
  to authenticated
  using (user_id = public.current_neon_auth_user_id());

drop policy if exists "users can create own decks" on public.decks;
create policy "users can create own decks"
  on public.decks
  for insert
  to authenticated
  with check (user_id = public.current_neon_auth_user_id());

drop policy if exists "users can update own decks" on public.decks;
create policy "users can update own decks"
  on public.decks
  for update
  to authenticated
  using (user_id = public.current_neon_auth_user_id())
  with check (user_id = public.current_neon_auth_user_id());

drop policy if exists "users can delete own decks" on public.decks;
create policy "users can delete own decks"
  on public.decks
  for delete
  to authenticated
  using (user_id = public.current_neon_auth_user_id());

drop policy if exists "users can read cards in own decks" on public.deck_cards;
create policy "users can read cards in own decks"
  on public.deck_cards
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.decks
      where decks.id = deck_cards.deck_id
        and decks.user_id = public.current_neon_auth_user_id()
    )
  );

drop policy if exists "users can add cards to own decks" on public.deck_cards;
create policy "users can add cards to own decks"
  on public.deck_cards
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.decks
      where decks.id = deck_cards.deck_id
        and decks.user_id = public.current_neon_auth_user_id()
    )
  );

drop policy if exists "users can update cards in own decks" on public.deck_cards;
create policy "users can update cards in own decks"
  on public.deck_cards
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.decks
      where decks.id = deck_cards.deck_id
        and decks.user_id = public.current_neon_auth_user_id()
    )
  )
  with check (
    exists (
      select 1
      from public.decks
      where decks.id = deck_cards.deck_id
        and decks.user_id = public.current_neon_auth_user_id()
    )
  );

drop policy if exists "users can delete cards from own decks" on public.deck_cards;
create policy "users can delete cards from own decks"
  on public.deck_cards
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.decks
      where decks.id = deck_cards.deck_id
        and decks.user_id = public.current_neon_auth_user_id()
    )
  );

drop policy if exists "users can read own deck games" on public.deck_games;
create policy "users can read own deck games"
  on public.deck_games
  for select
  to authenticated
  using (
    user_id = public.current_neon_auth_user_id()
    and exists (
      select 1
      from public.decks
      where decks.id = deck_games.deck_id
        and decks.user_id = public.current_neon_auth_user_id()
    )
  );

drop policy if exists "users can create own deck games" on public.deck_games;
create policy "users can create own deck games"
  on public.deck_games
  for insert
  to authenticated
  with check (
    user_id = public.current_neon_auth_user_id()
    and exists (
      select 1
      from public.decks
      where decks.id = deck_games.deck_id
        and decks.user_id = public.current_neon_auth_user_id()
    )
  );

drop policy if exists "users can update own deck games" on public.deck_games;
create policy "users can update own deck games"
  on public.deck_games
  for update
  to authenticated
  using (
    user_id = public.current_neon_auth_user_id()
    and exists (
      select 1
      from public.decks
      where decks.id = deck_games.deck_id
        and decks.user_id = public.current_neon_auth_user_id()
    )
  )
  with check (
    user_id = public.current_neon_auth_user_id()
    and exists (
      select 1
      from public.decks
      where decks.id = deck_games.deck_id
        and decks.user_id = public.current_neon_auth_user_id()
    )
  );

drop policy if exists "users can delete own deck games" on public.deck_games;
create policy "users can delete own deck games"
  on public.deck_games
  for delete
  to authenticated
  using (
    user_id = public.current_neon_auth_user_id()
    and exists (
      select 1
      from public.decks
      where decks.id = deck_games.deck_id
        and decks.user_id = public.current_neon_auth_user_id()
    )
  );
