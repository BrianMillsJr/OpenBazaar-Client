var __ = require('underscore'),
    Backbone = require('backbone'),
    $ = require('jquery'),
    is = require('is_js'),
    loadTemplate = require('../utils/loadTemplate'),
    saveToAPI = require('../utils/saveToAPI'),
    orderModel = require('../models/orderMd');

module.exports = Backbone.View.extend({

  className: "modal modal-opaque js-transactionModal",

  events: {
    'click .js-transactionModal': 'blockClicks',
    'click .js-closeModal': 'closeModal'
  },

  initialize: function (options) {
    "use strict";
    var self = this;

    this.orderID = options.orderID;
    this.serverUrl = options.serverUrl;
    this.parentEl = options.parentEl;
    this.countriesArray = options.countriesArray;
    this.cCode = options.cCode;
    this.btAve = options.btAve; //average price in bitcoin for one unit of the user's currency

    this.model = new orderModel({cCode: this.cCode, btAve: this.btAve, serverUrl: this.serverUrl});
    this.model.urlRoot = options.serverUrl + "get_order"; //replace with real API call when ready
    this.listenTo(this.model, 'change:displayTotalPrice', function(){this.render();});
    this.model.fetch({
      data: $.param({'order_id': self.orderID})
    });
  },

  render: function () {
    "use strict";
    var self = this;

    loadTemplate('./js/templates/transactionModal.html', function(loadedTemplate) {
      //hide the modal when it first loads
      self.parentEl.html(self.$el);
      console.log(self.model.toJSON());
      self.$el.html(loadedTemplate(self.model.toJSON()));
      self.$el.parent().fadeIn(300);
    });
  },

  blockClicks: function(e) {
    "use strict";
    e.stopPropagation();
  },

  closeModal: function(){
    this.$el.parent().fadeOut(300);
  },

  close: function(){
    "use strict";
    __.each(this.subModels, function(subModel) {
      subModel.off();
    });
    __.each(this.subViews, function(subView) {
      if(subView.close){
        subView.close();
      }else{
        subView.unbind();
        subView.remove();
      }
    });

    this.model.off();
    this.off();
    this.remove();
  }
});