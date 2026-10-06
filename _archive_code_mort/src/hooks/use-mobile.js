import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Ajouter l'écouteur
    mql.addEventListener("change", onChange)

    // Initialiser l'état
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Nettoyage
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
