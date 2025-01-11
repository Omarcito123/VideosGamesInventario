import {
  KeepaliveSvc,
  NgIdleModule,
  provideNgIdle
} from "./chunk-XHJHQHNV.js";
import {
  HttpClient,
  HttpRequest
} from "./chunk-OSHGFHNC.js";
import "./chunk-DAF7ROK4.js";
import {
  EventEmitter,
  Injectable,
  NgModule,
  NgZone,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵinject
} from "./chunk-BK6BCIRT.js";
import "./chunk-4U7WSKDA.js";
import "./chunk-6G7OXC26.js";
import "./chunk-DMOH4HQ5.js";
import "./chunk-J4B6MK7R.js";

// ../../../node_modules/@ng-idle/keepalive/fesm2022/ng-idle-keepalive.mjs
var Keepalive = class _Keepalive extends KeepaliveSvc {
  /*
   * Initializes a new instance of Keepalive
   * @param http - The HTTP service.
   */
  constructor(http, zone) {
    super();
    this.http = http;
    this.zone = zone;
    this.pingInterval = 10 * 60;
    this.onPing = new EventEmitter();
    this.onPingResponse = new EventEmitter();
  }
  /*
   * Sets the string or Request that should be used when pinging.
   * @param url - The URL or Request object to use when pinging.
   * @return The current Request used when pinging.
   */
  request(url) {
    if (typeof url === "string") {
      this.pingRequest = new HttpRequest("GET", url);
    } else if (url instanceof HttpRequest) {
      this.pingRequest = url;
    } else if (url === null) {
      this.pingRequest = null;
    }
    return this.pingRequest;
  }
  /*
   * Sets the interval (in seconds) at which the ping operation will occur when start() is called.
   * @param seconds - The ping interval in seconds.
   * @return The current interval value.
   */
  interval(seconds) {
    if (!isNaN(seconds) && seconds > 0) {
      this.pingInterval = seconds;
    } else if (!isNaN(seconds) && seconds <= 0) {
      throw new Error("Interval value must be greater than zero.");
    }
    return this.pingInterval;
  }
  /*
   * Immediately performs the ping operation. If a request has been set, an HTTP
   * request will be made and the response will be emitted via the
   * onPingResponse event.
   */
  ping() {
    this.onPing.emit(null);
    if (this.pingRequest) {
      this.http.request(this.pingRequest).subscribe((response) => {
        this.onPingResponse.emit(response);
      }, (error) => {
        this.onPingResponse.emit(error);
      });
    }
  }
  /*
   * Starts pinging on an interval.
   */
  start() {
    this.stop();
    this.zone.runOutsideAngular(() => {
      this.pingHandle = setInterval(() => {
        this.zone.run(() => {
          this.ping();
        });
      }, this.pingInterval * 1e3);
    });
  }
  /*
   * Stops pinging on an interval.
   */
  stop() {
    if (this.hasPingHandle()) {
      clearInterval(this.pingHandle);
      this.pingHandle = null;
    }
  }
  /*
   * Performs any cleanup tasks when Angular destroys the instance.
   */
  ngOnDestroy() {
    this.stop();
  }
  /*
   * Returns whether or not the service will ping automatically at the specified interval.
   * @return True if the service will ping at the specified interval; otherwise, false.
   */
  isRunning() {
    return this.hasPingHandle();
  }
  hasPingHandle() {
    return this.pingHandle !== null && typeof this.pingHandle !== "undefined";
  }
  static {
    this.ɵfac = function Keepalive_Factory(t) {
      return new (t || _Keepalive)(ɵɵinject(HttpClient), ɵɵinject(NgZone));
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _Keepalive,
      factory: _Keepalive.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Keepalive, [{
    type: Injectable
  }], () => [{
    type: HttpClient
  }, {
    type: NgZone
  }], null);
})();
function provideNgIdleKeepalive() {
  return [provideNgIdle(), Keepalive, {
    provide: KeepaliveSvc,
    useExisting: Keepalive
  }];
}
var NgIdleKeepaliveModule = class _NgIdleKeepaliveModule {
  static forRoot() {
    return {
      ngModule: _NgIdleKeepaliveModule,
      providers: [Keepalive, {
        provide: KeepaliveSvc,
        useExisting: Keepalive
      }]
    };
  }
  static {
    this.ɵfac = function NgIdleKeepaliveModule_Factory(t) {
      return new (t || _NgIdleKeepaliveModule)();
    };
  }
  static {
    this.ɵmod = ɵɵdefineNgModule({
      type: _NgIdleKeepaliveModule,
      imports: [NgIdleModule]
    });
  }
  static {
    this.ɵinj = ɵɵdefineInjector({
      imports: [NgIdleModule.forRoot()]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgIdleKeepaliveModule, [{
    type: NgModule,
    args: [{
      imports: [NgIdleModule.forRoot()]
    }]
  }], null, null);
})();
export {
  Keepalive,
  NgIdleKeepaliveModule,
  provideNgIdleKeepalive
};
//# sourceMappingURL=@ng-idle_keepalive.js.map
