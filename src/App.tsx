import "./App.css"
import { Button } from "./components/ui/button"
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider } from "./config/firebase"
import { useEffect, useState } from "react"

function App() {
  const [validated, setValidated] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user?.email === "yashsheth66@gmail.com") {
        setValidated(true)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setValidated(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {validated ? (
        <>
          <Button onClick={handleLogout}>Logout</Button>
        </>
      ) : (
        <Button onClick={handleSignIn}>Sign in</Button>
      )}
    </>
  )
}

export default App
