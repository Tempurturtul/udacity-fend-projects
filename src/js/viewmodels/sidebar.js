// The Sidebar View Model.

(function(global) {

  global.viewmodels = global.viewmodels || {};

  global.viewmodels.Sidebar = Sidebar;

  function Sidebar(mainViewModel) {
    var self = this,
        map = global.map,
        ko = global.ko,
        models = global.models;

    self.addFolder = function(formElem) {
      mainViewModel.markers.push(new models.Folder({name: self.newFolderName()}));

      // Reset new folder name.
      self.newFolderName('');
    };

    self.centerOnContents = function(folder) {
      var markerIDs = getAllMarkers(folder.contents())
                        .map(function(marker) {
                          return marker.id();
                        });

      map.centerOn(markerIDs);
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

    self.dragEnd = function (item) {};

    self.expanded = ko.observable(false);

    self.markerClicked = function(marker) {
      // Center the map on the marker.
      map.centerOn(marker.id());

      // Open the marker's info window.
      mainViewModel.openInfoWindow(marker);
    };

    self.modifyFolder = function(folder) {
      folder.editing(true);
    };

    self.newFolderName = ko.observable('');

    self.removeFolder = function(folder) {
      var obsArr = mainViewModel.getContainingArray(folder),
          arr = obsArr(),
          index = arr.indexOf(folder),
          toRemove = getAllMarkers(folder.contents());

      // First remove all the markers contained within this folder and its subfolders from the map.
      toRemove.forEach(function(marker) {
        map.removeMarker(marker.id());
      });

      // Then remove this folder (and it's contents) from its containing array.
      arr.splice(index, 1);
      obsArr(arr);
    };

    self.reorder = function(event, dragData, zoneData) {
      // If the item isn't being dragged over itself...
      if (dragData.item !== zoneData.item) {
        // If the other item is a folder and the dragged item exists in the same set of items as the folder...
        if (zoneData.item instanceof models.Folder && zoneData.items.indexOf(dragData.item) !== -1) {
          // If the folder is empty...
          if (!zoneData.item.contents().length) {
            // Place the dragged item in the folder and update its items set.
            dragData.items.remove(dragData.item);
            zoneData.item.contents.push(dragData.item);
            dragData.items = zoneData.item.contents;
          }
        }
        // Else if the other item is a marker...
        else if (zoneData.item instanceof models.Marker) {
          // Place the dragged item in the new position and update its items set.
          var index = zoneData.items.indexOf(zoneData.item);
          dragData.items.remove(dragData.item);
          zoneData.items.splice(index, 0, dragData.item);
          dragData.items = zoneData.items;
        }
      }
    };

    // Filter markers by title.
    self.search = ko.observable('');

    self.toggle = function() {
      self.expanded(!self.expanded());
    };

    self.toggleFolder = function(folder) {
      // Toggle collapsed state.
      folder.collapsed(!folder.collapsed());

      // Update the visibility of all contents.
      if (folder.collapsed()) {
        updateVisibility(folder.contents(), false);
      } else {
        updateVisibility(folder.contents());
      }
    };

    // Only display markers that are within the map's current bounds.
    self.visibleOnly = ko.observable(false);

    init();

    /**
     * Called when the map's bounds change. Calls updateVisibility only if
     * necessary.
     */
    function boundsChanged() {
      if (self.visibleOnly()) {
        updateVisibility();
      }
    }

    /**
     * Searches an array and returns all markers within it and within any sub-arrays.
     */
    function getAllMarkers(arr) {
      var result = [];

      arr.forEach(function(elem) {
        elem = ko.unwrap(elem);

        // For every element in the given array...
        if (elem instanceof models.Marker) {
          // If the element is a marker, push it to the accumulation array.
          result.push(elem);
        } else if (Array.isArray(elem)) {
          // Else if it's an array, search it and concat the results to the accumulation array.
          result = result.concat(getAllMarkers(elem));
        } else if (typeof elem === 'object') {
          // Else if it's an object...
          for (var prop in elem) {
            prop = ko.unwrap(elem[prop]);

            // For each of its properties...
            if (Array.isArray(prop)) {
              // If it's an array, search it and concat the results to the accumulation array.
              result = result.concat(getAllMarkers(prop));
            } else if (prop instanceof models.Marker) {
              // Else if it's a marker, push it to the accumulation array.
              result.push(prop);
            }
          }
        }
      });

      return result;
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
      // Subscribe updateVisibility to visibility filters.
      self.visibleOnly.subscribe(updateVisibility);
      self.search.subscribe(updateVisibility);

      // Call boundsChanged when the map bounds change.
      map.onBoundsChange(boundsChanged);
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
     * Updates the visibility of all folders and markers. If visible is defined,
     * uses its value.
     */
    function updateVisibility(arr, visible) {
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
    }
  }

})(this);
