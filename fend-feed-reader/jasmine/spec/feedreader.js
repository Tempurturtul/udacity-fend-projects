/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
     * a related set of tests. This suite is all about the RSS
     * feeds definitions, the allFeeds variable in our application.
     */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* Loops through each feed in the allFeeds object and ensures
         * it has a URL defined and that the URL is not empty.
         */
        it('have urls', function() {
            allFeeds.forEach(function(feed) {
                // Does the feed have a url property?
                expect(feed.url).toBeDefined();
                // Is it a string?
                expect(feed.url).toEqual(jasmine.any(String));
                // Is it not empty? (Empty strings are not truthy.)
                expect(feed.url).toBeTruthy();
            });
        });


        /* Loops through each feed in the allFeeds object and ensures
         * it has a name defined and that the name is not empty.
         */
        it('have names', function() {
            allFeeds.forEach(function(feed) {
                // Does the feed have a name property?
                expect(feed.name).toBeDefined();
                // Is it a string?
                expect(feed.name).toEqual(jasmine.any(String));
                // Is it not empty? (Empty strings are not truthy.)
                expect(feed.name).toBeTruthy();
            });
        });
    });


    describe('The menu', function() {

        /* Ensures the menu element is hidden by default.
         */
        it('is hidden by default', function() {
            // Does the body have the menu-hidden class? (This is the class that toggles the menu.)
            expect($('body').hasClass('menu-hidden')).toBe(true);
        });

        /* Ensures the menu changes visibility when the menu icon is
         * clicked.
         */
        it('changes visibility when the menu icon is clicked', function() {
            // The menu-hidden class on the body determines the menu's visibility.
            var initialState = $('body').hasClass('menu-hidden');

            // The element with the menu-icon-link class toggles the menu's visibility when clicked.
            $('.menu-icon-link').click();

            // Has the menu's visibility changed?
            expect($('body').hasClass('menu-hidden')).not.toBe(initialState);

            $('.menu-icon-link').click();

            // Has the menu's visibility changed back to the initial state?
            expect($('body').hasClass('menu-hidden')).toBe(initialState);
        });

    });

    describe('Initial Entries', function() {

        // Before each test, load the first feed and wait for it to finish.
        beforeEach(function(done) {
            loadFeed(0, done);
        });

        /* Ensures when the loadFeed function is called and completes
         * its work, there is at least a single .entry element within
         * the .feed container.
         */
        it('contains at least one entry', function() {
            // Is there at least one element with the entry class in the element with the feed class?
            expect($('.feed .entry').length).toBeGreaterThan(0);
        });

    });

    describe('New Feed Selection', function() {

        // Before each test, load the first feed and wait for it to finish.
        beforeEach(function(done) {
            loadFeed(0, done);
        });

        /* Ensures when a new feed is loaded by the loadFeed function
         * that the content actually changes.
         */
        it('changes the content', function(done) {
            var initialContent = $('.feed').html();

            // Load the second feed...
            loadFeed(1, function() {
                // Has the content changed?
                expect($('.feed').html()).not.toEqual(initialContent);
                done();
            });
        });

    });
}());
