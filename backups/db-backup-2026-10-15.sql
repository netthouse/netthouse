--
-- PostgreSQL database dump
--

\restrict HfjOdaU3XQz5NQzmNlfDSsPmJKonAEPuEnjQZc2EGRNn98mwNAahTbtyffdSSFG

-- Dumped from database version 17.11 (Debian 17.11-1.pgdg13+2)
-- Dumped by pg_dump version 17.11 (Debian 17.11-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: netthouse
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO netthouse;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: netthouse
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO netthouse;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: netthouse
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO netthouse;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: netthouse
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: accounts; Type: TABLE; Schema: public; Owner: netthouse
--

CREATE TABLE public.accounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    org_id uuid NOT NULL,
    agent_id uuid,
    currency character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    balance numeric(20,6) DEFAULT '0'::numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.accounts OWNER TO netthouse;

--
-- Name: agents; Type: TABLE; Schema: public; Owner: netthouse
--

CREATE TABLE public.agents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    org_id uuid NOT NULL,
    name character varying(200) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.agents OWNER TO netthouse;

--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: netthouse
--

CREATE TABLE public.api_keys (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    org_id uuid NOT NULL,
    name character varying(200) NOT NULL,
    key character varying(512) NOT NULL,
    scopes jsonb DEFAULT '["read"]'::jsonb NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


ALTER TABLE public.api_keys OWNER TO netthouse;

--
-- Name: ledger_entries; Type: TABLE; Schema: public; Owner: netthouse
--

CREATE TABLE public.ledger_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    transaction_id uuid NOT NULL,
    account_id uuid NOT NULL,
    direction character varying(6) NOT NULL,
    amount numeric(20,6) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ledger_entries OWNER TO netthouse;

--
-- Name: ledger_transactions; Type: TABLE; Schema: public; Owner: netthouse
--

CREATE TABLE public.ledger_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    org_id uuid NOT NULL,
    description character varying(500) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ledger_transactions OWNER TO netthouse;

--
-- Name: organizations; Type: TABLE; Schema: public; Owner: netthouse
--

CREATE TABLE public.organizations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(200) NOT NULL,
    slug character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    clerk_user_id character varying(255)
);


ALTER TABLE public.organizations OWNER TO netthouse;

--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: netthouse
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: netthouse
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	8fd66cb207cbc2a848a88dd70d9696ee0ad9da46bb75571f48bbc87aa887ead8	1791553477425
2	b855768f098ebb0bcee405b8e5ed2319e1804166400ceb4689a9316313364b9c	1791632982689
3	77644df18e0478db8ab6f234fe066a5e3043cc0d667169f5ceeec611fa547749	1791738890648
4	6fe05453a87655529b25192206e8b62c6a24b86e30f8dd40597f0c9ba11dd28b	1791976960746
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: netthouse
--

COPY public.accounts (id, org_id, agent_id, currency, balance, created_at) FROM stdin;
52676434-6e28-4250-9808-225b9a17502a	24d272ad-dcfa-4630-b544-45aa484bf3cc	\N	USD	100.500000	2026-10-10 11:05:07.401161+00
6103ec3d-c7bb-4907-8d60-68eefc510a8c	24d272ad-dcfa-4630-b544-45aa484bf3cc	\N	USD	0.000000	2026-10-10 12:03:17.83164+00
\.


--
-- Data for Name: agents; Type: TABLE DATA; Schema: public; Owner: netthouse
--

COPY public.agents (id, org_id, name, status, created_at) FROM stdin;
ceeb9051-fed6-4462-ab82-9f28c4a43621	24d272ad-dcfa-4630-b544-45aa484bf3cc	Main Agent	active	2026-10-09 14:21:23.618746+00
f799a883-dc8d-4424-b2d5-ad9d38727bf7	24d272ad-dcfa-4630-b544-45aa484bf3cc	Main Agent	active	2026-10-10 10:58:41.919569+00
\.


--
-- Data for Name: api_keys; Type: TABLE DATA; Schema: public; Owner: netthouse
--

COPY public.api_keys (id, org_id, name, key, scopes, is_active, created_at, last_used_at) FROM stdin;
91f8694d-50ca-40d3-9953-904522036df6	24d272ad-dcfa-4630-b544-45aa484bf3cc	Read Only Key	nt_5a735c4897536129ce9d3cfe86531c32a51e82b3155255fb5c217862d5ef87f0	["read"]	t	2026-10-11 17:39:01.098937+00	2026-10-11 17:42:57.073+00
de55aafc-ed63-4f48-8be1-997865d5edcb	24d272ad-dcfa-4630-b544-45aa484bf3cc	Bootstrap Admin Key	nt_bf16100fa436f3490ac3774c608df872a818fac01969dcda2743bba53c872e47	["admin", "read", "write", "transact"]	t	2026-10-11 17:24:22.134963+00	2026-10-15 10:19:19.226+00
\.


--
-- Data for Name: ledger_entries; Type: TABLE DATA; Schema: public; Owner: netthouse
--

COPY public.ledger_entries (id, transaction_id, account_id, direction, amount, created_at) FROM stdin;
e208c9c3-e5f4-400f-8e34-c41689c38a6a	355c26db-ab64-4376-b59b-8a2e5f1ed067	52676434-6e28-4250-9808-225b9a17502a	debit	25.000000	2026-10-10 12:05:41.527277+00
04120221-7a75-478c-b7ff-99b7f54f49c5	355c26db-ab64-4376-b59b-8a2e5f1ed067	6103ec3d-c7bb-4907-8d60-68eefc510a8c	credit	25.000000	2026-10-10 12:05:41.527277+00
1d5b5779-5839-4a51-a2be-da0285afb0dc	ae5d67a9-ae74-490a-8012-584a93801f9a	52676434-6e28-4250-9808-225b9a17502a	debit	0.100000	2026-10-10 12:27:41.627445+00
455facef-2ac0-4e0c-8e78-c4535d386aef	ae5d67a9-ae74-490a-8012-584a93801f9a	6103ec3d-c7bb-4907-8d60-68eefc510a8c	credit	0.100000	2026-10-10 12:27:41.627445+00
1a4671d4-57d8-4d41-86ec-ebfa5ca2380d	930c75d1-b88b-416d-9c52-15779bd19551	6103ec3d-c7bb-4907-8d60-68eefc510a8c	debit	5.000000	2026-10-10 12:48:38.354789+00
eb534af6-0186-452b-b6a3-b5900fada9e4	930c75d1-b88b-416d-9c52-15779bd19551	52676434-6e28-4250-9808-225b9a17502a	credit	5.000000	2026-10-10 12:48:38.354789+00
\.


--
-- Data for Name: ledger_transactions; Type: TABLE DATA; Schema: public; Owner: netthouse
--

COPY public.ledger_transactions (id, org_id, description, created_at) FROM stdin;
355c26db-ab64-4376-b59b-8a2e5f1ed067	24d272ad-dcfa-4630-b544-45aa484bf3cc	Agent payment for API usage	2026-10-10 12:05:41.527277+00
ae5d67a9-ae74-490a-8012-584a93801f9a	24d272ad-dcfa-4630-b544-45aa484bf3cc	Premium data access	2026-10-10 12:27:41.627445+00
930c75d1-b88b-416d-9c52-15779bd19551	24d272ad-dcfa-4630-b544-45aa484bf3cc	Refund from provider	2026-10-10 12:48:38.354789+00
\.


--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: netthouse
--

COPY public.organizations (id, name, slug, created_at, updated_at, clerk_user_id) FROM stdin;
24d272ad-dcfa-4630-b544-45aa484bf3cc	Netthouse Demo	netthouse-demo	2026-10-09 13:56:20.0563+00	2026-10-09 13:56:20.0563+00	\N
226f37a7-8cdb-416a-9d52-d748bfab0154	Local Test	local-test	2026-10-15 09:53:01.780503+00	2026-10-15 09:53:01.780503+00	user_3KdQBdwlAiVVYYcPbsqgf5MZaen
06e54955-b759-4657-bbdf-224375647ec6	Second Org	second-org	2026-10-15 10:11:40.922977+00	2026-10-15 10:11:40.922977+00	user_3KdQBdwlAiVVYYcPbsqgf5MZaen
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: netthouse
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 4, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: netthouse
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: netthouse
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: agents agents_pkey; Type: CONSTRAINT; Schema: public; Owner: netthouse
--

ALTER TABLE ONLY public.agents
    ADD CONSTRAINT agents_pkey PRIMARY KEY (id);


--
-- Name: api_keys api_keys_key_unique; Type: CONSTRAINT; Schema: public; Owner: netthouse
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_key_unique UNIQUE (key);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: netthouse
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: ledger_entries ledger_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: netthouse
--

ALTER TABLE ONLY public.ledger_entries
    ADD CONSTRAINT ledger_entries_pkey PRIMARY KEY (id);


--
-- Name: ledger_transactions ledger_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: netthouse
--

ALTER TABLE ONLY public.ledger_transactions
    ADD CONSTRAINT ledger_transactions_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: netthouse
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_slug_unique; Type: CONSTRAINT; Schema: public; Owner: netthouse
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_slug_unique UNIQUE (slug);


--
-- Name: accounts_org_idx; Type: INDEX; Schema: public; Owner: netthouse
--

CREATE INDEX accounts_org_idx ON public.accounts USING btree (org_id);


--
-- Name: agents_org_idx; Type: INDEX; Schema: public; Owner: netthouse
--

CREATE INDEX agents_org_idx ON public.agents USING btree (org_id);


--
-- Name: api_keys_org_idx; Type: INDEX; Schema: public; Owner: netthouse
--

CREATE INDEX api_keys_org_idx ON public.api_keys USING btree (org_id);


--
-- Name: ledger_entries_tx_idx; Type: INDEX; Schema: public; Owner: netthouse
--

CREATE INDEX ledger_entries_tx_idx ON public.ledger_entries USING btree (transaction_id);


--
-- Name: ledger_tx_org_idx; Type: INDEX; Schema: public; Owner: netthouse
--

CREATE INDEX ledger_tx_org_idx ON public.ledger_transactions USING btree (org_id);


--
-- Name: accounts accounts_agent_id_agents_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: netthouse
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_agent_id_agents_id_fk FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE SET NULL;


--
-- Name: accounts accounts_org_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: netthouse
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_org_id_organizations_id_fk FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: agents agents_org_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: netthouse
--

ALTER TABLE ONLY public.agents
    ADD CONSTRAINT agents_org_id_organizations_id_fk FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: api_keys api_keys_org_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: netthouse
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_org_id_organizations_id_fk FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: ledger_entries ledger_entries_account_id_accounts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: netthouse
--

ALTER TABLE ONLY public.ledger_entries
    ADD CONSTRAINT ledger_entries_account_id_accounts_id_fk FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE RESTRICT;


--
-- Name: ledger_entries ledger_entries_transaction_id_ledger_transactions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: netthouse
--

ALTER TABLE ONLY public.ledger_entries
    ADD CONSTRAINT ledger_entries_transaction_id_ledger_transactions_id_fk FOREIGN KEY (transaction_id) REFERENCES public.ledger_transactions(id) ON DELETE CASCADE;


--
-- Name: ledger_transactions ledger_transactions_org_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: netthouse
--

ALTER TABLE ONLY public.ledger_transactions
    ADD CONSTRAINT ledger_transactions_org_id_organizations_id_fk FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict HfjOdaU3XQz5NQzmNlfDSsPmJKonAEPuEnjQZc2EGRNn98mwNAahTbtyffdSSFG

