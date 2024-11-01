import {
  getDeviceStateResponse,
  setDeviceStateResponse,
  getDevicesResponse,
} from "./alltypes"

const baseURL = "https://backend.tinxy.in/v2/devices/"
const requestOption: RequestInit = {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
  },
}

// @ts-ignore
export const getDevices = async (): Promise<getDevicesResponse> => {
  // @ts-ignore
  return (await fetchResponse(baseURL, requestOption))[0]
}

// @ts-ignore
export const getDeviceState = async (
  deviceID: string,
  deviceNumber: number
): Promise<getDeviceStateResponse> => {
  const newURL = `${baseURL}${deviceID}/state?deviceNumber=${deviceNumber}`
  return await fetchResponse(newURL, requestOption)
}

// @ts-ignore
export const setDeviceState = async (
  deviceID: string,
  deviceNumber: number,
  state: boolean
): Promise<setDeviceStateResponse> => {
  const newURL = `${baseURL}${deviceID}/toggle`
  const newRequestOptions: RequestInit = {
    headers: {
      ...requestOption.headers,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      request: {
        state: state ? 1 : 0,
      },
      deviceNumber: deviceNumber,
    }),
  }
  return await fetchResponse(newURL, newRequestOptions)
}

const fetchResponse = async (url: string, requestOption: RequestInit) => {
  try {
    const response = await fetch(url, requestOption)
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      console.log(response)
      throw new Error("Network response was not ok")
    }
  } catch (error) {
    console.error(error)
    return null
  }
}
