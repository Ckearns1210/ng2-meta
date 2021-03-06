var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Inject, Injectable } from '@angular/core';
import { Title, DOCUMENT } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { META_CONFIG } from './meta.module';
var isDefined = function (val) { return typeof val !== 'undefined'; };
var MetaService = (function () {
    function MetaService(router, document, titleService, activatedRoute, metaConfig) {
        var _this = this;
        this.router = router;
        this.document = document;
        this.titleService = titleService;
        this.activatedRoute = activatedRoute;
        this.metaConfig = metaConfig;
        this.router.events
            .filter(function (event) { return (event instanceof NavigationEnd); })
            .map(function () { return (_this.activatedRoute && _this.activatedRoute.firstChild && _this.activatedRoute.firstChild.snapshot && _this.activatedRoute.firstChild.snapshot.data); })
            .subscribe(function (routeData) {
            _this._updateMetaTags(routeData.meta);
        });
    }
    MetaService.prototype._getOrCreateMetaTag = function (name) {
        var el = this.document.querySelector("meta[name='" + name + "']");
        if (!el) {
            el = this.document.createElement('meta');
            el.setAttribute('name', name);
            this.document.head.appendChild(el);
        }
        return el;
    };
    MetaService.prototype._notLoaded = function () {
        return this.url != this.document.location.href;
    };
    MetaService.prototype._updateMetaTags = function (meta) {
        var _this = this;
        if (meta === void 0) { meta = {}; }
        if (meta.disableUpdate) {
            return false;
        }
        if (this._notLoaded()) {
            this.setTitle(meta.title, meta.titleSuffix);
        }
        Object.keys(meta).forEach(function (key) {
            if (key === 'title' || key === 'titleSuffix') {
                return;
            }
            _this.setTag(key, meta[key]);
        });
        if (this._notLoaded()) {
            Object.keys(this.metaConfig.defaults).forEach(function (key) {
                if (key in meta || key === 'title' || key === 'titleSuffix') {
                    return;
                }
                _this.setTag(key, _this.metaConfig.defaults[key]);
            });
        }
    };
    MetaService.prototype.setTitle = function (title, titleSuffix) {
        var titleElement = this._getOrCreateMetaTag('title');
        var ogTitleElement = this._getOrCreateMetaTag('og:title');
        var titleStr = isDefined(title) ? title : (this.metaConfig.defaults['title'] || '');
        if (this.metaConfig.useTitleSuffix) {
            titleStr += isDefined(titleSuffix) ? titleSuffix : (this.metaConfig.defaults['titleSuffix'] || '');
        }
        titleElement.setAttribute('content', titleStr);
        ogTitleElement.setAttribute('content', titleStr);
        this.titleService.setTitle(titleStr);
        this.url = this.document.location.href;
        return this;
    };
    MetaService.prototype.setTag = function (tag, value) {
        if (tag === 'title' || tag === 'titleSuffix') {
            throw new Error("Attempt to set " + tag + " through 'setTag': 'title' and 'titleSuffix' are reserved tag names.\n      Please use 'MetaService.setTitle' instead");
        }
        var tagElement = this._getOrCreateMetaTag(tag);
        var tagStr = isDefined(value) ? value : (this.metaConfig.defaults[tag] || '');
        tagElement.setAttribute('content', tagStr);
        if (tag === 'description') {
            var ogDescElement = this._getOrCreateMetaTag('og:description');
            ogDescElement.setAttribute('content', tagStr);
        }
        this.url = this.document.location.href;
        return this;
    };
    return MetaService;
}());
MetaService = __decorate([
    Injectable(),
    __param(1, Inject(DOCUMENT)),
    __param(4, Inject(META_CONFIG)),
    __metadata("design:paramtypes", [Router, Object, Title, ActivatedRoute, Object])
], MetaService);
export { MetaService };
//# sourceMappingURL=meta.service.js.map