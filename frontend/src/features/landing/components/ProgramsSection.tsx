import { MaterialIcon } from '@/components/ui/MaterialIcon'

const programs = [
  {
    tag: 'Strength',
    tagClass: 'bg-primary/20 text-primary',
    title: 'Hypertrophy Pro',
    description:
      'A 12-week intensive designed for maximum muscle growth and structural balance.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB_GovyZ02-9maSBA1inxxF4yb2AT4SRxKnabj7Ev4RGk5MuTYhqBSB3XNQiCBtjQ9a-H79VbnS4PTEkL6HZvuhJysTRPXFF_rkz5xkWJ3tMddxZ2DklMzggsbjokBoKj3VKiDGLtaEPEWOzXBG47vbM1tv2xBYMKncrk9Tec6GbWiKIi11E2-1jrpp8Gc2Xt5l18N6QRy2R2nmu4LXhwPyi56Xmp5Xp5HjHW-9EbR5V29boUiC06Se',
  },
  {
    tag: 'HIIT',
    tagClass: 'bg-secondary/20 text-secondary',
    title: 'Metabolic Burn',
    description:
      'High-intensity intervals designed to spike your metabolism for 48 hours post-workout.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCb40Kr-xBvusQ6HHowS43sf8D0PNDoQ5GGgj0NYijMxjilBjzBueEYgRLdgGU-KPi_zqfY_4m8o1b6kzMafWxxkdIPNHntoDdNbZ5CTV0s2Xv0JCe_Ki5yDFcanZSfP4T6ekXCtQQ-L6uLr1_F5GF6jDa5Wjx4OoE7QWbie-eCGA5Es52p4w-zeiBqQ4ACH4u_IvRSrUQQaYXrXKscEY8mnd1RZHVNtOKdkK-DqxtZLmeLMaSOQXs6',
  },
  {
    tag: 'Mobility',
    tagClass: 'bg-tertiary/20 text-tertiary',
    title: 'Flow Performance',
    description:
      'Improve range of motion and mental focus with athletic-focused yoga sequences.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAdjit6fJhToreX__FH29qhHasG858bW1Z2nKufc0fZ_cVpyw9jYcX0erB-mflCsTcRbgqZJw8ql0f63lCDT8KbA1V9ARbGYhwnudI7ccPJcDRhrqfFK5ZhdAEz2EbTU78vM_EpAhUKKbVQFJo8pBniGdnoWeiedyn3chwl_LW3EDKdg6W3KS1VmIzSPAaCVfoL5Jbu1-fSL8jYfqImQSUnP556t0XJRt0RmIV7EMV_Fp3PexkOXKFs',
  },
]

export function ProgramsSection() {
  return (
    <section id="programs" className="bg-surface-container-low py-section-gap">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="mb-stack-lg flex flex-col items-end justify-between gap-stack-md md:flex-row">
          <div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg mb-2">
              Elite Programs
            </h2>
            <p className="text-on-surface-variant">
              Master any discipline with our specialized tracks.
            </p>
          </div>
          <button
            type="button"
            className="group flex items-center gap-2 font-semibold text-primary"
          >
            View All Programs
            <MaterialIcon
              name="arrow_forward"
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-stack-md md:grid-cols-3">
          {programs.map((program) => (
            <div
              key={program.title}
              className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${program.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-8">
                <div
                  className={`mb-2 w-fit rounded-full px-3 py-1 text-xs font-bold ${program.tagClass}`}
                >
                  {program.tag}
                </div>
                <h3 className="mb-2 text-2xl font-bold text-white">{program.title}</h3>
                <p className="translate-y-4 text-sm text-white/70 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {program.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
