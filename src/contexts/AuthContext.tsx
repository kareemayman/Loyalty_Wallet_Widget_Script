import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react"
type AuthContextType = {
  user: { token: string } | null
  login: () => Promise<void>
  logout: () => void
  isLoading: boolean
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const receivedTokenRef = useRef<string | null>(null)

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data && event.data.type === "userToken" && event.data.userToken) {
        receivedTokenRef.current = event.data.userToken
        localStorage.setItem("userToken", event.data.userToken)
        setToken(event.data.userToken)
        setTokenError(null)
        setIsLoading(false)
      }
    }
    window.addEventListener("message", handleMessage)

    const timeout = setTimeout(() => {
      if (!receivedTokenRef.current && !localStorage.getItem("userToken")) {
        setTokenError(
          "Authentication token not received from parent page. Please refresh or contact support."
        )
        setIsLoading(false)
      }
    }, 2000)

    // Check for existing token in localStorage (for reloads)
    const storedToken = localStorage.getItem("userToken")
    if (storedToken) {
      setToken(storedToken)
      receivedTokenRef.current = storedToken
      setTokenError(null)
      setIsLoading(false)
    }

    return () => {
      window.removeEventListener("message", handleMessage)
      clearTimeout(timeout)
    }
  }, [])

  // login is now a no-op, just ensures token is present
  const login = async () => {
    setIsLoading(true)
    try {
      const token = receivedTokenRef.current || localStorage.getItem("userToken")
      if (!token) {
        setTokenError("No authentication token received.")
        setIsLoading(false)
        throw new Error("No authentication token received.")
      }
      setToken(token)
      setTokenError(null)
    } catch (error) {
      setTokenError("Login failed.")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("userToken")
    receivedTokenRef.current = null
    setToken(null)
  }
 
  return (
    <AuthContext.Provider value={{ user: token ? { token } : null, login, logout, isLoading }}>
      {tokenError ? (
        <div style={{ color: "red", padding: 16, textAlign: "center" }}>{tokenError}</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}
 