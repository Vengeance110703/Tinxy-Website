import "./App.css"
import { Button } from "./components/ui/button"
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider } from "./config/firebase"
import { useEffect, useState } from "react"
import { getDevices, getDeviceState, setDeviceState } from "./APIs"
import { Device } from "./alltypes"
import { Switch } from "./components/ui/switch"

function App() {
  const [validated, setValidated] = useState(false)
  const [deviceList, setDeviceList] = useState<Device[]>([])
  const [deviceID, setDeviceID] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user?.email === "yashsheth66@gmail.com") {
        setValidated(true)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    getDevices().then(async data => {
      if (data !== null) {
        setDeviceID(data._id)
        const devices: Device[] = []
        for (
          let deviceNumber = 0;
          deviceNumber < data.devices.length;
          deviceNumber++
        ) {
          const name = data.devices[deviceNumber]
          const state = (await getDeviceState(data._id, deviceNumber + 1)).state
          devices.push({
            name: name,
            state: state === "ON" ? true : false,
            deviceNumber: deviceNumber + 1,
          })
        }
        setDeviceList(devices)
      }
    })
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

  const handleStateChange = async (device: Device, newState: boolean) => {
    console.log(newState)
    const data = await setDeviceState(deviceID, device.deviceNumber, newState)
    const state = data.state === "ON" ? true : false
    const updatedDevice = {
      ...device,
      state: state,
    }
    const updatedDeviceList = deviceList.map(ele =>
      ele.deviceNumber === device.deviceNumber ? updatedDevice : ele
    )
    setDeviceList(updatedDeviceList)
  }

  return (
    <>
      {validated ? (
        <>
          <Button onClick={handleLogout}>Logout</Button>
          {deviceList.map(device => (
            <Switch
              id={device.deviceNumber.toString()}
              checked={device.state}
              onCheckedChange={checked => handleStateChange(device, checked)}
            >
              {device.name}
            </Switch>
          ))}
        </>
      ) : (
        <Button onClick={handleSignIn}>Sign in</Button>
      )}
    </>
  )
}

export default App
