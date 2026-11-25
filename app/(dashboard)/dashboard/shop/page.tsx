
'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { commerce, money, Product } from '@/components/commerce/api';

// ======================================================
// Type Definitions
// ======================================================

type Shop = {
  id: number;
  enabled: boolean;
  name: string;
  tagline?: string;
  hero_title?: string;
  hero_description?: string;
  hero_image_url?: string;
  home_sections?: {
    title: string;
    description?: string;
    image_url?: string;
    category?: string;
  }[];
};

type Content = {
  id: number;
  type: 'blog' | 'policy';
  slug: string;
  title: string;
  body: string;
  published: boolean;
};

type Order = {
  id: string;
  buyer_name: string;
  buyer_email: string;
  currency: string;
  total: string;
  fulfilment_status: string;
  tracking_number?: string;
  shipping_address: Record<string, string>;
  invoice: {
    status: string;
    amount_paid: string;
    payment_link: string;
  };
  items: {
    id: number;
    name: string;
    quantity: number;
  }[];
};

type Overview = {
  shop: Shop;
  url: string;
  currency: string;
  shop_transaction_fee_percent: number;
  products: Product[];
  content: Content[];
  orders: Order[];
};

// ======================================================
// Default Form Values
// ======================================================

const blankProduct = {
  name: '',
  slug: '',
  description: '',
  category: '',
  image_url: '',
  price: '',
  stock: '0',
  published: false,
};

const blankContent = {
  type: 'blog' as const,
  slug: '',
  title: '',
  body: '',
  published: false,
};

// ======================================================
// Shop Manager
// ======================================================

