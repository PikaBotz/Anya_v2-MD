import {findUp} from 'find-up';
import _readjson from 'readjson';

export async function readOptions({readjson = _readjson, find = findUp} = {}) {
    const optionsPath = await find('.minify.json');
    
    if (!optionsPath)
        return {};
    
    return readjson(optionsPath);
}

