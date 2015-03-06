/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console, setTimeout */
/*mendix */
/*
    HammerSwipe
    ========================

    @file      : HammerSwipe.js
    @version   : 1.0
    @author    : Marcus Groen
    @date      : Wed, 04 Mar 2015 10:54:56 GMT
    @copyright : Incentro
    @license   : Apache 2

    Documentation
    ========================
    Swipe a DOM element left or right to trigger a microflow.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
require({
    packages: [
        { name: 'hammer', location: '../../widgets/HammerSwipe/lib', main: 'hammer.min' }
              ]
}, [
    'dojo/_base/declare', 'mxui/widget/_WidgetBase',
    'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-prop', 'dojo/dom-geometry', 'dojo/dom-class',
    'dojo/dom-style', 'dojo/dom-construct', 'dojo/_base/array', 'dojo/_base/lang', 'dojo/text',
    'hammer', 'dojo/_base/fx'
], function (declare, _WidgetBase,
              dom, dojoDom, domQuery, domProp, domGeom, domClass,
              domStyle, domConstruct, dojoArray, lang, text,
              Hammer, baseFx) {
    'use strict';
    
    // Declare widget's prototype.
    return declare('HammerSwipe.widget.HammerSwipe', [ _WidgetBase ], {

        // Parameters configured in the Modeler.
        dojoQuery: "",
        swipeAnimation: "",
        leftMicroflow: "",
        rightMicroflow: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handle: null,
        _contextObj: null,
        _objProperty: null,
        _hammerElement: null,
        _leftHammer: null,
        _rightHammer: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            this._objProperty = {};
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            console.log(this.id + '.postCreate');
            
            /* this.domNode.appendChild(dom.create('span', { 'class': 'HammerSwipe-message' }, this.messageString)); */

            this._setupEvents();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            console.log(this.id + '.update');

            /* this._contextObj = obj;
            this._resetSubscriptions();
            this._updateRendering(); */

            callback();
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function () {

        },

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function () {

        },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function (box) {

        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        _setupEvents: function () {
            
            // Get target DOM node.
            this._hammerElement = domQuery(this.dojoQuery)[0];
            if (this._hammerElement) {
                // Set swipe events.
                if (this.leftMicroflow) {
                    this._leftHammer = new Hammer(this._hammerElement).on('swipeleft', lang.hitch(this,function(ev) {
                        //console.log(ev);
                        if (this.swipeAnimation && this.swipeAnimation === true) {
                            domStyle.set(this._hammerElement, 'position', 'relative');
                            baseFx.animateProperty({ node: this._hammerElement,
                                                     properties: {
                                                       left: { start: '0', end: '-'+domGeom.position(this._hammerElement).w.toString() }
                                                       /*,opacity: { start: 1, end: 0.5 }*/
                                                     },
                                                     duration: 800
                                               }).play();
                            setTimeout(lang.hitch(this,function(){
                                mx.ui.action(this.leftMicroflow);
                            }), 800);
                        } else {
                            mx.ui.action(this.leftMicroflow);
                        }
                    }));
                }
                if (this.rightMicroflow) {
                    this._rightHammer = new Hammer(this._hammerElement).on('swiperight', lang.hitch(this,function(ev) {
                        //console.log(ev);
                        if (this.swipeAnimation && this.swipeAnimation === true) {
                            domStyle.set(this._hammerElement, 'position', 'relative');
                            baseFx.animateProperty({ node: this._hammerElement,
                                                     properties: {
                                                       left: { start: '0', end: domGeom.position(this._hammerElement).w.toString() }
                                                       /*,opacity: { start: 1, end: 0.5 }*/
                                                     },
                                                     duration: 800
                                               }).play();
                            setTimeout(lang.hitch(this,function(){
                                mx.ui.action(this.rightMicroflow);
                            }), 800);
                        } else {
                            mx.ui.action(this.rightMicroflow);
                        }
                    }));
                }
            }
            
        },

        _updateRendering: function () {
            
            /* this.domNode.style.backgroundColor = this._contextObj ? this._contextObj.get(this.backgroundColor) : ""; */
            
        },

        _resetSubscriptions: function () {
            // Release handle on previous object, if any.
            if (this._handle) {
                this.unsubscribe(this._handle);
                this._handle = null;
            }

            if (this._contextObj) {
                this._handle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: this._updateRendering
                });
            }
            
            // Destroy swipe events
            if (this._leftHammer) {
                this._leftHammer.destroy();
            }
            
            if (this._rightHammer) {
                this._rightHammer.destroy();
            }
        }
    });
});
