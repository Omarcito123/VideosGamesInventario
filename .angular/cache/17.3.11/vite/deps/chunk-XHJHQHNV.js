import {
  isPlatformServer
} from "./chunk-DAF7ROK4.js";
import {
  EventEmitter,
  Inject,
  Injectable,
  NgModule,
  NgZone,
  Optional,
  PLATFORM_ID,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵinject
} from "./chunk-BK6BCIRT.js";
import {
  fromEvent,
  merge
} from "./chunk-6G7OXC26.js";
import {
  Subscription,
  filter,
  throttleTime
} from "./chunk-DMOH4HQ5.js";

// ../../../node_modules/@ng-idle/core/fesm2022/ng-idle-core.mjs
var Interrupt = class {
  constructor(source, options) {
    this.source = source;
    if (source.initialize) {
      source.initialize(options);
    }
  }
  /*
   * Subscribes to the interrupt using the specified function.
   * @param fn - The subscription function.
   */
  subscribe(fn) {
    this.sub = this.source.onInterrupt.subscribe(fn);
  }
  /*
   * Unsubscribes the interrupt.
   */
  unsubscribe() {
    this.sub.unsubscribe();
    this.sub = null;
  }
  /*
   * Keeps the subscription but resumes interrupt events.
   */
  resume() {
    this.source.attach();
  }
  /*
   * Keeps the subscription but pauses interrupt events.
   */
  pause() {
    this.source.detach();
  }
};
var IdleExpiry = class {
  constructor() {
    this.idValue = /* @__PURE__ */ new Date();
    this.idlingValue = false;
  }
  /*
   * Gets or sets a unique ID for the window
   * @param id - The id.
   * @return The current id.
   */
  id(value) {
    if (value !== void 0) {
      if (!value) {
        throw new Error("A value must be specified for the ID.");
      }
      this.idValue = value;
    }
    return this.idValue;
  }
  /*
   * Gets or sets the idling value.
   * @param value - The value to set.
   * @return The idling value.
   */
  idling(value) {
    if (value !== void 0) {
      this.idlingValue = value;
    }
    return this.idlingValue;
  }
  /*
   * Returns the current Date.
   * @return The current Date.
   */
  now() {
    return /* @__PURE__ */ new Date();
  }
  /*
   * Returns whether or not it is expired.
   * @return True if expired; otherwise, false.
   */
  isExpired() {
    const expiry = this.last();
    return expiry != null && expiry <= this.now();
  }
};
var AlternativeStorage = class {
  constructor() {
    this.storageMap = {};
  }
  /*
   * Returns an integer representing the number of data items stored in the storageMap object.
   */
  get length() {
    return Object.keys(this.storageMap).length;
  }
  /*
   * Remove all keys out of the storage.
   */
  clear() {
    this.storageMap = {};
  }
  /*
   * Return the key's value
   *
   * @param key - name of the key to retrieve the value of.
   * @return The key's value
   */
  getItem(key) {
    if (typeof this.storageMap[key] !== "undefined") {
      return this.storageMap[key];
    }
    return null;
  }
  /*
   * Return the nth key in the storage
   *
   * @param index - the number of the key you want to get the name of.
   * @return The name of the key.
   */
  key(index) {
    return Object.keys(this.storageMap)[index] || null;
  }
  /*
   * Remove a key from the storage.
   *
   * @param key - the name of the key you want to remove.
   */
  removeItem(key) {
    this.storageMap[key] = void 0;
  }
  /*
   * Add a key to the storage, or update a key's value if it already exists.
   *
   * @param key - the name of the key.
   * @param value - the value you want to give to the key.
   */
  setItem(key, value) {
    this.storageMap[key] = value;
  }
};
var LocalStorage = class _LocalStorage {
  constructor() {
    this.storage = this.getStorage();
  }
  /*
   * Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem
   * throw QuotaExceededError. We're going to detect this and just silently drop any calls to
   * setItem
   * to avoid the entire page breaking, without having to do a check at each usage of Storage.
   */
  getStorage() {
    try {
      const storage = localStorage;
      storage.setItem("ng2IdleStorage", "");
      storage.removeItem("ng2IdleStorage");
      return storage;
    } catch (err) {
      return new AlternativeStorage();
    }
  }
  /*
   * Gets an item in the storage.
   *
   * @param value - The value to get.
   * @return The current value.
   */
  getItem(key) {
    return this.storage.getItem("ng2Idle." + key);
  }
  /*
   * Removes an item in the storage.
   *
   * @param value - The value to remove.
   */
  removeItem(key) {
    this.storage.removeItem("ng2Idle." + key);
  }
  /*
   * Sets an item in the storage.
   *
   * @param key - The key to set the value.
   * @param value - The value to set to the key.
   */
  setItem(key, data) {
    this.storage.setItem("ng2Idle." + key, data);
  }
  /*
   * Represents the storage, commonly use for testing purposes.
   *
   * @param key - The key to set the value.
   * @param value - The value to set to the key.
   */
  _wrapped() {
    return this.storage;
  }
  static {
    this.ɵfac = function LocalStorage_Factory(t) {
      return new (t || _LocalStorage)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _LocalStorage,
      factory: _LocalStorage.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocalStorage, [{
    type: Injectable
  }], () => [], null);
})();
var LocalStorageExpiry = class _LocalStorageExpiry extends IdleExpiry {
  constructor(localStorage2) {
    super();
    this.localStorage = localStorage2;
    this.idleName = "main";
  }
  /*
   * Gets or sets the last expiry date in localStorage.
   * If localStorage doesn't work correctly (i.e. Safari in private mode), we store the expiry value in memory.
   * @param value - The expiry value to set; omit to only return the value.
   * @return The current expiry value.
   */
  last(value) {
    if (value !== void 0) {
      this.setExpiry(value);
    }
    return this.getExpiry();
  }
  idling(value) {
    if (value !== void 0) {
      this.setIdling(value);
    }
    return this.getIdling();
  }
  /*
   * Gets the idle name.
   * @return The name of the idle.
   */
  getIdleName() {
    return this.idleName;
  }
  /*
   * Sets the idle name.
   * @param The name of the idle.
   */
  setIdleName(key) {
    if (key) {
      this.idleName = key;
    }
  }
  getExpiry() {
    const expiry = this.localStorage.getItem(this.idleName + ".expiry");
    if (expiry) {
      return new Date(parseInt(expiry, 10));
    } else {
      return null;
    }
  }
  setExpiry(value) {
    if (value) {
      this.localStorage.setItem(this.idleName + ".expiry", value.getTime().toString());
    } else {
      this.localStorage.removeItem(this.idleName + ".expiry");
    }
  }
  getIdling() {
    const idling = this.localStorage.getItem(this.idleName + ".idling");
    if (idling) {
      return idling === "true";
    } else {
      return false;
    }
  }
  setIdling(value) {
    if (value) {
      this.localStorage.setItem(this.idleName + ".idling", value.toString());
    } else {
      this.localStorage.setItem(this.idleName + ".idling", "false");
    }
  }
  static {
    this.ɵfac = function LocalStorageExpiry_Factory(t) {
      return new (t || _LocalStorageExpiry)(ɵɵinject(LocalStorage));
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _LocalStorageExpiry,
      factory: _LocalStorageExpiry.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocalStorageExpiry, [{
    type: Injectable
  }], () => [{
    type: LocalStorage
  }], null);
})();
var KeepaliveSvc = class {
};
var AutoResume;
(function(AutoResume2) {
  AutoResume2[AutoResume2["disabled"] = 0] = "disabled";
  AutoResume2[AutoResume2["idle"] = 1] = "idle";
  AutoResume2[AutoResume2["notIdle"] = 2] = "notIdle";
})(AutoResume || (AutoResume = {}));
var Idle = class _Idle {
  constructor(expiry, zone, keepaliveSvc, platformId) {
    this.expiry = expiry;
    this.zone = zone;
    this.platformId = platformId;
    this.idle = 20 * 60;
    this.timeoutVal = 30;
    this.autoResume = AutoResume.idle;
    this.interrupts = new Array();
    this.running = false;
    this.keepaliveEnabled = false;
    this.onIdleStart = new EventEmitter();
    this.onIdleEnd = new EventEmitter();
    this.onTimeoutWarning = new EventEmitter();
    this.onTimeout = new EventEmitter();
    this.onInterrupt = new EventEmitter();
    if (keepaliveSvc) {
      this.keepaliveSvc = keepaliveSvc;
      this.keepaliveEnabled = true;
    }
    this.setIdling(false);
  }
  /*
   * Sets the idle name for localStorage.
   * Important to set if multiple instances of Idle with LocalStorageExpiry
   * @param The name of the idle.
   */
  setIdleName(key) {
    if (this.expiry instanceof LocalStorageExpiry) {
      this.expiry.setIdleName(key);
    } else {
      throw new Error("Cannot set expiry key name because no LocalStorageExpiry has been provided.");
    }
  }
  /*
   * Returns whether or not keepalive integration is enabled.
   * @return True if integration is enabled; otherwise, false.
   */
  getKeepaliveEnabled() {
    return this.keepaliveEnabled;
  }
  /*
   * Sets and returns whether or not keepalive integration is enabled.
   * @param True if the integration is enabled; otherwise, false.
   * @return The current value.
   */
  setKeepaliveEnabled(value) {
    if (!this.keepaliveSvc) {
      throw new Error("Cannot enable keepalive integration because no KeepaliveSvc has been provided.");
    }
    return this.keepaliveEnabled = value;
  }
  /*
   * Returns the current timeout value.
   * @return The timeout value in seconds.
   */
  getTimeout() {
    return this.timeoutVal;
  }
  /*
   * Sets the timeout value.
   * @param seconds - The timeout value in seconds. 0 or false to disable timeout feature.
   * @return The current value. If disabled, the value will be 0.
   */
  setTimeout(seconds) {
    if (seconds === false) {
      this.timeoutVal = 0;
    } else if (typeof seconds === "number" && seconds >= 0) {
      this.timeoutVal = seconds;
    } else {
      throw new Error("'seconds' can only be 'false' or a positive number.");
    }
    return this.timeoutVal;
  }
  /*
   * Returns the current idle value.
   * @return The idle value in seconds.
   */
  getIdle() {
    return this.idle;
  }
  /*
   * Sets the idle value.
   * @param seconds - The idle value in seconds.
   * @return The idle value in seconds.
   */
  setIdle(seconds) {
    if (seconds <= 0) {
      throw new Error("'seconds' must be greater zero");
    }
    return this.idle = seconds;
  }
  /*
   * Returns the current autoresume value.
   * @return The current value.
   */
  getAutoResume() {
    return this.autoResume;
  }
  setAutoResume(value) {
    return this.autoResume = value;
  }
  /*
   * Sets interrupts from the specified sources.
   * @param sources - Interrupt sources.
   * @return The resulting interrupts.
   */
  setInterrupts(sources) {
    this.clearInterrupts();
    const self = this;
    for (const source of sources) {
      const options = {
        platformId: this.platformId
      };
      const sub = new Interrupt(source, options);
      sub.subscribe((args) => {
        self.interrupt(args.force, args.innerArgs);
      });
      this.interrupts.push(sub);
    }
    return this.interrupts;
  }
  /*
   * Returns the current interrupts.
   * @return The current interrupts.
   */
  getInterrupts() {
    return this.interrupts;
  }
  /*
   * Pauses, unsubscribes, and clears the current interrupt subscriptions.
   */
  clearInterrupts() {
    for (const sub of this.interrupts) {
      sub.pause();
      sub.unsubscribe();
    }
    this.interrupts.length = 0;
  }
  /*
   * Returns whether or not the service is running i.e. watching for idleness.
   * @return True if service is watching; otherwise, false.
   */
  isRunning() {
    return this.running;
  }
  /*
   * Returns whether or not the user is considered idle.
   * @return True if the user is in the idle state; otherwise, false.
   */
  isIdling() {
    return this.idling;
  }
  /*
   * Starts watching for inactivity.
   */
  watch(skipExpiry) {
    this.safeClearInterval("idleHandle");
    this.safeClearInterval("timeoutHandle");
    const timeout = !this.timeoutVal ? 0 : this.timeoutVal;
    if (!skipExpiry) {
      const value = new Date(this.expiry.now().getTime() + (this.idle + timeout) * 1e3);
      this.expiry.last(value);
    }
    if (this.idling) {
      this.toggleState();
    }
    if (!this.running) {
      this.startKeepalive();
      this.toggleInterrupts(true);
    }
    this.running = true;
    const watchFn = () => {
      this.zone.run(() => {
        const diff = this.getExpiryDiff(timeout);
        if (diff > 0) {
          this.safeClearInterval("idleHandle");
          this.setIdleIntervalOutsideOfZone(watchFn, 1e3);
        } else {
          this.toggleState();
        }
      });
    };
    this.setIdleIntervalOutsideOfZone(watchFn, 1e3);
  }
  /*
   * Allows protractor tests to call waitForAngular without hanging
   */
  setIdleIntervalOutsideOfZone(watchFn, frequency) {
    this.zone.runOutsideAngular(() => {
      this.idleHandle = setInterval(watchFn, frequency);
    });
  }
  /*
   * Stops watching for inactivity.
   */
  stop() {
    this.stopKeepalive();
    this.toggleInterrupts(false);
    this.safeClearInterval("idleHandle");
    this.safeClearInterval("timeoutHandle");
    this.setIdling(false);
    this.running = false;
    this.expiry.last(null);
  }
  /*
   * Forces a timeout event and state.
   */
  timeout() {
    this.stopKeepalive();
    this.toggleInterrupts(false);
    this.safeClearInterval("idleHandle");
    this.safeClearInterval("timeoutHandle");
    this.setIdling(true);
    this.running = false;
    this.countdown = 0;
    this.onTimeout.emit(null);
  }
  /*
   * Signals that user activity has occurred.
   * @param force - Forces watch to be called, unless they are timed out.
   * @param eventArgs - Optional source event arguments.
   */
  interrupt(force, eventArgs) {
    if (!this.running) {
      return;
    }
    if (this.timeoutVal && this.expiry.isExpired()) {
      this.timeout();
      return;
    }
    this.onInterrupt.emit(eventArgs);
    if (force === true || this.autoResume === AutoResume.idle || this.autoResume === AutoResume.notIdle && !this.expiry.idling()) {
      this.watch(force);
    }
  }
  setIdling(value) {
    this.idling = value;
    this.expiry.idling(value);
  }
  toggleState() {
    this.setIdling(!this.idling);
    if (this.idling) {
      this.onIdleStart.emit(null);
      this.stopKeepalive();
      if (this.timeoutVal > 0) {
        this.countdown = this.timeoutVal;
        this.doCountdown();
        this.setTimeoutIntervalOutsideZone(() => {
          this.doCountdownInZone();
        }, 1e3);
      }
    } else {
      this.toggleInterrupts(true);
      this.onIdleEnd.emit(null);
      this.startKeepalive();
    }
    this.safeClearInterval("idleHandle");
  }
  setTimeoutIntervalOutsideZone(intervalFn, frequency) {
    this.zone.runOutsideAngular(() => {
      this.timeoutHandle = setInterval(() => {
        intervalFn();
      }, frequency);
    });
  }
  toggleInterrupts(resume) {
    for (const interrupt of this.interrupts) {
      if (resume) {
        interrupt.resume();
      } else {
        interrupt.pause();
      }
    }
  }
  getExpiryDiff(timeout) {
    const now = this.expiry.now();
    const last = this.expiry.last() || now;
    return last.getTime() - now.getTime() - timeout * 1e3;
  }
  doCountdownInZone() {
    this.zone.run(() => {
      this.doCountdown();
    });
  }
  doCountdown() {
    const diff = this.getExpiryDiff(this.timeoutVal);
    if (diff > 0) {
      this.safeClearInterval("timeoutHandle");
      this.interrupt(true);
      return;
    }
    if (!this.idling) {
      return;
    }
    if (this.countdown <= 0) {
      this.timeout();
      return;
    }
    this.onTimeoutWarning.emit(this.countdown);
    const countdownMs = (this.timeoutVal - 1) * 1e3 + diff;
    this.countdown = Math.round(countdownMs / 1e3);
  }
  safeClearInterval(handleName) {
    const handle = this[handleName];
    if (handle !== null && typeof handle !== "undefined") {
      clearInterval(this[handleName]);
      this[handleName] = null;
    }
  }
  startKeepalive() {
    if (!this.keepaliveSvc || !this.keepaliveEnabled) {
      return;
    }
    if (this.running) {
      this.keepaliveSvc.ping();
    }
    this.keepaliveSvc.start();
  }
  stopKeepalive() {
    if (!this.keepaliveSvc || !this.keepaliveEnabled) {
      return;
    }
    this.keepaliveSvc.stop();
  }
  /*
   * Called by Angular when destroying the instance.
   */
  ngOnDestroy() {
    this.stop();
    this.clearInterrupts();
  }
  static {
    this.ɵfac = function Idle_Factory(t) {
      return new (t || _Idle)(ɵɵinject(IdleExpiry), ɵɵinject(NgZone), ɵɵinject(KeepaliveSvc, 8), ɵɵinject(PLATFORM_ID, 8));
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _Idle,
      factory: _Idle.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Idle, [{
    type: Injectable
  }], () => [{
    type: IdleExpiry
  }, {
    type: NgZone
  }, {
    type: KeepaliveSvc,
    decorators: [{
      type: Optional
    }]
  }, {
    type: Object,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }], null);
})();
var InterruptArgs = class {
  constructor(source, innerArgs, force = false) {
    this.source = source;
    this.innerArgs = innerArgs;
    this.force = force;
  }
};
var InterruptSource = class {
  constructor(attachFn, detachFn) {
    this.attachFn = attachFn;
    this.detachFn = detachFn;
    this.isAttached = false;
    this.onInterrupt = new EventEmitter();
  }
  /*
   * Attaches to the specified events on the specified source.
   */
  attach() {
    if (Zone.current.get("isAngularZone") === true) {
      Zone.current.parent.run(() => this.attach());
      return;
    }
    if (!this.isAttached && this.attachFn) {
      this.attachFn(this);
    }
    this.isAttached = true;
  }
  /*
   * Detaches from the specified events on the specified source.
   */
  detach() {
    if (this.isAttached && this.detachFn) {
      this.detachFn(this);
    }
    this.isAttached = false;
  }
};
var defaultThrottleDelay = 500;
var EventTargetInterruptSource = class extends InterruptSource {
  constructor(target, events, opts) {
    super(null, null);
    this.target = target;
    this.events = events;
    this.opts = opts;
    this.eventSubscription = new Subscription();
    if (typeof this.opts === "number") {
      this.opts = {
        throttleDelay: this.opts,
        passive: false
      };
    }
    this.opts = this.opts || {
      passive: false,
      throttleDelay: defaultThrottleDelay
    };
    if (this.opts.throttleDelay === void 0 || this.opts.throttleDelay === null) {
      this.opts.throttleDelay = defaultThrottleDelay;
    }
    this.throttleDelay = this.opts.throttleDelay;
    this.passive = !!this.opts.passive;
  }
  initialize(options) {
    if (options?.platformId && isPlatformServer(options.platformId)) {
      return;
    }
    const eventTarget = typeof this.target === "function" ? this.target() : this.target;
    const opts = this.passive ? {
      passive: true
    } : null;
    const fromEvents = this.events.split(" ").map((eventName) => fromEvent(eventTarget, eventName, opts));
    this.eventSrc = merge(...fromEvents);
    this.eventSrc = this.eventSrc.pipe(filter((innerArgs) => !this.filterEvent(innerArgs)));
    if (this.throttleDelay > 0) {
      this.eventSrc = this.eventSrc.pipe(throttleTime(this.throttleDelay));
    }
    const handler = (innerArgs) => this.onInterrupt.emit(new InterruptArgs(this, innerArgs));
    this.attachFn = () => this.eventSubscription = this.eventSrc.subscribe(handler);
    this.detachFn = () => this.eventSubscription.unsubscribe();
  }
  /*
   * Checks to see if the event should be filtered. Always returns false unless overriden.
   * @param event - The original event object.
   * @return True if the event should be filtered (don't cause an interrupt); otherwise, false.
   */
  filterEvent(event) {
    return false;
  }
  /**
   * Returns the current options being used.
   * @return The current option values.
   */
  get options() {
    return {
      passive: this.passive,
      throttleDelay: this.throttleDelay
    };
  }
};
var DocumentInterruptSource = class extends EventTargetInterruptSource {
  constructor(events, options) {
    super(() => document.documentElement, events, options);
  }
  /*
   * Checks to see if the event should be filtered.
   * @param event - The original event object.
   * @return True if the event should be filtered (don't cause an interrupt); otherwise, false.
   */
  filterEvent(event) {
    if (event.type === "mousemove" && // fix for Chrome destop notifications
    (event.originalEvent && event.originalEvent.movementX === 0 && event.originalEvent.movementY === 0 || // fix for webkit fake mousemove
    event.movementX !== void 0 && !event.movementX || !event.movementY)) {
      return true;
    }
    return false;
  }
};
var WindowInterruptSource = class extends EventTargetInterruptSource {
  constructor(events, options) {
    super(() => window, events, options);
  }
};
var StorageInterruptSource = class extends WindowInterruptSource {
  constructor(options = 500) {
    super("storage", options);
  }
  /*
   * Checks to see if the event should be filtered.
   * @param event - The original event object.
   * @return True if the event should be filtered (don't cause an interrupt); otherwise, false.
   */
  filterEvent(event) {
    if (event.key && event.key.indexOf("ng2Idle.") >= 0 && event.key.indexOf(".expiry") >= 0) {
      return false;
    }
    return true;
  }
};
var SimpleExpiry = class extends IdleExpiry {
  constructor() {
    super();
    this.lastValue = null;
  }
  /*
   * Gets or sets the last expiry date.
   * @param value - The expiry value to set; omit to only return the value.
   * @return The current expiry value.
   */
  last(value) {
    if (value !== void 0) {
      this.lastValue = value;
    }
    return this.lastValue;
  }
};
function provideNgIdle() {
  return [LocalStorage, LocalStorageExpiry, Idle, {
    provide: IdleExpiry,
    useExisting: LocalStorageExpiry
  }];
}
var NgIdleModule = class _NgIdleModule {
  static forRoot() {
    return {
      ngModule: _NgIdleModule,
      providers: [LocalStorageExpiry, {
        provide: IdleExpiry,
        useExisting: LocalStorageExpiry
      }, Idle]
    };
  }
  static {
    this.ɵfac = function NgIdleModule_Factory(t) {
      return new (t || _NgIdleModule)();
    };
  }
  static {
    this.ɵmod = ɵɵdefineNgModule({
      type: _NgIdleModule
    });
  }
  static {
    this.ɵinj = ɵɵdefineInjector({
      providers: [LocalStorage]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgIdleModule, [{
    type: NgModule,
    args: [{
      providers: [LocalStorage]
    }]
  }], null, null);
})();
function createDefaultInterruptSources(options) {
  return [new DocumentInterruptSource("mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll", options), new StorageInterruptSource(options)];
}
var DEFAULT_INTERRUPTSOURCES = createDefaultInterruptSources();

export {
  IdleExpiry,
  LocalStorage,
  LocalStorageExpiry,
  KeepaliveSvc,
  AutoResume,
  Idle,
  InterruptArgs,
  InterruptSource,
  EventTargetInterruptSource,
  DocumentInterruptSource,
  WindowInterruptSource,
  StorageInterruptSource,
  SimpleExpiry,
  provideNgIdle,
  NgIdleModule,
  createDefaultInterruptSources,
  DEFAULT_INTERRUPTSOURCES
};
//# sourceMappingURL=chunk-XHJHQHNV.js.map
