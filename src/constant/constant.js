const base = "https://garage-pulse-api.onrender.com"; 
const local = "http://localhost:4500"

const constant = {
  REGISTER_API: `${base}/auth/register`,
  FORGOT_API: `${base}/auth/resetpassword`,
  LOGIN_API: `${base}/auth/login`,
  ADDVEHICLE: `${local}/vehicle/add`,
  GETALLVEHICLE: `${local}/vehicle/all`,
  GETVEHICLEBYID: (id) => `${local}/vehicle/${id}`,
  UPDATEVEHICLE: (id) => `${local}/vehicle/${id}`,
  DELETEVEHICLE: (id) => `${local}/vehicle/${id}`,
};

export default constant;
