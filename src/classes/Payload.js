import { setValue } from '../utils/object'
import options from '../plugin/options'

// Jean - SyncSketch: made the `update` method static, so that it can be called on generic Objects
// This is to be able to pass a `Payload` object through ipc in Electron, and still call update on it
// as it will lose its `Payload` instance type when serialized/deserialized.

/**
 * Handles passing and setting of sub-property values
 */
export default class Payload {
  constructor (expr, path, value) {
    this.expr = expr
    this.path = path
    this.value = value
	this.isPayloadInstance = true
  }

  update (target) {
    return Payload.update(this, target)
  }

  /**
   * Set sub-property on target
   * @param payloadObj
   * @param target
   */
  static update (payloadObj, target) {
    if (!options.deep) {
      console.error(`[Vuex Pathify] Unable to access sub-property for path '${payloadObj.expr}':
    - Set option 'deep' to 1 to allow it`)
      return target
    }

    const success = setValue(target, payloadObj.path, payloadObj.value, options.deep > 1)

    // unable to set sub-property
    if (!success && process.env.NODE_ENV !== 'production') {
      console.error(`[Vuex Pathify] Unable to create sub-property for path '${payloadObj.expr}':
    - Set option 'deep' to 2 to allow it`)
      return target
    }

    // set sub-property
    return Array.isArray(target)
      ? [].concat(target)
      : Object.assign({}, target)
  }
}
