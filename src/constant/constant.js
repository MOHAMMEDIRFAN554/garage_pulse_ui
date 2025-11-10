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

  ASSIGN: `${base}/assignVehicle/assign`,
  ASSIGNMENT: (id) => `${base}/assignVehicle/assignment/${id}`,
  AVAILABLE: `${base}/assignVehicle/available`,

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
  UPDATEEMPLOYEE: (id) => `${base}/employee/update/${id}`,
  GETALLEMPLOYEEWITHVEHICLE: `${base}/employee/getAllEmployeeWithVehicle`,



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

  GET_ASSIGNED_VEHICLE: `${base}/employee/assignedVehicle`,
  UPDATE_RUNNING_KM: `${base}/employee/updateRunningKM`,
  CREATE_COLLECTION: `${base}/collection/add`,
  CREATE_SERVICE_REQUEST: `${base}/service/request`,
  GET_SERVICE_REQUESTS_OWNER: `${base}/service/requests/owner`,
  // **** EMPLOYEE (driver/co-driver) ****
  EMPLOYEE_ASSIGNED_VEHICLE: `${base}/employee/me/assigned-vehicle`,
  EMPLOYEE_UPDATE_RUNNING_KM: (vehicleId) => `${base}/employee/vehicle/${vehicleId}/update-km`,
  EMPLOYEE_CHANGE_PASSWORD: `${base}/employee/change-password`,

  // **** COLLECTIONS ****
  COLLECTION_CREATE: `${base}/collection/create`,
  COLLECTION_LIST: `${base}/collection/list`,

  // **** SERVICE REQUESTS ****
  SERVICE_REQUEST_CREATE: `${base}/service-request/create`,
  SERVICE_REQUEST_LIST_OWNER: `${base}/service-request/list`,
  SERVICE_REQUEST_UPDATE_STATUS: (id) => `${base}/service-request/${id}/status`,

  // **** SERVICE MANAGER ROUTES ****
  SERVICE_MANAGER_REQUESTS: `${base}/service-manager/requests`,
  SERVICE_MANAGER_UPDATE_STATUS: (id) => `${base}/service-manager/status/${id}`,
  SERVICE_MANAGER_ASSIGN: `${base}/service-manager/assign-mechanic`,
  SERVICE_MANAGER_EXPENSE: `${base}/service-manager/add-expense`,
  SERVICE_MANAGER_COMPLETE: (id) => `${base}/service-manager/complete/${id}`,
  SERVICE_MANAGER_CHANGE_PASSWORD: `${base}/service-manager/change-password`,
  SERVICE_MANAGER_MECHANICS: `${base}/service-manager/mechanics`,


};

export default constant;
