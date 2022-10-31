import { parseUrl } from "@aws-sdk/url-parser";
import { defaultEndpointResolver } from "./endpoint/endpointResolver";
export const getRuntimeConfig = (config) => ({
    apiVersion: "2014-06-30",
    disableHostPrefix: config?.disableHostPrefix ?? false,
    endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
    logger: config?.logger ?? {},
    serviceId: config?.serviceId ?? "Cognito Identity",
    urlParser: config?.urlParser ?? parseUrl,
});
