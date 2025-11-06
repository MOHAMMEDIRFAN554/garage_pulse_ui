const local = "http://localhost:4500";
const render = "https://garage-pulse-api.onrender.com";

const base = render;

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

  CREATE_SERVICE_TYPE: `${base}/dropService/type`,
  GET_ALL_SERVICE_TYPES: `${base}/dropService/type/all`,

  CREATE_EMPLOYEE_ROLE: `${base}/dropEmployee/role`,
  GET_ALL_EMPLOYEE_ROLES: `${base}/dropEmployee/role/all`,

  CREATE_FUEL_TYPE: `${base}/dropFuel/type`,
  GET_ALL_FUEL_TYPES: `${base}/dropFuel/type/all`,
};

export default constant;
