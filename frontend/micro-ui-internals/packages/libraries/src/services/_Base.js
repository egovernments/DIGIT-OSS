import { Request } from "./Utils/Request";

const REQUEST = "request";
const EXECUTE = "execute";

class Base {
  constructor(name, fn) {
    this._name = name;
    this._preName = name + "Pre";
    this._postName = name + "Post";
    this._request = Request;
    this._fn = fn;
  }

  _execute(fn, args) {
    let args1 = args;
    if (window && window[this._preName]) {
      args1 = window[this._preName](args) || {};
    }
    const args2 = fn === REQUEST ? this._request(args1) : this._fn(args1) || {};
    if (window && window[this._postName]) {
      return window[this._postName](args2);
    }
    return args2;
  }

  request(args) {
    return this._execute(REQUEST, args);
  }

  exec(args) {
    return this._execute(EXECUTE, args);
  }
}
export default Base;
