// import axios from "axios";

// const BASE_URL = "http://127.0.0.1:8000/api";
// const LOGIN_URL = `${BASE_URL}/token/`;
// const REFRESH_URL = `${BASE_URL}/token/refresh/`;
// const NOTES_URL = `${BASE_URL}/notes/`;

// export const login = async (username, password) => {
//   const response = await axios.post(
//     LOGIN_URL,
//     { username: username, password: password },
//     {
//       withCredentials: true,
//     }
//   );
//   console.log("Login Response:", response); // Check response
//   return response.data.success;
// };

// export const refresh_token =  () => {
//   const response = axios.post(REFRESH_URL, 
//     {},
//     { withCredentials: true }
//   );
//   return response.data.refreshed;

// }

// export const getNotes = async () => {
//   const response = await axios.get(NOTES_URL, { withCredentials: true });
//   return response.data;
// };

// const call_refresh = async (error) => {
//   if (error.response && error.response.status === 401) {
//     const tokenRefreshed = await refresh_token();

//     if (tokenRefreshed) {
//       const retryResponse = await axios(error.config);
//     }
//   }
// }


