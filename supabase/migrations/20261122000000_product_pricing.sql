CREATE OR REPLACE FUNCTION public.is_dashboard_admin()
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
			AND role = 'admin'
	);
$$;

REVOKE ALL ON FUNCTION public.is_dashboard_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_dashboard_admin() TO authenticated;

CREATE TABLE IF NOT EXISTS public.product_pricing (
	product_key text PRIMARY KEY,
	settings jsonb NOT NULL,
	updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_pricing ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.product_pricing TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_pricing TO authenticated;

CREATE POLICY "Product pricing is readable by everyone"
	ON public.product_pricing
	FOR SELECT
	TO anon, authenticated
	USING (true);

CREATE POLICY "Dashboard admins manage product pricing"
	ON public.product_pricing
	FOR ALL
	TO authenticated
	USING (public.is_dashboard_admin())
	WITH CHECK (public.is_dashboard_admin());

INSERT INTO public.product_pricing (product_key, settings)
VALUES
	(
		'Card',
		'{
			"type": "options",
			"thickness": {
				"200gsm": {"A4": 100, "A3": 200, "BussinessCard": 10, "A5": 50, "A6": 25, "custom": null},
				"250gsm": {"A4": 100, "A3": 200, "BussinessCard": 10, "A5": 50, "A6": 25, "custom": null},
				"300gsm": {"A4": 100, "A3": 200, "BussinessCard": 10, "A5": 50, "A6": 25, "custom": null},
				"Custom": {}
			},
			"finishing": {
				"gloss": {"A4": 50, "A3": 100, "BussinessCard": 10, "A5": 30, "A6": 25, "custom": null},
				"star-gloss": {"A4": 100, "A3": 200, "BussinessCard": 50, "A5": 50, "A6": 40, "custom": null},
				"stone": {"A4": 100, "A3": 200, "BussinessCard": 50, "A5": 50, "A6": 40, "custom": null}
			}
		}'::jsonb
	),
	(
		'Fliers and posters',
		'{
			"type": "options",
			"thickness": {
				"ArtPaper": {"A4": 80, "A3": 160, "A5": 40, "A6": 20, "custom": null},
				"200gsm": {"A4": 100, "A3": 200, "BussinessCard": 10, "A5": 50, "A6": 25, "custom": null},
				"250gsm": {"A4": 100, "A3": 200, "BussinessCard": 10, "A5": 50, "A6": 25, "custom": null},
				"300gsm": {"A4": 100, "A3": 200, "BussinessCard": 10, "A5": 50, "A6": 25, "custom": null},
				"Custom": {}
			}
		}'::jsonb
	),
	(
		'Banners',
		'{"type": "measurement", "pricePerSqFt": 500, "finishing": ["Eyelet", "Hemmed", "None"], "finishingPrices": {"Eyelet": 0, "Hemmed": 0, "None": 0}}'::jsonb
	),
	(
		'Stickers & Labels',
		'{"type": "measurement", "pricePerSqFt": 500}'::jsonb
	),
	(
		'Brochures',
		'{"type": "brochure", "basePrice": 500, "size": ["A4", "A5", "A6"], "pages": [4, 8, 12, 16], "finishing": ["Matt", "Gloss", "None"], "finishingPrices": {"Matt": 0, "Gloss": 0, "None": 0}}'::jsonb
	),
	(
		'Shirt Printing',
		'{"type": "shirt", "basePrice": 2000, "shirtType": ["Round Neck", "Polo", "Hoodie"]}'::jsonb
	),
	(
		'Award',
		'{"type": "award", "basePrice": 5000, "awardType": ["Plaque", "Medal", "Trophy"]}'::jsonb
	)
ON CONFLICT (product_key) DO NOTHING;
