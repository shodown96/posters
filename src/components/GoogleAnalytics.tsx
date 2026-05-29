import { useEffect } from 'react'

const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID

export function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    const script1 = document.createElement('script')

    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`

    document.head.appendChild(script1)

    const script2 = document.createElement('script')

    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];

      function gtag(){
        dataLayer.push(arguments);
      }

      window.gtag = gtag;

      gtag('js', new Date());

      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_path: window.location.pathname,
      });
    `

    document.head.appendChild(script2)
  }, [])

  return null
}