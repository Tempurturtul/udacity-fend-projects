# Cat Clicker, v2

This is the second version of the "Cat Clicker" application, created after working through the [Design Patterns course](https://www.udacity.com/course/ud989-nd).

![Preview](docs/preview.png "A preview screenshot.")

## Quickstart

**Prerequisites:**
- [Node](https://nodejs.org/en/)
- [Gulp](http://gulpjs.com/)

**Clone the repository, navigate to this project, and install dependencies.**
```
  git clone https://github.com/Tempurturtul/udacity-fend-projects.git
  cd udacity-fend-projects/fend-design-patterns/cat-clicker-v2/
  npm install
```

**Run the default gulp task to serve source files.** *(See `gulpfile.js` for additional tasks.)*
```
  gulp
```

## Udacity's Project Requirements

**Original Requirements**
- Displays a list of cats by name.
- Displays details for a selected cat; including name, picture, and clicks.
- The number of clicks for the selected cat increments when the cat picture is clicked.
- The selected cat changes when a cat in the list of cats is clicked.

**Revised Requirements 1**
- Displays an admin button that toggles display of an admin area.
- Optionally displays an admin area with inputs for changing the cat's name, url, and number of clicks. (Hidden by default.)
- The admin area inputs are filled in with current values.
- The admin area includes a cancel button, which hides the area and discards changes.
- The admin area includes a save button, which submits the changes and updates the view.
