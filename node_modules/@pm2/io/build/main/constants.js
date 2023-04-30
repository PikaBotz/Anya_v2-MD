"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver = require("semver");
exports.default = {
    METRIC_INTERVAL: 990
};
function canUseInspector() {
    const isAboveNode10 = semver.satisfies(process.version, '>= 10.1.0');
    const isAboveNode8 = semver.satisfies(process.version, '>= 8.0.0');
    const canUseInNode8 = process.env.FORCE_INSPECTOR === '1'
        || process.env.FORCE_INSPECTOR === 'true' || process.env.NODE_ENV === 'production';
    return isAboveNode10 || (isAboveNode8 && canUseInNode8);
}
exports.canUseInspector = canUseInspector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFnQztBQUVoQyxrQkFBZTtJQUNiLGVBQWUsRUFBRSxHQUFHO0NBQ3JCLENBQUE7QUFFRCxTQUFnQixlQUFlO0lBQzdCLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQTtJQUNwRSxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUE7SUFDbEUsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEtBQUssR0FBRztXQUNwRCxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsS0FBSyxNQUFNLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssWUFBWSxDQUFBO0lBQ3BGLE9BQU8sYUFBYSxJQUFJLENBQUMsWUFBWSxJQUFJLGFBQWEsQ0FBQyxDQUFBO0FBQ3pELENBQUM7QUFORCwwQ0FNQyJ9