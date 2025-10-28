const base = "https://garage-pulse-api.onrender.com"; 
const local = "http://localhost:4500"

const constant = {
  REGISTER_API: `${base}/auth/register`,
  FORGOT_API: `${base}/auth/resetpassword`,
  LOGIN_API: `${base}/auth/login`,
  ADDVEHICLE: `${base}/vehicle/add`,
  GETALLVEHICLE: `${base}/vehicle/all`,
  GETVEHICLEBYID: (id) => `${base}/vehicle/${id}`,
  UPDATEVEHICLE: (id) => `${base}/vehicle/${id}`,
  DELETEVEHICLE: (id) => `${base}/vehicle/${id}`,
};

export default constant;  
