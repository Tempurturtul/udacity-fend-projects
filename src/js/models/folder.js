// The Folder model.

(function(global) {

  var ko,
      initialized = false;

  global.models = global.models || {};

  global.models.Folder = Folder;

  function init() {
    // It's possible for ko to be undefined on the global scope when this IIFE
    // is initially invoked due to async script loading.
    ko = global.ko;
    initialized = true;
  }

  function Folder(data) {
    if (!initialized) {
      init();
    }

    data = data || {};

    // The name of the folder.
    this.name = ko.observable(data.name || 'New Folder');
    // The folder contents (marker and/or marker folder array).
    this.contents = ko.observableArray(data.contents || []);
    // Whether or not the folder is collapsed.
    this.collapsed = ko.observable(data.collapsed || false);
    // Whether or not the folder's name is being edited.
    this.editing = ko.observable(data.editing || false);
    this.visible = ko.observable(data.visible || true);
  }

})(this);
