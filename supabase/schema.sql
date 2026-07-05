create table if not exists public.members (
  id text primary key, owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null, business text not null, phone text not null, unit text not null,
  monthly_rent numeric(12,2) not null check (monthly_rent > 0), due_day integer not null check (due_day between 1 and 31),
  status text not null check (status in ('Paid','Pending','Overdue')), joined_on text not null, balance numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.plans (
  id text primary key, owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null, amount numeric(12,2) not null check (amount > 0), billing_cycle text not null check (billing_cycle in ('Monthly','Quarterly')),
  member_count integer not null default 0, active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.payments (
  id text primary key, owner_id uuid not null references auth.users(id) on delete cascade,
  member_id text not null references public.members(id) on delete cascade, amount numeric(12,2) not null check (amount > 0),
  paid_at text not null, method text not null check (method in ('Cash','UPI','Bank')), created_at timestamptz not null default now()
);
create table if not exists public.expenses (
  id text primary key, owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null, category text not null, amount numeric(12,2) not null check (amount > 0), spent_at text not null,
  created_at timestamptz not null default now()
);

alter table public.members enable row level security;
alter table public.plans enable row level security;
alter table public.payments enable row level security;
alter table public.expenses enable row level security;

create policy "owners manage members" on public.members for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage plans" on public.plans for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage payments" on public.payments for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage expenses" on public.expenses for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create index if not exists members_owner_idx on public.members(owner_id);
create index if not exists payments_owner_paid_idx on public.payments(owner_id, created_at desc);
create index if not exists expenses_owner_spent_idx on public.expenses(owner_id, created_at desc);
