-- 허브 중보기도 HOTLINE - Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에서 전체를 그대로 붙여넣고 실행하세요.

create extension if not exists "pgcrypto";

-- 1. 기도제목
create table if not exists prayers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- 2. 반응 (하트/기도/좋아요) - device_id는 개인정보가 아닌, 브라우저에 저장되는 임의의 익명 토큰입니다
create table if not exists reactions (
  id uuid primary key default gen_random_uuid(),
  prayer_id uuid not null references prayers(id) on delete cascade,
  device_id text not null,
  kind text not null check (kind in ('heart','pray','like')),
  created_at timestamptz not null default now(),
  unique (prayer_id, device_id, kind)
);

-- 3. 응원 답글 (완전 익명, 작성자 정보 저장하지 않음)
create table if not exists replies (
  id uuid primary key default gen_random_uuid(),
  prayer_id uuid not null references prayers(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- 4. 공유 횟수
create table if not exists shares (
  id uuid primary key default gen_random_uuid(),
  prayer_id uuid not null references prayers(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 5. 관리자 명단 (여기 등록된 로그인 계정만 기도제목 등록/삭제 가능)
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- RLS 활성화
alter table prayers enable row level security;
alter table reactions enable row level security;
alter table replies enable row level security;
alter table shares enable row level security;
alter table admins enable row level security;

-- 누구나 조회 가능
create policy "prayers_select_all" on prayers for select using (true);
create policy "reactions_select_all" on reactions for select using (true);
create policy "replies_select_all" on replies for select using (true);
create policy "shares_select_all" on shares for select using (true);

-- 기도제목: 관리자만 등록/삭제
create policy "prayers_insert_admin" on prayers for insert
  with check (exists (select 1 from admins where user_id = auth.uid()));
create policy "prayers_delete_admin" on prayers for delete
  using (exists (select 1 from admins where user_id = auth.uid()));

-- 반응: 누구나 등록/취소 가능 (익명 사용자 포함)
create policy "reactions_insert_all" on reactions for insert with check (true);
create policy "reactions_delete_all" on reactions for delete using (true);

-- 답글: 누구나 등록 가능(익명), 관리자만 삭제(신고된 글 정리용)
create policy "replies_insert_all" on replies for insert with check (true);
create policy "replies_delete_admin" on replies for delete
  using (exists (select 1 from admins where user_id = auth.uid()));

-- 공유: 누구나 기록 가능
create policy "shares_insert_all" on shares for insert with check (true);

-- admins 테이블은 본인 로그인 여부 확인 용도로만 조회 허용
create policy "admins_select_self" on admins for select using (auth.uid() = user_id);

-- ⚠️ 아래 두 줄은 Supabase 대시보드 > Database > Replication 에서
--    prayers, reactions, replies, shares 테이블의 Realtime 토글을 켜는 것으로 대체됩니다.
--    (SQL로도 가능하지만 대시보드에서 클릭 한 번이 더 안전합니다.)
