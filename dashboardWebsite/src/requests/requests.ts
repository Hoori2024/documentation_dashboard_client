import axios from "axios";
import { IExistingUser, IField, IuserData } from "../Utils/entities";
export const baseURL = 'https://cr9r3uigtw.eu-west-1.awsapprunner.com/';
// export const baseURL = 'http://127.0.0.1:3000/';
export const config = {
  headers: { Authorization: `Bearer ${localStorage.token}` },
  // headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDNhOTk2N2EwNzFjNmY3Nzc1YjBhZDQiLCJpYXQiOjE2ODIxNDkxNjAsImV4cCI6MTY4MjE1Mjc2MH0.qugXFHx-wST6alC1dyeD9ABKDES35-ENyXdKSwTPPEU`},
};

/**
 * Requête de déconnexion
 * @function logout
 * @category Fonctions
 * @async
 * @param userId {number} id de l'utilisateur
 * @returns {Promise<any>}
 */
export async function logout(userId: number): Promise<any> {
  const url = `${baseURL}auth/logout/${userId}`;
  return axios.get(url, config).then((response) => {
    if (response && response.status === 200) {
      localStorage.clear()
      return Promise.resolve();
    }
    return Promise.reject();
  });
}

/**
 * Requête de demande de donnée utilisateur
 * @function userData
 * @category Fonctions
 * @async
 * @param userId {string} id de l'utilisateur
 * @returns {Promise<IuserData>}
 */
export async function userData(userId: string): Promise<IuserData> {
  const url = `${baseURL}user/info/${userId}`;
  return axios.get(url, config).then((response) => {
    if (response && response.status === 200) {
      const userData: IuserData = response.data;
      console.log("response : ", response.data);
      return Promise.resolve(userData);
    }
    return Promise.reject();
  });
}

/**
 * Requête de demande de donnée utilisateur
 * @function fieldData
 * @category Fonctions
 * @async
 * @param userId {string} id du champ
 * @returns {Promise<IField>}
 */
export async function fieldData(userId: string): Promise<IField> {
  const url = `${baseURL}field/byowner/${userId}`;
  return axios.get(url, config).then((response) => {
    if (response && response.status === 200) {
      const userData: IField = response.data;
      console.log("response : ", response.data);
      return Promise.resolve(userData);
    }
    return Promise.reject();
  });
}

/**
 * Requête de demande de donnée d'id d'un champ
 * @function getFieldId
 * @category Fonctions
 * @async
 * @param name {string} id du champ
 * @returns {Promise<any>}
 */
export async function getFieldId(name: string): Promise<any> {
  const url = `${baseURL}field/id/${name}`;
  return axios.get(url, config).then((response) => {
    if (response && response.status === 200) {
      const fieldId: any = response.data;
      console.log("response : ", response.data);
      return Promise.resolve(fieldId);
    }
    return Promise.reject();
  });
}


// export async function putEmail(newEmail: string): Promise<any> {

//   const data = newEmail;

//   let emailConfig = {
//     method: 'put',
//     maxBodyLength: Infinity,
//     url: `${baseURL}user/email/${localStorage.userid}`,
//     headers: {
//       'Authorization': `Bearer ${localStorage.token}`
//     },
//     data: data
//     // data : data
//   };

//   axios.request(emailConfig)
//     .then((response) => {
//       console.log("token", localStorage.token)
//       console.log(JSON.stringify(response.data));
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }

/**
 * Requête de demande de donnée de nom d'un champ
 * @function putFieldName
 * @category Fonctions
 * @async
 * @param name {string} id du champ
 */
export const putFieldName = async (fieldName: string, fieldId: string) => {
  var body = {
    // fieldId: fieldId,
    newName: fieldName,
    };
  const {data} = (await axios.put('https://cr9r3uigtw.eu-west-1.awsapprunner.com/field/renamefield/' + fieldId, body, {headers: { Authorization: `Bearer ${localStorage.token}` }}));
  console.log("DATA : : ", data);
  fieldData(localStorage.userid);
}

export const putEmail = async (email: string) => {
  var body = {
    userId: localStorage.userid,
    email: email,
    };
  const {data} = (await axios.put(`${baseURL}/user/email/` + localStorage.userid, body, {headers: { Authorization: `Bearer ${localStorage.token}` }}));
  userData(localStorage.userid)
}

export const changeLastName = async (name: string) => {
  var body = {
    userId: localStorage.userid,
    lastName: name,
    };
  const {data} = (await axios.put(`${baseURL}user/lname/` + localStorage.userid, body, {headers: { Authorization: `Bearer ${localStorage.token}` }}));
}

export const changeFirstName = async (name: string) => {
  var body = {
    userId: localStorage.userid,
    firstName: name,
    };
  const {data} = (await axios.put(`${baseURL}user/fname/` + localStorage.userid, body, {headers: { Authorization: `Bearer ${localStorage.token}` }}));
}

export const changePhone = async (name: string) => {
  var body = {
    userId: localStorage.userid,
    phoneNumber: name,
    };
  const {data} = (await axios.put(`${baseURL}user/phone/` + localStorage.userid, body, {headers: { Authorization: `Bearer ${localStorage.token}` }}));
}

export const changePostalAddress = async (name: string) => {
  var body = {
    userId: localStorage.userid,
    postalAddress: name,
    };
  const {data} = (await axios.put(`${baseURL}user/postal/` + localStorage.userid, body, {headers: { Authorization: `Bearer ${localStorage.token}` }}));
}