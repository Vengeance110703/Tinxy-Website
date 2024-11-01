import "./App.css"
import { Button } from "./components/ui/button"
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider } from "./config/firebase"
import { useEffect, useRef, useState } from "react"
import { getDevices, getDeviceState, setDeviceState } from "./APIs"
import { Device } from "./alltypes"
import { Switch } from "./components/ui/switch"
import { FaGoogle } from "react-icons/fa"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/ui/card"
import { Label } from "./components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar"

function App() {
  const [validated, setValidated] = useState(false)
  const [deviceList, setDeviceList] = useState<Device[]>([])
  const [deviceID, setDeviceID] = useState("")
  const [counter, setCounter] = useState(0)
  const [stateChange, setStateChange] = useState(false)

  const bufferRef = useRef<number>(0)

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
        setCounter(1)
      }
    })
  }, [])

  useEffect(() => {
    if (stateChange) {
      bufferRef.current = 4
    }
  }, [stateChange])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (counter > 0) {
        if (bufferRef.current === 0) {
          const devices: Device[] = []
          for (const device of deviceList) {
            const state =
              (await getDeviceState(deviceID, device.deviceNumber)).state ===
              "ON"
                ? true
                : false
            devices.push({
              ...device,
              state: state,
            })
          }
          if (bufferRef.current === 0) {
            setDeviceList(devices)
          } else {
            bufferRef.current = bufferRef.current - 1
          }
          setStateChange(false)
        } else {
          bufferRef.current -= 1
        }
        setCounter(counter + 1)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [counter])

  useEffect(() => {
    console.log("Device list updated", deviceList)
  }, [deviceList])

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
    const data = await setDeviceState(deviceID, device.deviceNumber, newState)
    const state = data.state === "ON" ? true : false
    const updatedDevice: Device = {
      ...device,
      state: state,
    }
    setStateChange(true)
    setDeviceList(prevDeviceList =>
      prevDeviceList.map(ele =>
        ele.deviceNumber === device.deviceNumber ? updatedDevice : ele
      )
    )
  }

  return (
    <>
      {validated ? (
        <>
          <div className="container mx-auto p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <h1 className="text-2xl font-bold">Tinxy Dashboard</h1>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium">Yash Sheth</p>
                  <p className="text-sm text-gray-500">yashsheth66@gmail.com</p>
                </div>
                <Avatar>
                  <AvatarImage
                    src={auth.currentUser?.photoURL!}
                    alt="Yash Sheth"
                  />
                  <AvatarFallback className="">
                    {auth.currentUser
                      ?.displayName!.split(" ")
                      .map(n => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button onClick={handleLogout}>Logout</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deviceList.map((device, index) => (
                <Card key={index} className="p-6">
                  <div className="flex flex-col items-center space-y-6">
                    <Label
                      htmlFor={device.deviceNumber.toString()}
                      className="text-2xl font-medium"
                    >
                      {device.name}
                    </Label>
                    <Switch
                      id={device.deviceNumber.toString()}
                      checked={device.state}
                      onCheckedChange={checked =>
                        handleStateChange(device, checked)
                      }
                      className="bg-gray-800 scale-125"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Welcome to Tinxy Website</CardTitle>
              <CardDescription>Sign in to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={handleSignIn}>
                <FaGoogle className="mr-2 h-4 w-4" />
                Sign in with Google
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default App
