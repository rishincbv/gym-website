import { MaterialIcon } from '@/components/ui/MaterialIcon'

export function EliteFooter() {
  return (
    <footer className="w-full border-t border-white/5 bg-surface-container-lowest py-section-gap">
      <div className="mx-auto grid max-w-container-max grid-cols-1 gap-stack-lg px-margin-mobile md:grid-cols-4 md:px-margin-desktop">
        <div>
          <div className="mb-stack-md text-headline-md font-bold text-on-surface">
            ELITE PERFORMANCE
          </div>
          <p className="mb-stack-md text-sm text-on-surface-variant">
            Engineering the future of physical performance through data, science, and
            community.
          </p>
          <div className="flex gap-4">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full border border-outline-variant transition-all hover:border-primary hover:text-primary"
            >
              <MaterialIcon name="share" />
            </button>
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full border border-outline-variant transition-all hover:border-primary hover:text-primary"
            >
              <MaterialIcon name="hub" />
            </button>
          </div>
        </div>

        <div>
          <h4 className="mb-stack-md text-xs font-bold tracking-widest text-on-surface uppercase">
            Explore
          </h4>
          <ul className="space-y-3">
            {['Programs', 'Membership', 'Trainers', 'Nutrition'].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="text-body-md text-on-surface-variant transition-colors hover:text-primary"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-stack-md text-xs font-bold tracking-widest text-on-surface uppercase">
            Company
          </h4>
          <ul className="space-y-3">
            {['Careers', 'Support', 'Locations', 'Terms of Service'].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-body-md text-on-surface-variant transition-colors hover:text-primary"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-stack-md text-xs font-bold tracking-widest text-on-surface uppercase">
            Stay Elite
          </h4>
          <p className="mb-4 text-sm text-on-surface-variant">
            Join our briefing list for training insights.
          </p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full rounded-lg border border-outline-variant bg-surface-container px-4 py-2 text-sm transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary p-2 text-on-primary"
            >
              <MaterialIcon name="send" />
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-container-max border-t border-white/5 px-margin-mobile pt-8 text-center md:px-margin-desktop">
        <p className="text-sm text-on-surface-variant">
          © 2024 ELITE PERFORMANCE. Engineered for Excellence. Privacy Policy | Terms
          of Service
        </p>
      </div>
    </footer>
  )
}
