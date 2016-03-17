# Neighborhood Map

This is the **5th** project in Udacity's [Front-End Web Developer Nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001) program.

## Quickstart

- Install [Node](https://nodejs.org/en/), [Gulp](http://gulpjs.com/), and [Bower](http://bower.io/).
- Clone this repository and install dependencies.
```
  git clone https://github.com/Tempurturtul/fend-neighborhood-map.git
  cd fend-neighborhood-map/
  npm install
  bower install
```
- Run the default gulp task to serve source files. *(See `gulpfile.js` for additional gulp tasks.)*
```
  gulp
```

## Udacity's Project Instructions

```
1. Review our course JavaScript Design Patterns.

2. Knockout must be used to handle list, filter, and any other information
on the page that is subject to changing state. Things that should not be
handled by knockout: anything the map api is used for, creating markers,
tracking their click events, making the map, refreshing the map.

3. Write code required to add a full-screen map to your page using the
Google Maps API. For sake of efficiency, the map API should be called
only once.

4. Write code required to display map markers identifying at least 5
locations that you are interested in within this neighborhood. Your app
should display those locations by default when the page is loaded.

5. Implement a list view of the set of locations defined in step 4.

6. Provide a filter option that uses an input field to filter both the
list view and the map markers displayed by default on load. The list view
and the markers should update accordingly in real-time. Providing a
search function through a third-party API is not enough to meet
specifications.

7. Add functionality using third-party APIs to provide information when a
map marker or list view entry is clicked (ex. Yelp reviews, Wikipedia,
Flickr images, etc). Note that StreetView and Places don't count as an
additional 3rd party API because they are libraries included in the
Google Maps API. If you need a refresher on making AJAX requests to
third-party servers, check out our Intro to AJAX course.

8. Add functionality to animate a map marker when either the list item
associated with it or the map marker itself is selected.

9. Add functionality to open an infoWindow with the information described
in step 7 when either a location is selected from the list view or its
map marker is selected directly.

10. The app's interface should be intuitive to use. For example, the input
text area to filter locations should be easy to locate. It should be easy
to understand what set of locations is being filtered. Selecting a
location via list item or map marker should cause the map marker to
bounce or in some other way animate to indicate that the location has
been selected and associated info window should open above map marker
with additional information.

11. Error Handling: In case of error (e.g. in a situation where a third
party api does not return the expected result) we expect your webpage to
do one of the following: A message is displayed notifying the user that
the data can't be loaded, OR There are no negative repercussions to the
UI. Note: Please note that we expect students to handle errors if the
browser has trouble initially reaching the 3rd-party site as well. For
example, imagine a user is using your neighborhood map, but her firewall
prevents her from accessing the Instagram servers. Here is a reference
article on how to block websites with the hosts file. It is important to
handle errors to give users a consistent and good experience with the
webpage. Read this blogpost to learn more .Some JavaScript libraries
provide special methods to handle errors. For example: refer to .fail()
method discussed here if you use jQuery's ajax() method. We strongly
encourage you to explore ways to handle errors in the library you are
using to make API calls.
```

## User Stories

- ***(WiP)*** User can view a map that initializes either with the options from the user's most recent visit or with pre-defined defaults.
- User can add, remove, and edit persistent map markers that will be displayed on the map.
  - A marker may be added by selecting a search result, or by double-clicking/double-tapping on the map.
  - A marker may be modified or removed via buttons located in the information window displayed when clicking the marker or list entry.
- ***(WiP)*** On the user's first visit, five default map markers will exist.
- User can use a search bar to find locations from which to create new map markers.
- User can view a list of map markers.
- ***(WiP)*** User can sort and categorize map markers in the list.
- ***(WiP)*** User can filter map markers in the list and the map will update its displayed markers accordingly.
- ***(WiP)*** User can click on a map marker on the map or the list to view (within a Google Maps infoWindow) information on the location from various (not all Google API-related) sources.
- ***(WiP)*** User can view an animation effect on a map marker and corresponding list entry whenever that map marker is selected on the map or in the list.
- ***(WiP)*** User can click on an icon next to a map marker category in the list to center and zoom the map in such a way that all the markers contained in that category are visible on the map.
- ***(WiP)*** User can experience errors (for example, resulting from unexpected third-party API results) in a gracefully handled manner. (Either with a helpful error message, or with no negative repercussions to the UI.)
