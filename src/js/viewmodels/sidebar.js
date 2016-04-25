// The Sidebar View Model.

(function(global) {

  global.viewmodels = global.viewmodels || {};

  global.viewmodels.Sidebar = Sidebar;

  function Sidebar(mainViewModel) {
    var self = this,
        document = global.document,
        window = global.window,
        util = global.util,
        map = global.map,
        ko = global.ko,
        models = global.models,
        resizeListener,       // Used by handleMapResizing.
        resizeSubscription;   // Used by handleMapResizing.

    self.addFolder = function(formElem) {
      mainViewModel.markers.push(new models.Folder({name: self.newFolderName()}));

      // Reset new folder name.
      self.newFolderName('');

      // Save changes.
      mainViewModel.saveMarkers();
    };

    self.centerOnContents = function(folder) {
      var markerIDs = mainViewModel.getAllMarkers(folder.contents())
                        .map(function(marker) {
                          return marker.id();
                        });

      if (markerIDs.length) {
        if (!self.stayOpen()) {
          self.expanded(false);
        }
        map.centerOn(markerIDs);
      }
    };

    self.confirmFolderRemoval = function(folder) {
      var msg = '<p>Are you sure you want to remove the <i>' + folder.name().replace(/</g, '&lt;') + '</i> folder?</p>',
          inputs = '<label><input type="checkbox" value="removeContents"> Also remove the folder\'s contents.</label>';

      util.fullpageForm(msg, inputs, confirm);

      function confirm(inputData) {
        var removeContents = inputData[0].checked;

        removeFolder(folder, removeContents);

        // Save changes.
        mainViewModel.saveMarkers();
      }
    };

    self.dragStart = function(dragData, event) {
      var insideDragHandle = getClosest(event.target, '.drag-handle') !== null;
      if (insideDragHandle) {

        // If trying to drag a folder, make sure it's collapsed.
        if (dragData.item instanceof models.Folder && !dragData.item.collapsed()) {
          self.toggleFolder(dragData.item);
        }

        return true;
      } else {
        return false;
      }
    };

    self.expanded = ko.observable(false);

    self.newFolderName = ko.observable('');

    self.reorder = function(event, dragData, zoneData) {
      // If the item isn't being dragged over itself...
      if (dragData.item !== zoneData.item) {
        // If the other item is an expanded empty folder...
        if (zoneData.item instanceof models.Folder && !zoneData.item.contents().length && !zoneData.item.collapsed()) {
          // Place the dragged item inside it.
          place();
        } else {
          // Move the dragged item to its position.
          move();
        }
      }

      /**
       * Moves the dragged item to the new position.
       */
      function move() {
        var index = zoneData.items.indexOf(zoneData.item);
        dragData.items.remove(dragData.item);
        zoneData.items.splice(index, 0, dragData.item);
        dragData.items = zoneData.items;

        // Save changes.
        mainViewModel.saveMarkers();
      }

      /**
       * Places the dragged item inside a folder.
       */
      function place() {
        dragData.items.remove(dragData.item);
        zoneData.item.contents.push(dragData.item);
        dragData.items = zoneData.item.contents;

        // Save changes.
        mainViewModel.saveMarkers();
      }
    };

    // Filter markers by title.
    self.search = ko.observable('');

    // True or false depending on inner window width.
    self.stayOpen = ko.observable(false);

    self.toggle = function() {
      self.expanded(!self.expanded());
    };

    self.toggleFolder = function(folder) {
      // Toggle collapsed state.
      folder.collapsed(!folder.collapsed());

      // Update the visibility of all contents.
      if (folder.collapsed()) {
        self.updateVisibility(folder.contents(), false);
      } else {
        self.updateVisibility(folder.contents());
      }

      // Save changes.
      mainViewModel.saveMarkers();
    };

    self.toggleFolderEditing = function(folderOrFormElem) {
      this.editing(!this.editing());

      if (!this.editing()) {
        // Save changes.
        mainViewModel.saveMarkers();
      }
    };

    // Updates the visibility of all folders and markers. If visible is defined, uses its value.
    self.updateVisibility = function(arr, visible) {
      var search = self.search().toLowerCase(),
          visibleOnly = self.visibleOnly();

      // If no array is provided, use the markers array.
      if (!Array.isArray(arr)) {
        arr = mainViewModel.markers();
      }

      recurse(arr, visible);

      function recurse(arr, visible) {
        for (var i = 0; i < arr.length; i++) {

          if (visible !== undefined) {
            // Simple case: Visibility is defined by the value of visible.

            if (arr[i].visible() !== visible) {
              arr[i].visible(visible);

              if (!arr[i].contents) {
                // Marker.
                map.modifyMarker(arr[i].id(), {visible: visible});
              }
            }

            if (arr[i].contents) {
              // Folder.
              recurse(arr[i].contents(), visible);
            }
          } else {
            // More complex case: Visibility is defined by the sidebar search
            // filter and potentially the current map bounds.

            if (arr[i].contents) {
              // Folder.

              // Folders are only not visible if their containing folders are
              // collapsed, in which case the passed visible parameter wouldn't
              // be undefined and we wouldn't reach this point.
              if (!arr[i].visible()) {
                arr[i].visible(true);
              }

              // Is the folder collapsed?
              if (arr[i].collapsed()) {
                // Yes, set the contents to not visible.
                recurse(arr[i].contents(), false);
              } else {
                // No, proceed with checking the contents' visibility.
                recurse(arr[i].contents());
              }
            } else {
              //Marker.

              var result;

              // First filter by title.
              if (arr[i].title().toLowerCase().indexOf(search) !== -1) {
                result = true;
              } else {
                result = false;
              }

              // Then filter by map visibility if required.
              if (self.visibleOnly() && result) {
                result = map.visibleOnMap(arr[i].id());
              }

              if (arr[i].visible() !== result) {
                arr[i].visible(result);
                map.modifyMarker(arr[i].id(), {visible: result});
              }
            }
          }
        }
      }
    };

    // Only display markers that are within the map's current bounds.
    self.visibleOnly = ko.observable(false);

    init();

    /**
     * Called when the map's bounds change. Calls self.updateVisibility only if
     * necessary.
     */
    function boundsChanged() {
      if (self.visibleOnly()) {
        self.updateVisibility();
      }
    }

    /**
     * Returns the closest element in the DOM matching the selector.
     */
    function getClosest(element, selector) {
      do {
        if (matches(element, selector)) {
          return element;
        }
        element = element.parentNode;
      } while (element);
      return null;
    }

    /**
     * Initializes the Sidebar View Model.
     */
    function init() {
      self.stayOpen(wideEnough());
      self.expanded(wideEnough());

      // Recenter the map if the sidebar expanded (after delay to allow expansion to finish).
      if (self.expanded()) {
        window.setTimeout(function() {
          map.triggerResize();
          map.recenter();
        }, 500);  // Animation duration is 0.25s.
      }

      window.addEventListener('resize', function() {
        self.stayOpen(wideEnough());
      });

      handleMapResizing();

      // Subscribe handleMapResizing to stayOpen.
      self.stayOpen.subscribe(handleMapResizing);

      // Subscribe self.updateVisibility to visibility filters.
      self.visibleOnly.subscribe(self.updateVisibility);
      self.search.subscribe(self.updateVisibility);

      // Call boundsChanged when the map bounds change.
      map.onBoundsChange(boundsChanged);

      function wideEnough() {
        if (window.innerWidth >= 1000) {
          return true;
        } else {
          return false;
        }
      }
    }

    /**
     * Invoked when self.stayOpen's value changes.
     */
    function handleMapResizing() {
      if (self.stayOpen()) {
        // The map is resized when the window width changes, or gradually when self.expanded changes.
        if (!resizeListener) {
          resizeListener = function(e) {
            map.triggerResize();
            map.recenter();
          };
          window.addEventListener('resize', resizeListener);
        }
        if (!resizeSubscription) {
          resizeSubscription = self.expanded.subscribe(delayed);
        }
      } else {
        // The map is not resized.
        if (resizeListener) {
          window.removeEventListener('resize', resizeListener, false);
          resizeListener = null;
        }
        if (resizeSubscription) {
          resizeSubscription.dispose();
          resizeSubscription = null;
        }
      }

      function clear() {

      }

      function delayed() {
        window.setTimeout(function() {
          map.triggerResize();
          map.recenter();
        }, 500);  // Animation duration is 0.25s.
      }
    }

    /**
     * Checks if the element matches the selector.
     */
    function matches(element, selector) {
      if (!element.tagName) {
        return null;
      }
      var docEl = global.document.documentElement;
      var match = docEl.matches || docEl.matchesSelector || docEl.webkitMatchesSelector || docEl.mozMatchesSelector || docEl.msMatchesSelector || docEl.oMatchesSelector;
      return match.call(element, selector);
    }

    /**
     * Removes the indicated folder and either removes its contents or
     * moves its contents to its containing array.
     */
    function removeFolder(folder, removeContents) {
      var obsArr = mainViewModel.getContainingArray(folder),
          arr = obsArr(),
          index = arr.indexOf(folder);

      // Remove this folder and its contents from its containing array.
      arr.splice(index, 1);

      if (removeContents) {
        var toRemove = mainViewModel.getAllMarkers(folder.contents());

        // Remove all the markers contained within this folder and its subfolders from the map.
        toRemove.forEach(function(marker) {
          // The second argument indicates that the markers only need to be removed from the map.
          mainViewModel.removeMarker(marker, true);
        });
      } else {
        // Move this folder's contents to its previous position in its containing array.
        var arrHead = arr.splice(0, index - 1);
        arr = arrHead.concat(folder.contents(), arr);
      }

      obsArr(arr);
    }
  }

})(this);
