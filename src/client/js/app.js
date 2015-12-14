$(document).ready(function() {

  bio.display();
  work.display();
  projects.display();
  education.display();

  locations.updatePlaces();
  locations.display();

  // On collapse-button click...
  $('.collapse-button').click(toggleIronCollapse);

  // On protective-overlay click...
  $('.protective-overlay').click(function() {
    $(this).hide();
  });

  // On protective-overlay's parent mouse-leave...
  $('.protective-overlay').parent().mouseleave(function() {
    $(this).children('.protective-overlay').show();
  });

  function toggleIronCollapse() {
    // Open or close the next iron-collapse sibling.
    var $collapse = $(this).next('iron-collapse');
    var isOpened = $collapse.attr('opened');
    if (isOpened) {
      $collapse.removeAttr('opened');
    } else {
      $collapse.attr('opened', true);
    }
  }
});
