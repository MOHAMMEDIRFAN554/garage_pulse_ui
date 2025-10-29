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
  CREATESERVICE: `${local}/service/createService`,
  GETALLSERVICE: `${local}/service/getAllService`,
  GETSERVICEBYID: (id) => `${local}/service/getServiceById/${id}`,
  GETSERVICEVEHICLEBYNUMBER: `${local}/service/vehicle`,
  UPDATESERVICE: (id) => `${local}/service/updateService/${id}`,
  GETSERVICEBYID: (id) => `${local}/service/getServiceById/${id}`,
  DELETESERVICE: (id) => `${local}/service/deleteService/${id}`,
  GETVEHICLEBYNUMBER: `${base}/service/vehicle`,
  ADDEMPLOYEE: `${base}/employee/add`,
   GETVEHICLEBYNUMBER: `${local}/vehicle/number`, 
  DELETEVEHICLE: `${local}/vehicle`, 
};

export default constant;  
