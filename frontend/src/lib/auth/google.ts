/**
 * Requests a Google ID token via Sign In With Google (popup UX).
 * Requires GoogleOAuthProvider so the GIS script is loaded.
 */
export function requestGoogleIdToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
    if (!clientId?.trim()) {
      reject(
        new Error(
          'Google Login is not configured. Set VITE_GOOGLE_CLIENT_ID in frontend/.env',
        ),
      )
      return
    }

    const google = window.google
    if (!google?.accounts?.id) {
      reject(
        new Error(
          'Google Identity Services failed to load. Check your network or disable popup blockers.',
        ),
      )
      return
    }

    let settled = false
    const settle = (fn: () => void): void => {
      if (settled) return
      settled = true
      window.clearTimeout(timeoutId)
      fn()
    }

    const timeoutId = window.setTimeout(() => {
      settle(() =>
        reject(new Error('Google sign-in timed out. Please try again.')),
      )
    }, 120_000)

    google.accounts.id.initialize({
      client_id: clientId,
      ux_mode: 'popup',
      auto_select: false,
      cancel_on_tap_outside: true,
      context: 'signin',
      callback: (response: google.accounts.id.CredentialResponse) => {
        if (response.credential) {
          settle(() => resolve(response.credential!))
        } else {
          settle(() => reject(new Error('Google did not return an ID token')))
        }
      },
    })

    const host = document.createElement('div')
    host.style.position = 'fixed'
    host.style.left = '-9999px'
    host.style.top = '0'
    host.setAttribute('aria-hidden', 'true')
    document.body.appendChild(host)

    google.accounts.id.renderButton(host, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: 320,
    })

    window.requestAnimationFrame(() => {
      const btn = host.querySelector('div[role="button"]') as HTMLElement | null
      if (!btn) {
        host.remove()
        settle(() =>
          reject(new Error('Google sign-in failed to initialize. Please try again.')),
        )
        return
      }

      btn.click()
      window.setTimeout(() => host.remove(), 4000)
    })
  })
}
