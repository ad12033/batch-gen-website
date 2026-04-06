"use client";

function Section({ title, children }) {
  return (
    <section className="border-t border-zinc-900 py-8 first:border-t-0 first:pt-0">
      <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-300">{children}</div>
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 antialiased">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.08), transparent 25%), radial-gradient(circle at 80% 0%, rgba(255,196,87,0.08), transparent 24%)",
        }}
      />

      <header className="border-b border-zinc-900 bg-black/88 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a href="/" className="font-mono text-xs uppercase tracking-[0.18em] text-white">
            Batch Gen
          </a>
          <a href="/" className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500 transition-colors hover:text-zinc-100">
            Back to site
          </a>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-6 py-16">
        <div className="max-w-3xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Privacy Policy</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Batch Gen Privacy Policy
          </h1>
          <p className="mt-4 text-sm leading-7 text-zinc-400">
            Effective date: April 6, 2026
          </p>
          <p className="mt-6 text-base leading-8 text-zinc-300">
            Batch Gen provides a Chrome extension that helps users automate image generation workflows inside Google Flow.
            We aim to use only the limited information needed for sign-in, subscriptions, quota handling, and the core workflow features of the extension.
          </p>
        </div>

        <div className="mt-12 rounded-none border border-zinc-900 bg-zinc-950/88 p-6 sm:p-8">
          <Section title="1. Information We Collect">
            <p>Batch Gen is designed to use only the limited information needed to provide its core functionality. Depending on how you use the extension, we may collect or process the following categories of information:</p>
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-white">Account and authentication information</h3>
                <BulletList
                  items={[
                    "Email address and basic account identifiers when you sign in",
                    "Authentication and session information needed to keep you signed in securely",
                    "Subscription and entitlement status",
                  ]}
                />
              </div>
              <div>
                <h3 className="font-semibold text-white">Billing information</h3>
                <BulletList
                  items={[
                    "Subscription and billing status",
                    "Stripe customer and subscription identifiers",
                  ]}
                />
                <p className="mt-3 text-zinc-400">
                  We do not receive or store full payment card numbers in the extension. Payments are handled on Stripe-hosted pages.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">Extension and usage information</h3>
                <BulletList
                  items={[
                    "Guest/free usage and quota information",
                    "Local settings and preferences",
                    "Run status, diagnostics, and troubleshooting information",
                    "Basic technical metadata needed to operate the service and prevent abuse",
                  ]}
                />
              </div>
              <div>
                <h3 className="font-semibold text-white">Workflow content</h3>
                <BulletList
                  items={[
                    "Prompt text you enter into Batch Gen",
                    "Generated image metadata and related workflow state",
                    "Content from the Google Flow page that is needed to automate your requested actions",
                  ]}
                />
              </div>
            </div>
          </Section>

          <Section title="2. How We Use Information">
            <p>We use information only to provide and improve the extension’s core functionality, including:</p>
            <BulletList
              items={[
                "Signing users in",
                "Managing guest and subscribed access",
                "Enforcing free-tier and subscription rules",
                "Creating and managing Stripe checkout and billing flows",
                "Automating prompt batching and generation workflows in Google Flow",
                "Organizing generated outputs and downloads",
                "Troubleshooting failures and maintaining service reliability",
                "Preventing abuse and protecting the service",
              ]}
            />
          </Section>

          <Section title="3. How Payments Work">
            <p>
              Batch Gen uses Stripe for billing and subscription management. When you choose to subscribe or manage billing,
              you are redirected to Stripe or Stripe-backed billing flows. Stripe may collect and process payment information
              in accordance with Stripe’s own privacy policy and terms.
            </p>
          </Section>

          <Section title="4. Data Sharing">
            <p>We do not sell user data.</p>
            <p>We do not use or transfer user data for purposes unrelated to Batch Gen’s single purpose.</p>
            <p>We may share information only with service providers that are necessary to operate the extension, such as:</p>
            <BulletList
              items={[
                "Supabase for backend infrastructure, authentication, and storage",
                "Stripe for subscription billing and payment processing",
              ]}
            />
            <p>
              We may also disclose information if required by law, to enforce our terms, or to protect the security, rights,
              and operation of the service.
            </p>
          </Section>

          <Section title="5. Local Storage and Extension Data">
            <p>
              Batch Gen stores some information locally in the browser extension so the product can function correctly. This may include
              session state, preferences, current run state, gallery state, and troubleshooting data.
            </p>
            <p>
              Clearing extension data may remove local state, but it does not automatically reset server-side quota, subscription status,
              or billing records.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <p>
              We retain information for as long as reasonably necessary to provide the service, maintain account and billing records,
              enforce quotas, investigate abuse, resolve support issues, and comply with legal obligations.
            </p>
          </Section>

          <Section title="7. Security">
            <p>
              We use reasonable administrative, technical, and organizational safeguards designed to protect information. However,
              no method of transmission or storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="8. Your Choices">
            <BulletList
              items={[
                "Choose whether to sign in",
                "Uninstall the extension at any time",
                "Stop using the service at any time",
                "Contact us to request account-related assistance",
              ]}
            />
            <p>If you have a subscribed account, billing management may also be available through Stripe’s customer portal.</p>
          </Section>

          <Section title="9. Children’s Privacy">
            <p>
              Batch Gen is not intended for children under 13, and we do not knowingly collect personal information from children under 13.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. If we make material changes, we may update the effective date above
              and post the revised policy.
            </p>
          </Section>

          <Section title="11. Contact">
            <p>
              If you have questions about this Privacy Policy, contact:
            </p>
            <p className="font-mono text-zinc-200">batchgen1@outlook.com</p>
          </Section>
        </div>
      </main>
    </div>
  );
}
