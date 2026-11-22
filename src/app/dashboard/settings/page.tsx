"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase-client";
import type { ProductConfiguration } from "@/app/(main)/products/configuration/types";

type ProductPrice = {
  product_key: string;
  settings: ProductConfiguration;
};

type DashboardUser = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type PriceField = {
  path: string[];
  value: number;
};

const collectPriceFields = (
  value: unknown,
  path: string[] = [],
): PriceField[] => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return [{ path, value }];
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    collectPriceFields(child, [...path, key]),
  );
};

const getPriceFields = (settings: ProductConfiguration) => {
  const fields: PriceField[] = [];
  if (typeof settings.basePrice === "number") {
    fields.push({ path: ["basePrice"], value: settings.basePrice });
  }
  if (typeof settings.pricePerSqFt === "number") {
    fields.push({ path: ["pricePerSqFt"], value: settings.pricePerSqFt });
  }
  if (settings.thickness) {
    fields.push(...collectPriceFields(settings.thickness, ["thickness"]));
  }
  if (settings.finishing && !Array.isArray(settings.finishing)) {
    fields.push(...collectPriceFields(settings.finishing, ["finishing"]));
  }
  if (settings.finishingPrices) {
    fields.push(
      ...collectPriceFields(settings.finishingPrices, ["finishingPrices"]),
    );
  }
  return fields;
};

const updatePrice = (
  settings: ProductConfiguration,
  path: string[],
  value: number,
): ProductConfiguration => {
  const next = structuredClone(settings) as Record<string, unknown>;
  let target = next;
  for (const segment of path.slice(0, -1)) {
    const child = target[segment];
    if (!child || typeof child !== "object" || Array.isArray(child))
      return settings;
    target = child as Record<string, unknown>;
  }
  target[path[path.length - 1]] = value;
  return next as ProductConfiguration;
};

const fieldLabel = (path: string[]) => {
  if (path[0] === "basePrice") return "Base price per design";
  if (path[0] === "pricePerSqFt") return "Price per square foot";
  return path.slice(1).join(" / ");
};