export default function ShopManager() {
  // ----------------------------------------------------
  // Component State
  // ----------------------------------------------------

  const [data, setData] = useState<Overview>();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const [tab, setTab] = useState<
    'home' | 'products' | 'orders' | 'content'
  >('home');

  const [product, setProduct] = useState({
    ...blankProduct,
    id: undefined as number | undefined,
  });

  const [content, setContent] = useState<{
    type: 'blog' | 'policy';
    slug: string;
    title: string;
    body: string;
    published: boolean;
    id?: number;
  }>({
    ...blankContent,
    id: undefined,
  });

  // ----------------------------------------------------
  // Fetch Shop Data
  // ----------------------------------------------------

  const refresh = useCallback(async () => {
    try {
      const response = await commerce<{ data: Overview }>(
        'shop/manage'
      );

      setData(response.data);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Unable to load shop data.'
      );
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // ----------------------------------------------------
  // Execute API Operations
  // ----------------------------------------------------

  async function run(
    path: string,
    method: string,
    payload?: unknown
  ) {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      await commerce(path, method, payload);

      setMessage('Saved.');

      await refresh();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Unable to save.'
      );
    } finally {
      setSaving(false);
    }
  }

  // ----------------------------------------------------
  // Loading State
  // ----------------------------------------------------

  if (!data) {
    return (
      <div className="page-container py-10">
        {error || 'Loading shop manager…'}
      </div>
    );
  }

  const shop = data.shop;

  const input =
    'w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-900';

  // ====================================================
  // Page Render
  // ====================================================

  return (
    <div className="page-container py-10">

      {/* ============================================== */}
      {/* Page Header                                    */}
      {/* ============================================== */}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase text-[#f45118]">
            Optional add-on
          </p>

          <h1 className="text-3xl font-black">
            Shop manager
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Products, orders and site content live here.
            Your invoices stay in the invoice dashboard.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/shop-addon"
            className="rounded-lg border px-4 py-2 text-sm font-bold"
          >
            How pricing works
          </Link>

          {shop.enabled && (
            <Link
              href={data.url}
              target="_blank"
              className="rounded-lg bg-[#f45118] px-4 py-2 text-sm font-bold text-white"
            >
              View storefront ↗
            </Link>
          )}
        </div>
      </div>

      {/* Transaction Fee Information */}

      <p className="mt-3 text-xs text-slate-500">
        Shop transactions add {data.shop_transaction_fee_percent}%
        to your existing plan fee; the provider charges its
        own processing fees.
      </p>

      {/* Error Message */}

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 p-3 text-red-700"
        >
          {error}
        </p>
      )}

      {/* Success Message */}

      {message && (
        <p
          role="status"
          className="mt-4 text-emerald-600"
        >
          {message}
        </p>
      )}

      {/* ============================================== */}
      {/* Navigation Tabs                                */}
      {/* ============================================== */}

      <div className="my-7 flex flex-wrap gap-2">
        {(
          ['home', 'products', 'orders', 'content'] as const
        ).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-sm font-bold ${
              tab === t
                ? 'bg-[#f45118] text-white'
                : 'border'
            }`}
          >
            {
              {
                home: 'Homepage',
                products: 'Products & stock',
                orders: 'Orders',
                content: 'Blog & policies',
              }[t]
            }
          </button>
        ))}
      </div>

      {/* ============================================== */}
      {/* Homepage Management                            */}
      {/* ============================================== */}

      {tab === 'home' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();

            run('shop/manage', 'PATCH', shop);
          }}
          className="grid max-w-2xl gap-4 rounded-2xl border bg-white p-6 text-slate-900"
        >
          {/* Shop Publication Status */}

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={shop.enabled}
              onChange={(e) =>
                setData({
                  ...data,
                  shop: {
                    ...shop,
                    enabled: e.target.checked,
                  },
                })
              }
            />

            Publish this shop
          </label>

          {/* Homepage Fields */}

          {(
            [
              ['name', 'Shop name'],
              ['tagline', 'Short tagline'],
              ['hero_title', 'Homepage headline'],
              ['hero_description', 'Homepage description'],
              ['hero_image_url', 'Hero image URL'],
            ] as const
          ).map(([k, label]) => (
            <label
              key={k}
              className="text-sm font-semibold"
            >
              {label}

              <input
                required={k === 'name'}
                aria-label={label}
                value={shop[k] || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    shop: {
                      ...shop,
                      [k]: e.target.value,
                    },
                  })
                }
                className={`mt-1 ${input}`}
              />
            </label>
          ))}

          {/* Promotional Sections */}

          <div>
            <h2 className="mb-2 text-lg font-bold">
              Promotional sections
            </h2>

            <p className="mb-3 text-sm text-slate-500">
              Build up to six cards below the hero.
              Link each card to a product category.
            </p>

            {(shop.home_sections || []).map(
              (section, index) => (
                <div
                  key={index}
                  className="mb-3 grid gap-2 rounded-xl border p-3"
                >
                  {(
                    [
                      'title',
                      'description',
                      'image_url',
                      'category',
                    ] as const
                  ).map((k) => (
                    <input
                      key={k}
                      required={k === 'title'}
                      aria-label={`Section ${index + 1} ${k}`}
                      placeholder={k.replace('_', ' ')}
                      value={section[k] || ''}
                      onChange={(e) => {
                        const next = [
                          ...(shop.home_sections || []),
                        ];

                        next[index] = {
                          ...section,
                          [k]: e.target.value,
                        };

                        setData({
                          ...data,
                          shop: {
                            ...shop,
                            home_sections: next,
                          },
                        });
                      }}
                      className={input}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        shop: {
                          ...shop,
                          home_sections: (
                            shop.home_sections || []
                          ).filter((_, n) => n !== index),
                        },
                      })
                    }
                    className="text-sm text-red-600 underline"
                  >
                    Remove card
                  </button>
                </div>
              )
            )}

            {/* Add Promotional Section */}

            {(shop.home_sections || []).length < 6 && (
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    shop: {
                      ...shop,
                      home_sections: [
                        ...(shop.home_sections || []),
                        {
                          title: '',
                          description: '',
                          image_url: '',
                          category: '',
                        },
                      ],
                    },
                  })
                }
                className="rounded-lg border p-3 text-sm font-bold"
              >
                + Add section
              </button>
            )}
          </div>

          {/* Save Homepage */}

          <button
            disabled={saving}
            className="rounded-lg bg-[#f45118] p-3 font-bold text-white"
          >
            Save homepage
          </button>
        </form>
      )}

      {/* ============================================== */}
      {/* Product Management                             */}
      {/* ============================================== */}

      {tab === 'products' && (
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">

          {/* Product Form */}

          <form
            onSubmit={(e) => {
              e.preventDefault();

              run(
                product.id
                  ? `shop/products/${product.id}`
                  : 'shop/products',

                product.id ? 'PUT' : 'POST',

                {
                  ...product,
                  price: Number(product.price),
                  stock: Number(product.stock),
                }
              ).then(() =>
                setProduct({
                  ...blankProduct,
                  id: undefined,
                })
              );
            }}
            className="grid gap-3 rounded-2xl border bg-white p-6 text-slate-900"
          >
            <h2 className="text-xl font-bold">
              {product.id ? 'Edit product' : 'Add product'}
            </h2>

            {(
              [
                'name',
                'slug',
                'category',
                'image_url',
                'price',
                'stock',
              ] as const
            ).map((k) => (
              <label
                key={k}
                className="text-sm font-semibold"
              >
                {k.replace('_', ' ')}

                <input
                  required={['name', 'price', 'stock'].includes(k)}
                  type={
                    ['price', 'stock'].includes(k)
                      ? 'number'
                      : 'text'
                  }
                  min={k === 'price' ? '0.01' : undefined}
                  step={k === 'price' ? '0.01' : undefined}
                  value={product[k]}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      [k]: e.target.value,
                    })
                  }
                  className={`mt-1 ${input}`}
                />
              </label>
            ))}

            {/* Product Description */}

            <label>
              Description

              <textarea
                value={product.description}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    description: e.target.value,
                  })
                }
                className={input}
                rows={4}
              />
            </label>

            {/* Product Publication */}

            <label>
              <input
                type="checkbox"
                checked={product.published}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    published: e.target.checked,
                  })
                }
              />

              {' '}Published
            </label>

            {/* Save Product */}

            <button
              disabled={saving}
              className="rounded-lg bg-[#f45118] p-3 font-bold text-white"
            >
              Save product
            </button>

            {/* Cancel Product Editing */}

            {product.id && (
              <button
                type="button"
                onClick={() =>
                  setProduct({
                    ...blankProduct,
                    id: undefined,
                  })
                }
              >
                Cancel edit
              </button>
            )}
          </form>

          {/* Product List */}

          <div className="space-y-3">
            {data.products.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-xl border bg-white p-4 text-slate-900"
              >
                <div>
                  <b>{p.name}</b>

                  <p className="text-sm">
                    {money(p.price, data.currency)}
                    {' · '}
                    Stock {p.stock}
                    {' · '}

                    {p.currency !== data.currency
                      ? `Needs reprice for ${data.currency}`
                      : p.published
                        ? 'Live'
                        : 'Draft'}
                  </p>
                </div>

                <div className="flex gap-2">

                  {/* Edit Product */}

                  <button
                    onClick={() =>
                      setProduct({
                        ...p,

                        price:
                          p.currency === data.currency
                            ? String(p.price)
                            : '',

                        stock: String(p.stock),
                        description: p.description || '',
                        category: p.category || '',
                        image_url: p.image_url || '',
                      })
                    }
                    className="text-sm underline"
                  >
                    Edit
                  </button>

                  {/* Delete Product */}

                  <button
                    onClick={() => {
                      if (
                        window.confirm('Delete this product?')
                      ) {
                        run(
                          `shop/products/${p.id}`,
                          'DELETE'
                        );
                      }
                    }}
                    className="text-sm text-red-600 underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================== */}
      {/* Order Management                               */}
      {/* ============================================== */}

      {tab === 'orders' && (
        <div className="space-y-4">
          {data.orders.map((o) => (
            <article
              key={o.id}
              className="rounded-2xl border bg-white p-5 text-slate-900"
            >
              <div className="flex flex-wrap justify-between gap-3">

                {/* Order Details */}

                <div>
                  <b>
                    {o.buyer_name}
                    {' · '}
                    {money(o.total, o.currency)}
                  </b>

                  <p className="text-sm">
                    {o.buyer_email}
                    {' · '}
                    Payment {o.invoice?.status}
                    {' · '}
                    Fulfilment {o.fulfilment_status}
                  </p>

                  {/* Order Items */}

                  <p className="mt-2 text-xs">
                    {o.items
                      .map(
                        (i) => `${i.name} × ${i.quantity}`
                      )
                      .join(', ')}
                  </p>

                  {/* Shipping Address */}

                  <p className="text-xs">
                    Ship to: {o.shipping_address?.line1},{' '}
                    {o.shipping_address?.city},{' '}
                    {o.shipping_address?.region},{' '}
                    {o.shipping_address?.country}
                  </p>
                </div>

                {/* Order Fulfilment Controls */}

                <div className="flex flex-col gap-2">

                  {/* Tracking Number */}

                  <input
                    id={`tracking-${o.id}`}
                    defaultValue={o.tracking_number || ''}
                    placeholder="Tracking number"
                    className="rounded border p-2 text-sm"
                  />

                  {/* Fulfilment Status */}

                  <select
                    value={o.fulfilment_status}
                    onChange={(e) =>
                      run(
                        `shop/orders/${o.id}`,
                        'PATCH',
                        {
                          status: e.target.value,

                          tracking_number:
                            (
                              document.getElementById(
                                `tracking-${o.id}`
                              ) as HTMLInputElement
                            )?.value || null,
                        }
                      )
                    }
                    className="rounded border p-2 text-sm"
                  >
                    <option value="new">
                      New
                    </option>

                    <option value="processing">
                      Processing
                    </option>

                    <option value="shipped">
                      Shipped
                    </option>

                    <option value="delivered">
                      Delivered
                    </option>

                    <option value="cancelled">
                      Cancel & restock (unpaid only)
                    </option>
                  </select>

                  {/* Save Tracking Information */}

                  {o.fulfilment_status !== 'new' && (
                    <button
                      onClick={() =>
                        run(
                          `shop/orders/${o.id}`,
                          'PATCH',
                          {
                            status: o.fulfilment_status,

                            tracking_number:
                              (
                                document.getElementById(
                                  `tracking-${o.id}`
                                ) as HTMLInputElement
                              )?.value || null,
                          }
                        )
                      }
                      className="rounded border p-2 text-sm"
                    >
                      Save tracking
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}

          {/* Empty Orders State */}

          {!data.orders.length && (
            <p>No orders yet.</p>
          )}
        </div>
      )}

      {/* ============================================== */}
      {/* Blog and Policy Management                     */}
      {/* ============================================== */}

      {tab === 'content' && (
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">

          {/* Content Form */}

          <form
            onSubmit={(e) => {
              e.preventDefault();

              run(
                content.id
                  ? `shop/content/${content.id}`
                  : 'shop/content',

                content.id ? 'PUT' : 'POST',

                content
              ).then(() =>
                setContent({
                  ...blankContent,
                  id: undefined,
                })
              );
            }}
            className="grid gap-3 rounded-2xl border bg-white p-6 text-slate-900"
          >
            <h2 className="text-xl font-bold">
              {content.id ? 'Edit page' : 'New page'}
            </h2>

            {/* Content Type */}

            <select
              className={input}
              value={content.type}
              onChange={(e) =>
                setContent({
                  ...content,
                  type: e.target.value as 'blog' | 'policy',
                })
              }
            >
              <option value="blog">
                Blog post
              </option>

              <option value="policy">
                Policy page
              </option>
            </select>

            {/* Page Title */}

            <input
              required
              placeholder="Page title"
              value={content.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  title: e.target.value,
                })
              }
              className={input}
            />

            {/* Page Slug */}

            <input
              required
              pattern="[a-z0-9-]+"
              placeholder="url-slug"
              value={content.slug}
              onChange={(e) =>
                setContent({
                  ...content,
                  slug: e.target.value,
                })
              }
              className={input}
            />

            {/* Page Body */}

            <textarea
              required
              rows={12}
              placeholder="Write your post or policy in plain text. Paragraph breaks are preserved."
              value={content.body}
              onChange={(e) =>
                setContent({
                  ...content,
                  body: e.target.value,
                })
              }
              className={input}
            />

            {/* Publication Status */}

            <label>
              <input
                type="checkbox"
                checked={content.published}
                onChange={(e) =>
                  setContent({
                    ...content,
                    published: e.target.checked,
                  })
                }
              />

              {' '}Published
            </label>

            {/* Save Content */}

            <button
              disabled={saving}
              className="rounded-lg bg-[#f45118] p-3 font-bold text-white"
            >
              Save page
            </button>
          </form>

          {/* Existing Content List */}

          <div className="space-y-3">
            {data.content.map((c) => (
              <div
                key={c.id}
                className="flex justify-between rounded-xl border bg-white p-4 text-slate-900"
              >
                <div>
                  <b>{c.title}</b>

                  <p className="text-sm">
                    {c.type}
                    {' · '}
                    {c.published ? 'Live' : 'Draft'}
                  </p>
                </div>

                <div className="flex gap-3">

                  {/* Edit Content */}

                  <button
                    onClick={() => setContent(c)}
                    className="text-sm underline"
                  >
                    Edit
                  </button>

                  {/* Delete Content */}

                  <button
                    onClick={() => {
                      if (
                        window.confirm('Delete this page?')
                      ) {
                        run(
                          `shop/content/${c.id}`,
                          'DELETE'
                        );
                      }
                    }}
                    className="text-sm text-red-600 underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
