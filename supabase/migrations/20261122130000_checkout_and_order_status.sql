ALTER TABLE public.orders
	ADD COLUMN IF NOT EXISTS collection_date date,
	ADD COLUMN IF NOT EXISTS substation text,
	ADD COLUMN IF NOT EXISTS delivery_ready_at timestamptz,
	ADD COLUMN IF NOT EXISTS payment_method text,
	ADD COLUMN IF NOT EXISTS payment_reference text;

CREATE TABLE IF NOT EXISTS public.collection_capacity (
	collection_date date PRIMARY KEY,
	capacity integer NOT NULL DEFAULT 10
);

ALTER TABLE public.collection_capacity ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.collection_capacity TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.collection_capacity TO authenticated;

DROP POLICY IF EXISTS "Collection capacity is readable by everyone" ON public.collection_capacity;
CREATE POLICY "Collection capacity is readable by everyone"
	ON public.collection_capacity
	FOR SELECT
	TO anon, authenticated
	USING (true);

DROP POLICY IF EXISTS "Dashboard staff update collection capacity" ON public.collection_capacity;
CREATE POLICY "Dashboard staff update collection capacity"
	ON public.collection_capacity
	FOR ALL
	TO authenticated
	USING (
		EXISTS (
			SELECT 1
			FROM public.profiles
			WHERE id = auth.uid()
				AND role IN ('admin', 'cashier')
		)
	)
	WITH CHECK (
		EXISTS (
			SELECT 1
			FROM public.profiles
			WHERE id = auth.uid()
				AND role IN ('admin', 'cashier')
		)
	);

CREATE OR REPLACE FUNCTION public.is_dashboard_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
	SELECT EXISTS (
		SELECT 1
		FROM public.profiles
		WHERE id = auth.uid()
			AND role IN ('admin', 'cashier')
	);
$$;

REVOKE ALL ON FUNCTION public.is_dashboard_staff() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_dashboard_staff() TO authenticated;

DROP POLICY IF EXISTS "Dashboard staff update orders" ON public.orders;
CREATE POLICY "Dashboard staff update orders"
	ON public.orders
	FOR UPDATE
	TO authenticated
	USING (public.is_dashboard_staff())
	WITH CHECK (public.is_dashboard_staff());
