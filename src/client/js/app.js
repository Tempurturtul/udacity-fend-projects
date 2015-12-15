$(document).ready(function() {

  bio.display();
  work.display();
  projects.display();
  education.display();
  locations.updatePlaces();
  locations.display();

  // On .work-entry h3 click...
  $('.work-entry > h3').click(function(e) {
    var msg = 'Please contact me directly if you would like more details ' +
    'regarding this position.';
    var pos = {
      x: e.pageX + 'px',
      y: e.pageY + 'px'
    };

    popup(msg, pos);
  });

  // On collapse-button click...
  $('.collapse-button').click(function() {
    var $targetCollapse;
    var $faIcon = $(this).find('.fa');

    if ($(this).hasClass('collapse-prev')) {
      $targetCollapse = $(this).prev('iron-collapse');
    } else {
      $targetCollapse = $(this).next('iron-collapse');
    }

    toggleIronCollapse($targetCollapse);
    invertFAIconDirection($faIcon);
  });

  // On protective-overlay click...
  $('.protective-overlay').click(function() {
    $(this).hide();
  });

  // On protective-overlay's parent mouse-leave...
  $('.protective-overlay').parent().mouseleave(function() {
    $(this).children('.protective-overlay').show();
  });

  /**
   * Creates a dismissable popup message at the given position.
   * @param {string} msg
   * @param {Object} pos
   * @param {string} pos.x
   * @param {string} pos.y
   */
  function popup(msg, pos) {
    var $body = $('body');

    // TODO: Adjust position to prevent positioning out of bounds.

    var popupClass = 'popup';
    var popupStyle = 'text-align: center;' +
                     'color: black;' +
                     'background: white;' +
                     'border: solid 2px black;' +
                     'border-radius: 5px;' +
                     'box-sizing: border-box;' +
                     'padding: 20px;' +
                     'width: 100%;' +
                     'max-width: 300px;' +
                     'position: absolute;' +
                     'top: ' + pos.y + ';' +
                     'left: ' + pos.x + ';' +
                     'cursor: pointer;' +
                     'font-weight: bold;' +
                     'font-size: 1rem;';
    var elem = '<div class="' + popupClass + '" style="' + popupStyle + '">' + msg + '</div>';

    // Dismiss existing popups.
    $body.children('.' + popupClass).remove();
    // Add new popup.
    $body.append(elem);
    // Dismiss popup on click.
    $('.' + popupClass).click(function() {
      $(this).remove();
    });
  }

  function toggleIronCollapse($collapse) {
    // The state of the iron-collapse element.
    var isOpened = $collapse.attr('opened');

    if (isOpened) {
      // Close the iron-collapse element.
      $collapse.removeAttr('opened');
    } else {
      // Open the iron-collapse element.
      $collapse.attr('opened', true);
    }
  }

  function invertFAIconDirection($faIcon) {
    var iconClasses = $faIcon.attr('class').split(' ');

    // For every class on the button's icon...
    iconClasses.forEach(function(iconClass) {
      var re = /fa-.*(up|down|left|right).*/.exec(iconClass);

      // If the class starts with fa- and has the word up, down, left, or right in it...
      if (re) {
        var newClass;

        if (re[1] === 'up') {
          newClass = iconClass.replace(/up/g, 'down');
        } else if (re[1] === 'down') {
          newClass = iconClass.replace(/down/g, 'up');
        } else if (re[1] === 'left') {
          newClass = iconClass.replace(/left/g, 'right');
        } else {
          newClass = iconClass.replace(/right/g, 'left');
        }

        // Replace the button's icon's class.
        $faIcon.removeClass(iconClass);
        $faIcon.addClass(newClass);
      }
    });
  }
});
