const baseURL = "https://backend.tinxy.in/v2/devices/"
const requestOption: RequestInit = {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
  },
}

export const getDevices = async () => {
  return await fetchResponse(baseURL, requestOption)
}

export const getDeviceState = async (
  deviceID: number,
  deviceNumber: number
) => {
  const newURL = `${baseURL}${deviceID}/state?deviceNumber=${deviceNumber}`
  return await fetchResponse(newURL, requestOption)
}

export const setDeviceState = async (
  deviceID: number,
  deviceNumber: number,
  state: boolean
) => {
  const newURL = `${baseURL}${deviceID}/state`
  const newRequestOptions: RequestInit = {
    ...requestOption,
    method: "POST",
    body: JSON.stringify({
      request: {
        state: state ? 1 : 0,
      },
      deviceNumeber: deviceNumber,
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
    return {}
  }
}
