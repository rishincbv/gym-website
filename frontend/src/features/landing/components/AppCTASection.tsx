import { MaterialIcon } from '@/components/ui/MaterialIcon'

export function AppCTASection() {
  return (
    <section className="overflow-hidden py-section-gap">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="relative flex flex-col items-center overflow-hidden rounded-[40px] bg-primary-container p-stack-lg md:flex-row md:p-24">
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 size-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-[120px]" />
            <div className="absolute bottom-0 left-0 size-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-secondary blur-[120px]" />
          </div>

          <div className="relative z-10 mb-12 text-center md:mb-0 md:w-1/2 md:text-left">
            <h2 className="font-display-hero-mobile mb-6 text-4xl leading-tight font-extrabold text-on-primary-container md:text-5xl">
              Your Coach,
              <br />
              Everywhere You Go.
            </h2>
            <p className="mb-10 max-w-md text-lg text-on-primary-container/80">
              Download the ELITE app to sync your data, track your macros, and join live
              training sessions from anywhere in the world.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:justify-start">
              <button
                type="button"
                className="flex items-center gap-3 rounded-xl bg-black px-8 py-3 text-white transition-all hover:bg-black/80"
              >
                <MaterialIcon name="phone_iphone" className="text-3xl" />
                <div className="text-left">
                  <div className="text-[10px] uppercase opacity-70">Download on the</div>
                  <div className="text-lg leading-none font-bold">App Store</div>
                </div>
              </button>
              <button
                type="button"
                className="flex items-center gap-3 rounded-xl bg-black px-8 py-3 text-white transition-all hover:bg-black/80"
              >
                <MaterialIcon name="play_books" className="text-3xl" />
                <div className="text-left">
                  <div className="text-[10px] uppercase opacity-70">Get it on</div>
                  <div className="text-lg leading-none font-bold">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          <div className="relative z-10 flex w-full justify-center md:w-1/2">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3JeIZYnotIzC9L3Dm1pgKYTloFF9b8NCovyyetAaCE4JEBr9aQxfRiODTlRsbIMhLVoZh5swBeQDzeEmik0-NACHae0VkPFQvUwP1XH6T9uG2txlkYOSbPC0f9wWP8FIjJbxU-RHf6tF2fHXs2dQb_bzfEjPmtZknQkbvPx7vH27Zcqmpq-cxjk38Gzae5jNvbWXNYZQ2Ecq8v-BtYA-n4_s29nf_yXfoXISmBjQ0RcHc5n97r9JD"
              alt="Elite Performance mobile app"
              className="animate-float w-72 drop-shadow-2xl md:w-80"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
