import { parseUrl } from "@aws-sdk/url-parser";
import { defaultEndpointResolver } from "./endpoint/endpointResolver";
export const getRuntimeConfig = (config) => ({
    apiVersion: "2019-06-10",
    disableHostPrefix: config?.disableHostPrefix ?? false,
    endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
    logger: config?.logger ?? {},
    serviceId: config?.serviceId ?? "SSO",
    urlParser: config?.urlParser ?? parseUrl,
});
