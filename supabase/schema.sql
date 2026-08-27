create table if not exists public.members (
  id text primary key, owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null, category text, business text not null, plan_name text, phone text not null, unit text not null,
  batch text, room_type text, group_name text, custom_fields jsonb not null default '[]'::jsonb,
  monthly_rent numeric(12,2) not null check (monthly_rent > 0), due_day integer not null check (due_day between 1 and 31),
  status text not null check (status in ('Paid','Pending','Overdue')), joined_on text not null, balance numeric(12,2) not null default 0,
  billing_month text, billing_year integer,
  created_at timestamptz not null default now()
);
create table if not exists public.plans (
  id text primary key, owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null, amount numeric(12,2) not null check (amount > 0), billing_cycle text not null check (billing_cycle in ('1 Month','3 Months','6 Months','1 Year','Monthly','Quarterly')),
  member_count integer not null default 0, active boolean not null default true, assigned_member_ids text[] not null default '{}', created_at timestamptz not null default now()
);
create table if not exists public.payments (
  id text primary key, owner_id uuid not null references auth.users(id) on delete cascade,
  member_id text not null references public.members(id) on delete cascade, amount numeric(12,2) not null check (amount > 0),
  paid_at text not null, method text not null check (method in ('Cash','UPI','Bank')), created_at timestamptz not null default now()
);
create table if not exists public.expenses (
  id text primary key, owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null, category text not null, amount numeric(12,2) not null check (amount > 0), spent_at text not null,
  recurrence text not null default 'This month' check (recurrence in ('Monthly','This month')),
  created_at timestamptz not null default now()
);
create table if not exists public.account_deletion_requests (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  reason text not null default '',
  status text not null default 'requested' check (status in ('requested','processing','completed','rejected')),
  requested_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.members add column if not exists category text;
alter table public.members add column if not exists plan_name text;
alter table public.members add column if not exists batch text;
alter table public.members add column if not exists room_type text;
alter table public.members add column if not exists group_name text;
alter table public.members add column if not exists custom_fields jsonb not null default '[]'::jsonb;
alter table public.members add column if not exists billing_month text;
alter table public.members add column if not exists billing_year integer;

alter table public.plans add column if not exists assigned_member_ids text[] not null default '{}';
alter table public.expenses add column if not exists recurrence text not null default 'This month';
alter table public.account_deletion_requests add column if not exists email text;
alter table public.account_deletion_requests add column if not exists reason text not null default '';
alter table public.account_deletion_requests add column if not exists status text not null default 'requested';
alter table public.account_deletion_requests add column if not exists requested_at timestamptz not null default now();
alter table public.account_deletion_requests add column if not exists updated_at timestamptz not null default now();

do $$
declare
  constraint_name text;
begin
  select conname into constraint_name
  from pg_constraint
  where conrelid = 'public.plans'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) like '%billing_cycle%';

  if constraint_name is not null then
    execute format('alter table public.plans drop constraint %I', constraint_name);
  end if;
end $$;

alter table public.plans
  add constraint plans_billing_cycle_check
  check (billing_cycle in ('1 Month','3 Months','6 Months','1 Year','Monthly','Quarterly'));

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.expenses'::regclass
      and conname = 'expenses_recurrence_check'
  ) then
    alter table public.expenses
      add constraint expenses_recurrence_check
      check (recurrence in ('Monthly','This month'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.account_deletion_requests'::regclass
      and conname = 'account_deletion_requests_status_check'
  ) then
    alter table public.account_deletion_requests
      add constraint account_deletion_requests_status_check
      check (status in ('requested','processing','completed','rejected'));
  end if;
end $$;

alter table public.members enable row level security;
alter table public.plans enable row level security;
alter table public.payments enable row level security;
alter table public.expenses enable row level security;
alter table public.account_deletion_requests enable row level security;

drop policy if exists "owners manage members" on public.members;
drop policy if exists "owners manage plans" on public.plans;
drop policy if exists "owners manage payments" on public.payments;
drop policy if exists "owners manage expenses" on public.expenses;
drop policy if exists "owners manage deletion requests" on public.account_deletion_requests;

create policy "owners manage members" on public.members for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage plans" on public.plans for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage payments" on public.payments for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage expenses" on public.expenses for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage deletion requests" on public.account_deletion_requests for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create index if not exists members_owner_idx on public.members(owner_id);
create index if not exists payments_owner_paid_idx on public.payments(owner_id, created_at desc);
create index if not exists expenses_owner_spent_idx on public.expenses(owner_id, created_at desc);
create index if not exists account_deletion_requests_status_idx on public.account_deletion_requests(status, requested_at desc);
