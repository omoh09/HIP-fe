import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Hip Homorrd collects, uses, shares, secures and retains personal data.',
  alternates: { canonical: '/privacy' },
};

const sections = [
  ['scope', '1. Scope and who we are'],
  ['roles', '2. Our data-protection roles'],
  ['data', '3. Personal data we collect'],
  ['use', '4. How and why we use personal data'],
  ['payments', '5. Payments and financial information'],
  ['sharing', '6. When we share personal data'],
  ['transfers', '7. International data transfers'],
  ['retention', '8. Data retention'],
  ['rights', '9. Your privacy rights'],
  ['security', '10. Security'],
  ['cookies', '11. Cookies and similar technologies'],
  ['children', '12. Children'],
  ['changes', '13. Changes to this Policy'],
  ['contact', '14. Contact and complaints'],
];

export default function PrivacyPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50"><div className="page-container py-14 lg:py-20"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">Legal</p><h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Privacy Policy</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">This Policy explains how Hip Homorrd handles personal data when people visit our website, create an account, build or receive invoices, use payment features, contact support or otherwise use our services.</p><p className="mt-5 text-sm font-medium text-slate-500">Last updated: 19 August 2026</p></div></section>

      <section className="page-container py-12 lg:py-16"><div className="grid gap-12 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">On this page</p><nav className="mt-4 space-y-2">{sections.map(([id,title]) => <a key={id} href={`#${id}`} className="block text-sm leading-6 text-slate-500 hover:text-emerald-700">{title}</a>)}</nav></aside>

        <article className="max-w-3xl space-y-12 text-[15px] leading-7 text-slate-600">
          <LegalSection id="scope" title="1. Scope and who we are">
            <p>Hip Homorrd provides invoicing, client communication, payment-collection support and related business workflow tools. In this Policy, “Hip Homorrd”, “we”, “us” and “our” refer to the operator of the Hip Homorrd service.</p>
            <p>This Policy applies to our website, web application and related services. It does not replace the privacy policies of third-party services that you choose to use with Hip Homorrd, such as payment processors, email providers or WhatsApp.</p>
          </LegalSection>

          <LegalSection id="roles" title="2. Our data-protection roles">
            <p>For account information, product usage, support requests, security data and our own business operations, Hip Homorrd generally acts as the organisation deciding why and how that personal data is processed.</p>
            <p>When a business user uploads or enters personal data about its own clients—such as a client name, email address, phone number or invoice details—the business user is responsible for having a lawful basis to use that data. To the extent Hip Homorrd processes that client data only to provide the service on the user’s instructions, Hip Homorrd acts as a service provider or processor.</p>
          </LegalSection>

          <LegalSection id="data" title="3. Personal data we collect">
            <p>Depending on how you use Hip Homorrd, we may collect:</p>
            <ul>
              <li><strong>Account data:</strong> name, business name, email address, account identifiers and authentication information. Passwords are not stored by the browser in readable form; authentication is handled through our authentication service.</li>
              <li><strong>Business profile data:</strong> business name, logo, contact details and other information you choose to place on invoices.</li>
              <li><strong>Invoice and client data:</strong> client name, email, phone number, billing address, invoice numbers, line items, amounts, taxes, dates, notes and payment status.</li>
              <li><strong>Transaction data:</strong> payment references, amounts, currency, status, timing and other information needed to reconcile a payment with an invoice.</li>
              <li><strong>Device and usage data:</strong> IP address, browser or device information, session data, security events, pages or features used and diagnostic logs where available.</li>
              <li><strong>Support and communications:</strong> messages you send to us, attachments you provide and information needed to investigate an account, invoice or payment issue.</li>
              <li><strong>Reviews and feedback:</strong> ratings, comments, the business being reviewed, whether public display was allowed, moderation status and a shortened reviewer name where a paid-invoice client chooses to leave feedback.</li>
              <li><strong>Marketing preferences:</strong> whether you have asked to receive or stop receiving optional product or marketing communications.</li>
              <li><strong>Local device data:</strong> where you use installable or offline-capable features, your browser may keep safe app-shell resources, interface preferences and an unfinished invoice draft on your device. Authoritative account, payment, settlement and subscription records remain server-side and require a network connection.</li>
            </ul>
          </LegalSection>

          <LegalSection id="use" title="4. How and why we use personal data">
            <p>We process personal data only where we have a lawful reason to do so. Depending on the context, this may include performance of a contract, compliance with legal obligations, consent or our legitimate interests in operating, securing and improving the service.</p>
            <ul>
              <li>Provide and maintain your account and workspace.</li>
              <li>Create, store, display, download and share invoices at your request.</li>
              <li>Initiate and reconcile payment activity and show invoice balances.</li>
              <li>Authenticate users, including through password, Google sign-in or a one-time email code where enabled.</li>
              <li>Prevent fraud, abuse, unauthorised access and other security threats.</li>
              <li>Provide customer support and investigate product or payment issues.</li>
              <li>Operate, test, troubleshoot and improve product performance and reliability.</li>
              <li>Provide installable/PWA functionality and preserve an unfinished invoice draft locally when you choose to work with intermittent connectivity.</li>
              <li>Comply with tax, accounting, regulatory, court-order and other legal requirements that apply to us.</li>
              <li>Send service messages. We use consent or another lawful basis where required for optional marketing.</li>
              <li>Verify that a client review is connected to a paid invoice, deliver private feedback to the relevant business and, only where public display was allowed and the review is approved, display limited review content as social proof.</li>
            </ul>
          </LegalSection>

          <LegalSection id="payments" title="5. Payments and financial information">
            <p>Hip Homorrd may connect an invoice to third-party payment and settlement providers such as Paystack, Stripe, MoonPay Commerce or MTN MoMo. Depending on the provider arrangement, Hip Homorrd may operate a platform-managed payment integration and instruct the provider to settle or disburse proceeds to a merchant payout destination configured in Hip Homorrd.</p>
            <p>For crypto settlement, we may store a merchant&apos;s public payout wallet address, network, settlement-asset preference and provider identifiers. For mobile-money settlement, we may store the payout mobile number, country, provider identifiers and settlement status. A public wallet address and mobile number may still be personal data when linked to an identifiable person or business. Hip Homorrd never asks for or stores crypto seed phrases or private keys.</p>
            <p>Where payment entry is hosted or operated by the payment provider, Hip Homorrd does not intend to receive or store your client’s complete card number, card security code, crypto private keys or online-banking credentials. We may receive transaction references, status, amount, currency, payer phone where needed for mobile-money approval, wallet/public-chain transaction references and other information necessary to match the payment to the invoice, arrange permitted settlement, prevent fraud and provide support.</p>
          </LegalSection>

          <LegalSection id="sharing" title="6. When we share personal data">
            <p>We do not sell personal data. We may share personal data only as reasonably necessary with:</p>
            <ul>
              <li><strong>Service providers</strong> that host infrastructure, send email, support authentication, monitor reliability or otherwise help us operate Hip Homorrd.</li>
              <li><strong>Payment providers</strong> when you or your client uses a payment feature.</li>
              <li><strong>Communication services</strong> when you choose to open or share invoice information through a service such as WhatsApp. The information you send through that service is also governed by the third party’s terms and privacy practices.</li>
              <li><strong>Professional advisers</strong> such as lawyers, auditors, insurers or accountants where reasonably necessary.</li>
              <li><strong>Authorities or other parties</strong> where disclosure is required by law, court order or a valid regulatory request, or where reasonably necessary to protect rights, security or prevent fraud.</li>
              <li><strong>Business transaction parties</strong> in connection with a merger, financing, acquisition, restructuring or sale of all or part of the business, subject to appropriate safeguards.</li>
              <li><strong>Public visitors</strong> when a paid-invoice client has expressly allowed a review to be displayed publicly and the business has approved publication. Public review cards do not include the client email, invoice number, invoice amount or payment reference.</li>
            </ul>
          </LegalSection>

          <LegalSection id="transfers" title="7. International data transfers">
            <p>Some service providers may process data outside the country where you live. Where applicable data-protection law restricts international transfers, we take reasonable steps to use recognised transfer mechanisms, contractual safeguards or another lawful basis for the transfer.</p>
          </LegalSection>

          <LegalSection id="retention" title="8. Data retention">
            <p>We keep personal data only for as long as reasonably necessary for the purposes described in this Policy, including providing the service, maintaining business and transaction records, resolving disputes, enforcing agreements, preventing fraud and meeting legal obligations.</p>
            <p>Retention periods can differ by data type. Account data is generally retained while an account is active and for a reasonable period afterwards. Invoice and payment records may need to be retained longer where tax, accounting, anti-fraud or dispute-resolution obligations apply. Backups may persist for a limited period before they are overwritten or securely deleted.</p>
          </LegalSection>

          <LegalSection id="rights" title="9. Your privacy rights">
            <p>Subject to applicable law and any lawful exceptions, you may have rights to request access to personal data, correct inaccurate data, request deletion, restrict or object to certain processing, obtain portable data, and withdraw consent where consent is the basis for processing.</p>
            <p>You may also have the right to complain to the Nigeria Data Protection Commission or another competent data-protection authority. If your request concerns data that a Hip Homorrd business user entered about you, we may direct you to that business where it is the party responsible for deciding how the data is used.</p>
          </LegalSection>

          <LegalSection id="security" title="10. Security">
            <p>We use administrative, technical and organisational measures intended to protect personal data against accidental or unlawful destruction, loss, alteration, disclosure or access. These measures may include access controls, secure cookies, transport encryption, server-side payment verification and restricted handling of authentication credentials.</p>
            <p>No online service can guarantee absolute security. You are responsible for protecting access to your email account, devices, password and one-time codes and for promptly telling us if you believe your account has been compromised.</p>
          </LegalSection>

          <LegalSection id="cookies" title="11. Cookies and similar technologies">
            <p>Hip Homorrd uses cookies or similar browser storage where necessary to keep users signed in, protect sessions, preserve settings and support core product functionality. If we introduce optional analytics, advertising or other non-essential technologies that require consent, we will provide the notice and choices required by applicable law.</p>
          </LegalSection>

          <LegalSection id="children" title="12. Children">
            <p>Hip Homorrd is a business service and is not directed to children. You must be at least 18 years old, or the age of legal majority where you live if higher, to create an account unless a lawful business arrangement permits otherwise.</p>
          </LegalSection>

          <LegalSection id="changes" title="13. Changes to this Policy">
            <p>We may update this Policy when our product, providers or legal obligations change. We will update the “Last updated” date and, where required, provide additional notice before a material change takes effect.</p>
          </LegalSection>

          <LegalSection id="contact" title="14. Contact and complaints">
            <p>For privacy questions or to exercise a privacy right, email <a href="mailto:support@hiphomorrd.com?subject=Privacy%20request" className="font-semibold text-emerald-700 hover:underline">support@hiphomorrd.com</a> with the subject “Privacy request”. We may need to verify your identity before completing a request.</p>
            <p>If you believe your privacy rights have not been respected, you may also contact the competent data-protection authority. Users in Nigeria may contact the Nigeria Data Protection Commission.</p>
            <p>For the contractual terms that apply to use of Hip Homorrd, see our <Link href="/terms" className="font-semibold text-emerald-700 hover:underline">Terms of Service</Link>.</p>
          </LegalSection>
        </article>
      </div></section>
    </main>
  );
}

function LegalSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="scroll-mt-24"><h2 className="text-2xl font-bold tracking-tight text-slate-950">{title}</h2><div className="mt-4 space-y-4 [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-slate-800">{children}</div></section>;
}
