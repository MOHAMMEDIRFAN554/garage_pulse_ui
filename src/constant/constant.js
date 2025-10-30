const local = "http://localhost:4500"

const render = "https://garage-pulse-api.onrender.com";

const base = render 


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
  DLGETVEHICLEBYNUMBER: `${base}/vehicle/number`, 
  GETALLEMPLOYEE: `${base}/employee/getAllEmployee`,
  GETEMPLOYEEBYID: (id) => `${base}/employee/getEmployee/${id}`,
  DELETEEMPLOYEE: (id) => `${base}/employee/${id}`,

  ADDINSURANCE : `${base}/insurance/add`,

};

export default constant;  