const SettingsPage = () => {
  const [prices, setPrices] = useState<Record<string, ProductConfiguration>>(
    {},
  );
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState("");
  const [savingProduct, setSavingProduct] = useState("");
  const [status, setStatus] = useState<{
    message: string;
    error: boolean;
  } | null>(null);
  const [resettingUser, setResettingUser] = useState("");
  const [resetStatus, setResetStatus] = useState<{
    message: string;
    error: boolean;
  } | null>(null);

  useEffect(() => {
    let active = true;
    const loadSettings = async () => {
      try {
        const [priceResult, userResult] = await Promise.all([
          supabase
            .from("product_pricing")
            .select("product_key, settings")
            .order("product_key"),
          supabase
            .from("profiles")
            .select("id, full_name, email")
            .order("full_name"),
        ]);

        if (!active) return;
        const errors: string[] = [];
        if (priceResult.error) {
          errors.push(
            `Could not load product prices: ${priceResult.error.message}`,
          );
        } else {
          setPrices(
            Object.fromEntries(
              (priceResult.data as ProductPrice[]).map((row) => [
                row.product_key,
                row.settings,
              ]),
            ),
          );
        }
        if (userResult.error) {
          errors.push(
            `Could not load dashboard users: ${userResult.error.message}`,
          );
        } else {
          setUsers(
            (userResult.data as DashboardUser[]).filter((user) => user.email),
          );
        }
        setLoadingError(errors.join(" "));
      } catch (error) {
        if (active) {
          const reason = error instanceof Error ? error.message : String(error);
          setLoadingError(`Could not load settings: ${reason}`);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadSettings();
    return () => {
      active = false;
    };
  }, []);

  const handlePriceChange = (
    productKey: string,
    path: string[],
    input: string,
  ) => {
    const amount = Number(input);
    if (!Number.isFinite(amount) || amount < 0) return;
    setPrices((current) => ({
      ...current,
      [productKey]: updatePrice(current[productKey], path, amount),
    }));
    setStatus(null);
  };

  const savePrices = async (productKey: string) => {
    setSavingProduct(productKey);
    setStatus(null);
    try {
      const { error } = await supabase.from("product_pricing").upsert(
        {
          product_key: productKey,
          settings: prices[productKey],
          updated_at: new Date().toISOString(),
        },
        { onConflict: "product_key" },
      );
      setStatus({
        message: error
          ? `Could not save ${productKey}: ${error.message}`
          : `Prices saved for ${productKey}.`,
        error: Boolean(error),
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      setStatus({
        message: `Could not save ${productKey}: ${reason}`,
        error: true,
      });
    } finally {
      setSavingProduct("");
    }
  };

  const sendPasswordReset = async (user: DashboardUser) => {
    if (!user.email) return;
    setResettingUser(user.id);
    setResetStatus(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/dashboard/reset-password`,
      });
      setResetStatus({
        message: error
          ? `Could not send a reset email to ${user.email}: ${error.message}`
          : `Password reset email sent to ${user.email}.`,
        error: Boolean(error),
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      setResetStatus({
        message: `Could not send a reset email to ${user.email}: ${reason}`,
        error: true,
      });
    } finally {
      setResettingUser("");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-bold text-green-950">Settings</h1>
        <p className="mt-2 text-gray-700">
          Update product prices and send dashboard users a secure password reset
          email.
        </p>
      </header>

      {loading && <p role="status">Loading settings…</p>}
      {loadingError && (
        <p role="alert" className="rounded bg-red-100 p-3 text-red-800">
          {loadingError}
        </p>
      )}
      {!loading && !loadingError && Object.keys(prices).length === 0 && (
        <p role="alert" className="rounded bg-amber-100 p-3 text-amber-900">
          No product prices are configured. Apply the Supabase product-pricing
          migration described in the README.
        </p>
      )}
      {status && (
        <p
          role={status.error ? "alert" : "status"}
          className={`rounded p-3 ${status.error ? "bg-red-100 text-red-800" : "bg-green-100 text-green-900"}`}
        >
          {status.message}
        </p>
      )}

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-green-950">Product prices</h2>
        {Object.entries(prices).map(([productKey, productSettings]) => (
          <article
            key={productKey}
            className="rounded-xl border border-green-800 bg-white p-4 shadow"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-green-900">
                {productKey}
              </h3>
              <button
                type="button"
                className="rounded bg-green-800 px-4 py-2 font-semibold text-white disabled:opacity-60"
                disabled={savingProduct === productKey}
                onClick={() => void savePrices(productKey)}
              >
                {savingProduct === productKey ? "Saving…" : "Save prices"}
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {getPriceFields(productSettings).map((field) => (
                <label
                  key={field.path.join(".")}
                  className="flex flex-col gap-1 text-sm font-medium text-gray-800"
                >
                  {fieldLabel(field.path)}
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={field.value}
                    onChange={(event) =>
                      handlePriceChange(
                        productKey,
                        field.path,
                        event.target.value,
                      )
                    }
                    className="rounded border border-green-700 p-2"
                  />
                </label>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-green-950">User passwords</h2>
        <p className="text-sm text-gray-700">
          Choose a user to send a password reset link to their email address.
        </p>
        {resetStatus && (
          <p
            role={resetStatus.error ? "alert" : "status"}
            className={`rounded p-3 ${resetStatus.error ? "bg-red-100 text-red-800" : "bg-green-100 text-green-900"}`}
          >
            {resetStatus.message}
          </p>
        )}
        <div className="overflow-x-auto rounded-xl border border-green-800 bg-white">
          <table className="w-full text-left">
            <thead className="bg-green-800 text-white">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3">{user.full_name || "—"}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      className="rounded bg-green-700 px-3 py-2 text-sm text-white disabled:opacity-60"
                      disabled={resettingUser === user.id}
                      onClick={() => void sendPasswordReset(user)}
                    >
                      {resettingUser === user.id
                        ? "Sending…"
                        : "Send reset email"}
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && users.length === 0 && (
                <tr>
                  <td className="p-3 text-gray-600" colSpan={3}>
                    No dashboard users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
