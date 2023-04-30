"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IO_KEY = Symbol.for('@pm2/io');
class Entrypoint {
    constructor() {
        try {
            this.io = global[IO_KEY].init(this.conf());
            this.onStart(err => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                this.sensors();
                this.events();
                this.actuators();
                this.io.onExit((code, signal) => {
                    this.onStop(err, () => {
                        this.io.destroy();
                    }, code, signal);
                });
                if (process && process.send)
                    process.send('ready');
            });
        }
        catch (e) {
            if (this.io) {
                this.io.destroy();
            }
            throw (e);
        }
    }
    events() {
        return;
    }
    sensors() {
        return;
    }
    actuators() {
        return;
    }
    onStart(cb) {
        throw new Error('Entrypoint onStart() not specified');
    }
    onStop(err, cb, code, signal) {
        return cb();
    }
    conf() {
        return undefined;
    }
}
exports.Entrypoint = Entrypoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlwb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mZWF0dXJlcy9lbnRyeXBvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUVwQyxNQUFhLFVBQVU7SUFHckI7UUFDRSxJQUFJO1lBQ0YsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO1lBRTFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2pCLElBQUksR0FBRyxFQUFFO29CQUNQLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7b0JBQ2xCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7aUJBQ2hCO2dCQUVELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtnQkFDZCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7Z0JBQ2IsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO2dCQUVoQixJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRTtvQkFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO3dCQUNwQixJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFBO29CQUNuQixDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFBO2dCQUNsQixDQUFDLENBQUMsQ0FBQTtnQkFFRixJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSTtvQkFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ3BELENBQUMsQ0FBQyxDQUFBO1NBQ0g7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUVWLElBQUksSUFBSSxDQUFDLEVBQUUsRUFBRTtnQkFDWCxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFBO2FBQ2xCO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ1Y7SUFDSCxDQUFDO0lBRUQsTUFBTTtRQUNKLE9BQU07SUFDUixDQUFDO0lBRUQsT0FBTztRQUNMLE9BQU07SUFDUixDQUFDO0lBRUQsU0FBUztRQUNQLE9BQU07SUFDUixDQUFDO0lBRUQsT0FBTyxDQUFFLEVBQVk7UUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFBO0lBQ3ZELENBQUM7SUFFRCxNQUFNLENBQUUsR0FBVSxFQUFFLEVBQVksRUFBRSxJQUFZLEVBQUUsTUFBYztRQUM1RCxPQUFPLEVBQUUsRUFBRSxDQUFBO0lBQ2IsQ0FBQztJQUVELElBQUk7UUFDRixPQUFPLFNBQVMsQ0FBQTtJQUNsQixDQUFDO0NBQ0Y7QUExREQsZ0NBMERDIn0=