-- BattleLedger Neon RLS policies
-- Run this after 001_schema.sql in the Neon SQL Editor.

alter table public.cards enable row level security;
alter table public.solo_battles enable row level security;
alter table public.decks enable row level security;
alter table public.deck_cards enable row level security;
alter table public.deck_games enable row level security;

grant usage on schema public to anonymous, authenticated;

grant select on public.cards to anonymous, authenticated;
grant select on public.solo_battles to anonymous, authenticated;

grant select, insert, update, delete on public.decks to authenticated;
grant select, insert, update, delete on public.deck_cards to authenticated;
grant select, insert, update, delete on public.deck_games to authenticated;

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

drop policy if exists "users can read own decks" on public.decks;
create policy "users can read own decks"
  on public.decks
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "users can create own decks" on public.decks;
create policy "users can create own decks"
  on public.decks
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "users can update own decks" on public.decks;
create policy "users can update own decks"
  on public.decks
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "users can delete own decks" on public.decks;
create policy "users can delete own decks"
  on public.decks
  for delete
  to authenticated
  using (user_id = auth.uid());

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
        and decks.user_id = auth.uid()
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
        and decks.user_id = auth.uid()
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
        and decks.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.decks
      where decks.id = deck_cards.deck_id
        and decks.user_id = auth.uid()
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
        and decks.user_id = auth.uid()
    )
  );

drop policy if exists "users can read own deck games" on public.deck_games;
create policy "users can read own deck games"
  on public.deck_games
  for select
  to authenticated
  using (
    user_id = auth.uid()
    and exists (
      select 1
      from public.decks
      where decks.id = deck_games.deck_id
        and decks.user_id = auth.uid()
    )
  );

drop policy if exists "users can create own deck games" on public.deck_games;
create policy "users can create own deck games"
  on public.deck_games
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.decks
      where decks.id = deck_games.deck_id
        and decks.user_id = auth.uid()
    )
  );

drop policy if exists "users can update own deck games" on public.deck_games;
create policy "users can update own deck games"
  on public.deck_games
  for update
  to authenticated
  using (
    user_id = auth.uid()
    and exists (
      select 1
      from public.decks
      where decks.id = deck_games.deck_id
        and decks.user_id = auth.uid()
    )
  )
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.decks
      where decks.id = deck_games.deck_id
        and decks.user_id = auth.uid()
    )
  );

drop policy if exists "users can delete own deck games" on public.deck_games;
create policy "users can delete own deck games"
  on public.deck_games
  for delete
  to authenticated
  using (
    user_id = auth.uid()
    and exists (
      select 1
      from public.decks
      where decks.id = deck_games.deck_id
        and decks.user_id = auth.uid()
    )
  );
