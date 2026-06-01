import { useState, useEffect } from 'react'

export function usePageLoading(delay: number = 800) {
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [delay])
  
  return isLoading
}

export function useDelayedUnmount(isVisible: boolean, delay: number = 300) {
  const [isRendered, setIsRendered] = useState(isVisible)

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null

    if (isVisible) {
      setIsRendered(true)
    } else {
      timeout = setTimeout(() => {
        setIsRendered(false)
      }, delay)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [isVisible, delay])

  return isRendered
}
