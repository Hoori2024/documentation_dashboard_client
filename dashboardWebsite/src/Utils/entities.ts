export interface DecodedToken {
    exp: number;
    iat: number;
    userId: string;
  }

  export interface IuserData {
    message: string
    existingUser: IExistingUser
  }
  
  export interface IExistingUser {
    _id: string
    email: string
    lastName: string
    firstName: string
    password: string
    role: string
    phoneNumber: string
    postalAddress: string
    isConnected: boolean
    __v: number
  }
  
  export interface IField {
    message: string
    existingField: IExistingField[]
  }
  
  export interface IExistingField {
    _id: string
    fieldOwner: string
    fieldName: string
    fieldAddress: string
    fieldShape: number[][]
    fieldPlants: any[]
    fieldWeeds: any[]
    droneActivity: number
    dronePosition: any[]
    dronePath: any[]
    coverScheduled: any[]
    coverPast: any[]
    coverStatus: number
    __v: number
    coverDepartureTimeCurrent?: string
    fieldSize?: string
    coverEstimatedTime?: number
    fieldsGenerated?: number
  }
  