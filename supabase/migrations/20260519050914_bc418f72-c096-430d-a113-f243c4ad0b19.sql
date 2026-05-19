
CREATE TABLE public.players (
  name TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_active TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Public learning game: anyone can read/write player progress by name
CREATE POLICY "anyone can read players" ON public.players FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anyone can insert players" ON public.players FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone can update players" ON public.players FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
ALTER TABLE public.players REPLICA IDENTITY FULL;
