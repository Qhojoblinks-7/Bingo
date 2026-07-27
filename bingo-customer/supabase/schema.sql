-- BinGo Customer App - Supabase Database Schema
-- Run this in the Supabase SQL Editor or via migrations

-- ============================================
-- ENABLE EXTENSIONS
-- ============================================
create extension if not exists "uuid-ossp";

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
create table if not exists public.customers (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  phone text,
  avatar_url text,
  last_pickup_at timestamptz,
  total_pickups integer default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.customers is 'Customer profiles linked to Supabase Auth';

-- ============================================
-- WALLET TABLE
-- ============================================
create table if not exists public.wallet (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete cascade not null,
  balance decimal(10,2) default 0.00 not null,
  currency text default 'GH₵' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint unique_customer_wallet unique (customer_id)
);

comment on table public.wallet is 'Customer wallet balances';

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
create table if not exists public.transactions (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete cascade not null,
  type text not null check (type in ('topup', 'payment', 'refund')),
  amount decimal(10,2) not null,
  payment_method text not null check (payment_method in ('momo', 'card', 'wallet')),
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'cancelled')),
  reference text,
  metadata jsonb,
  created_at timestamptz default now() not null
);

comment on table public.transactions is 'Wallet top-ups and payment transactions';

-- ============================================
-- REQUESTS TABLE
-- ============================================
create table if not exists public.requests (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete cascade not null,
  address text not null,
  bin_size text not null,
  notes text,
  payment_method text not null check (payment_method in ('momo', 'card', 'wallet')),
  price decimal(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'in_transit', 'arriving', 'completed', 'cancelled')),
  rider_name text,
  rider_phone text,
  eta text,
  proof_image_url text,
  completed_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.requests is 'Waste collection pickup requests';

