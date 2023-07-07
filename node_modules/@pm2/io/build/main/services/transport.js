"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IPCTransport_1 = require("../transports/IPCTransport");
class TransportConfig {
}
exports.TransportConfig = TransportConfig;
function createTransport(name, config) {
    const transport = new IPCTransport_1.IPCTransport();
    transport.init(config);
    return transport;
}
exports.createTransport = createTransport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3RyYW5zcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLDZEQUF5RDtBQUl6RCxNQUFhLGVBQWU7Q0EwQzNCO0FBMUNELDBDQTBDQztBQWdDRCxTQUFnQixlQUFlLENBQUUsSUFBWSxFQUFFLE1BQXVCO0lBQ3BFLE1BQU0sU0FBUyxHQUFHLElBQUksMkJBQVksRUFBRSxDQUFBO0lBQ3BDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDdEIsT0FBTyxTQUFTLENBQUE7QUFlbEIsQ0FBQztBQWxCRCwwQ0FrQkMifQ==