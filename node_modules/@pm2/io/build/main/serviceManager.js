"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services = new Map();
class Service {
}
exports.Service = Service;
class ServiceManager {
    static get(serviceName) {
        return services.get(serviceName);
    }
    static set(serviceName, service) {
        return services.set(serviceName, service);
    }
    static reset(serviceName) {
        return services.delete(serviceName);
    }
}
exports.ServiceManager = ServiceManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZU1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZU1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxNQUFNLFFBQVEsR0FBcUIsSUFBSSxHQUFHLEVBQWUsQ0FBQTtBQUV6RCxNQUFhLE9BQU87Q0FBRztBQUF2QiwwQkFBdUI7QUFFdkIsTUFBYSxjQUFjO0lBRWxCLE1BQU0sQ0FBQyxHQUFHLENBQUUsV0FBbUI7UUFDcEMsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQ2xDLENBQUM7SUFFTSxNQUFNLENBQUMsR0FBRyxDQUFFLFdBQW1CLEVBQUUsT0FBZ0I7UUFDdEQsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUMzQyxDQUFDO0lBRU0sTUFBTSxDQUFDLEtBQUssQ0FBRSxXQUFtQjtRQUN0QyxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDckMsQ0FBQztDQUNGO0FBYkQsd0NBYUMifQ==