-- ============================================
-- PAYMENT METHODS TABLE
-- ============================================
create table if not exists public.payment_methods (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete cascade not null,
  type text not null default 'momo' check (type in ('momo', 'card')),
  name text not null,
  number text not null,
  is_default boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.payment_methods is 'Saved customer payment methods';

-- ============================================
-- CUSTOMER LOCATIONS TABLE
-- ============================================
create table if not exists public.customer_locations (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete cascade not null,
  label text not null,
  address text not null,
  gps_code text,
  is_default boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.customer_locations is 'Saved customer addresses/locations';

-- ============================================
-- SUPPORT TICKETS TABLE
-- ============================================
create table if not exists public.support_tickets (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete cascade not null,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  channel text not null default 'chat' check (channel in ('chat', 'call', 'whatsapp', 'email')),
  metadata jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.support_tickets is 'Customer support tickets';

-- ============================================
-- CUSTOMER DATA RIGHTS TABLE
-- ============================================
create table if not exists public.customer_data_rights (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete cascade not null unique,
  consent_granted boolean default true not null,
  analytics_enabled boolean default true not null,
  personalization_enabled boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.customer_data_rights is 'Customer data privacy and consent settings';

-- ============================================
-- DATA DOWNLOAD REQUESTS TABLE
-- ============================================
create table if not exists public.data_download_requests (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  download_url text,
  created_at timestamptz default now() not null,
  completed_at timestamptz
);

comment on table public.data_download_requests is 'Customer data export requests (GDPR)';

-- ============================================
-- PROOF OF SERVICE TABLE
-- ============================================
create table if not exists public.proof_of_service (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid references public.requests(id) on delete cascade not null unique,
  customer_id uuid references public.customers(id) on delete cascade not null,
  image_url text not null,
  rider_name text not null,
  rider_phone text not null,
  completed_at timestamptz not null,
  created_at timestamptz default now() not null
);

comment on table public.proof_of_service is 'Proof of service photos after pickup completion';

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_wallet_customer_id on public.wallet(customer_id);
create index if not exists idx_transactions_customer_id on public.transactions(customer_id);
create index if not exists idx_transactions_created_at on public.transactions(created_at desc);
create index if not exists idx_requests_customer_id on public.requests(customer_id);
create index if not exists idx_requests_status on public.requests(status);
create index if not exists idx_requests_created_at on public.requests(created_at desc);
create index if not exists idx_payment_methods_customer_id on public.payment_methods(customer_id);
create index if not exists idx_customer_locations_customer_id on public.customer_locations(customer_id);
create index if not exists idx_support_tickets_customer_id on public.support_tickets(customer_id);
create index if not exists idx_proof_of_service_request_id on public.proof_of_service(request_id);

-- ============================================
-- TRIGGER: UPDATE UPDATED_AT
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.customers;
create trigger set_updated_at before update on public.customers for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.wallet;
create trigger set_updated_at before update on public.wallet for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.requests;
create trigger set_updated_at before update on public.requests for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.payment_methods;
create trigger set_updated_at before update on public.payment_methods for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.customer_locations;
create trigger set_updated_at before update on public.customer_locations for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.support_tickets;
create trigger set_updated_at before update on public.support_tickets for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.customer_data_rights;
create trigger set_updated_at before update on public.customer_data_rights for each row execute function public.handle_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
alter table public.customers enable row level security;
alter table public.wallet enable row level security;
alter table public.transactions enable row level security;
alter table public.requests enable row level security;
alter table public.payment_methods enable row level security;
alter table public.customer_locations enable row level security;
alter table public.support_tickets enable row level security;
alter table public.customer_data_rights enable row level security;
alter table public.data_download_requests enable row level security;
alter table public.proof_of_service enable row level security;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Customers: users can read/update their own profile
create policy "Users can view own profile" on public.customers for select using (auth.uid() = id);
create policy "Users can update own profile" on public.customers for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.customers for insert with check (auth.uid() = id);

-- Wallet: users can read their own wallet
create policy "Users can view own wallet" on public.wallet for select using (auth.uid() = customer_id);

-- Transactions: users can read their own transactions
create policy "Users can view own transactions" on public.transactions for select using (auth.uid() = customer_id);

-- Requests: users can CRUD their own requests
create policy "Users can view own requests" on public.requests for select using (auth.uid() = customer_id);
create policy "Users can create own requests" on public.requests for insert with check (auth.uid() = customer_id);
create policy "Users can update own requests" on public.requests for update using (auth.uid() = customer_id);
create policy "Users can delete own requests" on public.requests for delete using (auth.uid() = customer_id);

-- Payment methods: users can CRUD their own payment methods
create policy "Users can view own payment methods" on public.payment_methods for select using (auth.uid() = customer_id);
create policy "Users can create own payment methods" on public.payment_methods for insert with check (auth.uid() = customer_id);
create policy "Users can update own payment methods" on public.payment_methods for update using (auth.uid() = customer_id);
create policy "Users can delete own payment methods" on public.payment_methods for delete using (auth.uid() = customer_id);

-- Customer locations: users can CRUD their own locations
create policy "Users can view own locations" on public.customer_locations for select using (auth.uid() = customer_id);
create policy "Users can create own locations" on public.customer_locations for insert with check (auth.uid() = customer_id);
create policy "Users can update own locations" on public.customer_locations for update using (auth.uid() = customer_id);
create policy "Users can delete own locations" on public.customer_locations for delete using (auth.uid() = customer_id);

-- Support tickets: users can CRUD their own tickets
create policy "Users can view own support tickets" on public.support_tickets for select using (auth.uid() = customer_id);
create policy "Users can create own support tickets" on public.support_tickets for insert with check (auth.uid() = customer_id);
create policy "Users can update own support tickets" on public.support_tickets for update using (auth.uid() = customer_id);

-- Customer data rights: users can read/update their own data rights
create policy "Users can view own data rights" on public.customer_data_rights for select using (auth.uid() = customer_id);
create policy "Users can update own data rights" on public.customer_data_rights for update using (auth.uid() = customer_id);
create policy "Users can insert own data rights" on public.customer_data_rights for insert with check (auth.uid() = customer_id);

-- Data download requests: users can CRUD their own requests
create policy "Users can view own download requests" on public.data_download_requests for select using (auth.uid() = customer_id);
create policy "Users can create own download requests" on public.data_download_requests for insert with check (auth.uid() = customer_id);

-- Proof of service: users can read their own proof of service
create policy "Users can view own proof of service" on public.proof_of_service for select using (auth.uid() = customer_id);

-- ============================================
-- STORAGE BUCKET FOR PROOF IMAGES
-- ============================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'proof-images',
  'proof-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Storage policies for proof-images bucket
create policy "Users can upload own proof images" on storage.objects for insert with check (
  bucket_id = 'proof-images' and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can view own proof images" on storage.objects for select using (
  bucket_id = 'proof-images' and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete own proof images" on storage.objects for delete using (
  bucket_id = 'proof-images' and auth.uid()::text = (storage.foldername(name))[1]
);
