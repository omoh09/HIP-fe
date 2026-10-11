import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaWhatsapp, FaXTwitter, FaYoutube } from 'react-icons/fa6';

const socialDefinitions = [
  ['Instagram', process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM, FaInstagram],
  ['Facebook', process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK, FaFacebookF],
  ['X', process.env.NEXT_PUBLIC_SOCIAL_X, FaXTwitter],
  ['LinkedIn', process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN, FaLinkedinIn],
  ['TikTok', process.env.NEXT_PUBLIC_SOCIAL_TIKTOK, FaTiktok],
  ['YouTube', process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE, FaYoutube],
] as const;

export default function SocialFollow() {
  const supportNumber = (process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || '').replace(/\D/g, '');
  const links: Array<{ label: string; href: string; Icon: typeof FaInstagram }> = socialDefinitions
    .filter(([, href]) => Boolean(href))
    .map(([label, href, Icon]) => ({ label, href: String(href), Icon }));

  if (supportNumber) {
    links.unshift({ label: 'WhatsApp', href: `https://wa.me/${supportNumber}`, Icon: FaWhatsapp });
  }

  if (!links.length) return null;

  return (
    <section className="border-y border-slate-200 bg-slate-50 py-14 dark:border-white/10 dark:bg-[#0a1524]">
      <div className="page-container flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-700 dark:text-emerald-300">Stay connected</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-.035em] text-slate-950 dark:text-white sm:text-3xl">Product updates, invoicing ideas and payment-workflow lessons.</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">Follow the official Hip Homorrd channels. Social links are deployment-configured, so only verified profiles you add to the environment are shown.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {links.map(({ label, href, Icon }) => (
            <Link key={label} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/[.045] dark:text-slate-200 dark:hover:border-emerald-400/30 dark:hover:text-emerald-300">
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
