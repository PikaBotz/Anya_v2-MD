"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serviceManager_1 = require("../serviceManager");
const Debug = require("debug");
class EventsFeature {
    constructor() {
        this.logger = Debug('axm:features:events');
    }
    init() {
        this.transport = serviceManager_1.ServiceManager.get('transport');
        this.logger('init');
    }
    emit(name, data) {
        if (typeof name !== 'string') {
            console.error('event name must be a string');
            return console.trace();
        }
        if (typeof data !== 'object') {
            console.error('event data must be an object');
            return console.trace();
        }
        if (data instanceof Array) {
            console.error(`event data cannot be an array`);
            return console.trace();
        }
        let inflightObj = {};
        try {
            inflightObj = JSON.parse(JSON.stringify(data));
        }
        catch (err) {
            return console.log('Failed to serialize the event data', err.message);
        }
        inflightObj.__name = name;
        if (this.transport === undefined) {
            return this.logger('Failed to send event as transporter isnt available');
        }
        this.transport.send('human:event', inflightObj);
    }
    destroy() {
        this.logger('destroy');
    }
}
exports.EventsFeature = EventsFeature;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ZlYXR1cmVzL2V2ZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNEQUFrRDtBQUdsRCwrQkFBOEI7QUFFOUIsTUFBYSxhQUFhO0lBQTFCO1FBR1UsV0FBTSxHQUFhLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0lBc0N6RCxDQUFDO0lBcENDLElBQUk7UUFDRixJQUFJLENBQUMsU0FBUyxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDckIsQ0FBQztJQUVELElBQUksQ0FBRSxJQUFhLEVBQUUsSUFBVTtRQUM3QixJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUE7WUFDNUMsT0FBTyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUE7U0FDdkI7UUFDRCxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUE7WUFDN0MsT0FBTyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUE7U0FDdkI7UUFDRCxJQUFJLElBQUksWUFBWSxLQUFLLEVBQUU7WUFDekIsT0FBTyxDQUFDLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO1lBQzlDLE9BQU8sT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFBO1NBQ3ZCO1FBRUQsSUFBSSxXQUFXLEdBQWlCLEVBQUUsQ0FBQTtRQUNsQyxJQUFJO1lBQ0YsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1NBQy9DO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQ3RFO1FBRUQsV0FBVyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7UUFDekIsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtZQUNoQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsb0RBQW9ELENBQUMsQ0FBQTtTQUN6RTtRQUNELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQTtJQUNqRCxDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDeEIsQ0FBQztDQUNGO0FBekNELHNDQXlDQyJ9