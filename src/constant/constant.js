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
  CREATESERVICE: `${base}/service/createService`,
  GETALLSERVICE: `${base}/service/getAllService`,
  GETSERVICEBYID: (id) => `${base}/service/getServiceById/${id}`,
  GETSERVICEVEHICLEBYNUMBER: `${base}/service/vehicle`,
  UPDATESERVICE: (id) => `${base}/service/updateService/${id}`,
  GETSERVICEBYID: (id) => `${base}/service/getServiceById/${id}`,
  DELETESERVICE: (id) => `${base}/service/deleteService/${id}`,
  GETVEHICLEBYNUMBER: `${base}/service/vehicle`,
  ADDEMPLOYEE: `${base}/employee/add`,
   GETVEHICLEBYNUMBER: `${base}/vehicle/number`, 
  DELETEVEHICLE: `${base}/vehicle`, 
};

export default constant;  
