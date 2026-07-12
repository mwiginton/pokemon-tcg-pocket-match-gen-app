-- BattleLedger Neon schema
-- Run this first in the Neon SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.cards (
  id text primary key,
  name text not null,
  pack text,
  image text
);

create table if not exists public.solo_battles (
  id uuid primary key default gen_random_uuid(),
  difficulty text not null,
  expansion text not null,
  deck_name text not null
);

create table if not exists public.decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  deck_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.deck_cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.decks(id) on delete cascade,
  card_id text not null references public.cards(id),
  card_index integer not null check (card_index >= 0 and card_index < 20),
  unique (deck_id, card_index)
);

create table if not exists public.deck_games (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.decks(id) on delete cascade,
  user_id uuid not null,
  result text not null check (result in ('win', 'loss', 'tie')),
  match_type text not null default 'pvp' check (match_type in ('solo', 'pvp')),
  opponent_archetype text,
  player_order text check (player_order in ('first', 'second')),
  turns_played integer check (turns_played is null or turns_played > 0),
  close_game boolean not null default false,
  setup_status text check (setup_status in ('turn_2', 'turn_3', 'missed', 'unknown')),
  mvp_card text,
  notes text,
  created_at timestamptz not null default now()
);

comment on column public.decks.user_id is
  'Neon Auth user id from neon_auth.user(id). Not enforced as a foreign key so auth setup can be managed by Neon.';

comment on column public.deck_games.user_id is
  'Neon Auth user id from neon_auth.user(id). Not enforced as a foreign key so auth setup can be managed by Neon.';

create index if not exists decks_user_id_created_at_idx
  on public.decks(user_id, created_at desc);

create index if not exists deck_cards_deck_id_card_index_idx
  on public.deck_cards(deck_id, card_index);

create index if not exists deck_games_deck_id_idx
  on public.deck_games(deck_id);

create index if not exists deck_games_deck_id_created_at_idx
  on public.deck_games(deck_id, created_at desc);

create index if not exists deck_games_user_id_idx
  on public.deck_games(user_id);

create index if not exists deck_games_opponent_archetype_idx
  on public.deck_games(opponent_archetype);

create index if not exists deck_games_match_type_idx
  on public.deck_games(match_type);

create index if not exists cards_name_idx
  on public.cards(name);

create index if not exists solo_battles_difficulty_idx
  on public.solo_battles(difficulty);
