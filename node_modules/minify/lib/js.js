import {minify} from 'terser';
import assert from 'assert';

/**
 * minify js data.
 *
 * @param data
 * @param userOptions - (optional) object that may contain a `js` key with an object of options
 */
export default async (data, userOptions) => {
    assert(data);
    
    const options = userOptions?.js || {};
    const {code} = await minify(data, options);
    
    return code;
};

