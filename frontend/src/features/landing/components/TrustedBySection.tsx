const logos = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD5c8iAFkgFheBU37ASSz0-tlWtoQ1S59P-Gbb3QhwakMShytegP7ZyC5-sIyqgNwzp4iceQPCBpVOUrUngl4UoRi5wHZ6EmPhGg-GfdMR66ViuqfNOB8qj2PXdNM8vG8bEVWCDsIewfok5rFVxEJsBTNjvPA43anCtr7URp4XJpj1EJzwEI_d9wgVfVPQ2KTai7es6QZAt9xeUzi69136QXxgq_DM0a-Dt6LpujkkV5M2jucqVtyy',
    alt: 'Nike logo',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPtObn7RnQJXeb2kjQvL-ZZ8NNeF9N85TJuR8NVodDPMSgHI6U1lGZRM-rq6tL8CpJHPS4JKnA_kTZH9pUfX8lI2oIyCnOscw2jdKjULWPtCRUNhO7eLwgMUsHQfH0SHMXs_PgxZsmzEKnXbuP2sxY25uW8y2bsvJXYEHRq14vBb_khoOEGulxHKyuwvGl1neOEwOaVWtRp7xDVHisITsfffPIlE4lcXQtRLLL9p69wCVadsIpLhg_',
    alt: 'Gymshark logo',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAU2q6QMTfXN3MVq_pNYwA5mFoEwCkgltLbcDAvulYyhbn7IDLeQT6iLK3O7UXqD_xR_auXBb7vdkqr6G7JHs_ruBDgXyZQah_hplW5SBYWNiNKhyrwD9uOJ5gl1x434tw3B1plJ3uC8vm8eMnWccidN5iYj9RE0bxesDkOanPP2TmfXpXvqLo5YxGDlD-8tetNbI17EGOxEcGnrZPGsTvRKfsh8Avl9oGDzNL3j_bcoz07FBa6BzpA',
    alt: 'Under Armour logo',
  },
]

export function TrustedBySection() {
  return (
    <section className="border-y border-white/5 bg-surface-container-lowest py-16">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <p className="mb-stack-lg text-center text-label-bold font-semibold tracking-widest text-on-surface-variant uppercase">
          Trusted by Industry Leaders
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24">
          {logos.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              className="logo-grayscale h-8 md:h-10"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
