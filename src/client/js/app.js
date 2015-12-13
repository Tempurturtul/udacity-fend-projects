$(document).ready(function() {

  bio.display();
  work.display();
  projects.display();
  education.display();

  places.updatePlaces();
  places.display();

  // On collapse-button click...
  $('.collapse-button').click(toggleIronCollapse);

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
