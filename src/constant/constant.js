const local = "http://localhost:4500";
const render = "https://garage-pulse-api.onrender.com";

const base = local;

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
  DELETESERVICE: (id) => `${base}/service/deleteService/${id}`,
  GETVEHICLEBYNUMBER: `${base}/service/vehicle`,

  ADDEMPLOYEE: `${base}/employee/add`,
  GETALLEMPLOYEE: `${base}/employee/getAllEmployee`,
  GETEMPLOYEEBYID: (id) => `${base}/employee/getEmployee/${id}`,
  DELETEEMPLOYEE: (id) => `${base}/employee/${id}`,

  ADDINSURANCE: `${base}/insurance/add`,

  CREATE_MANUFACTURER: `${base}/dropVehicle/manufacturer`,
  CREATE_MODEL: `${base}/dropVehicle/model`,
  GET_MANUFACTURERS_BY_TYPE: (vehicleType) =>
    `${base}/dropVehicle/manufacturer/by-type/${vehicleType}`,
  GET_MODELS_BY_MANUFACTURER: (manufacturerId) =>
    `${base}/dropVehicle/model/by-manufacturer/${manufacturerId}`,
  SEED_VEHICLE_TYPES: `${base}/dropVehicle/vehicle-type/seed`,
  GET_VEHICLE_TYPES: `${base}/dropVehicle/vehicle-type`,
};

export default constant;
