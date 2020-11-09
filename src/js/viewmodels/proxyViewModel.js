import todoModel from '@/js/models/todoModel';

export default class ViewModel {
  constructor() {
    this.views = new Set();
    this.data = new Map();
  }
  getProxy(vm) {
    return new Proxy(vm, {
      get(_vm, prop) {
        return _vm.data.has(prop) ? todoModel[prop] : _vm[prop];
      },
      set(_vm, prop, value) {
        value = _vm.data.get(prop).callback.bind(_vm)(value);
        todoModel[prop] = value;

        _vm.updateView(prop);
        return true;
      }
    });
  }
  addView(view) {
    this.views.add(view);
  }
  removeView(view) {
    this.views.delete(view);
  }
  updateView(what) {
    this.views.forEach((v) => v.update(what));
  }
  addData(prop, initialData, callback = (value) => value) {
    this.data.set(prop, {
      initialData,
      callback
    });
  }
  deleteData(prop) {
    if (sessionStorage.getItem(prop)) sessionStorage.removeItem(prop);
  }
}
