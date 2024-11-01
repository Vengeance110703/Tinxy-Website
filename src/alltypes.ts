export type Device = {
  deviceNumber: number
  state: boolean
  name: string
}

export type getDeviceStateResponse = {
  state: "OFF" | "ON"
  status: 1 | 0
}

export type setDeviceStateResponse = {
  state: "OFF" | "ON"
}

export type getDevicesResponse = {
  isArchived: boolean
  _id: string
  name: string
  enabled: boolean
  userId: string
  switchType: string
  toggleDelay: number
  devices: string[]
  deviceTypes: string[]
  notificationOn: boolean
  firmwareVersion: number
  registrationDate: string
  remoteCodes?: any[]
  mqttPassword: string
  typeId: {
    _id: string
    primary: boolean
    numberOfRelays: number
    name: string
    __v: number
    gtype: string
    traits: string[]
    long_name: string
    amazonReviewLink: string
    features: string[]
    toggleDelay: number
  }
  uuidRef: {
    _id: string
    uuid: string
    enabled: boolean
    typeId: string
    byUserId: string
    serialNumber: number
    hasTransmitter: boolean
    createdOn: string
    __v: number
  }
  __v: number
}
