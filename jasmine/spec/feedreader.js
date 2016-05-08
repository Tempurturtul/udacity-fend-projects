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


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
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


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
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


    /* TODO: Write a new test suite named "The menu" */
    describe('The menu', function() {

        /* TODO: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        it('is hidden by default', function() {
          // Does the body have the menu-hidden class? (This is the class that toggles the menu.)
          expect($('body').hasClass('menu-hidden')).toBe(true);
        });

         /* TODO: Write a test that ensures the menu changes
          * visibility when the menu icon is clicked. This test
          * should have two expectations: does the menu display when
          * clicked and does it hide when clicked again.
          */
         it('changes visibility when the menu icon is clicked', function() {
           // The menu-hidden class on the body determines the menu's visibility.
           var initialState = $('body').hasClass('menu-hidden');

           // The element with the menu-icon-link class toggles the menu's visibility when clicked.
           $('.menu-icon-link').click();

           // Has the menu's visibility changed?
           expect($('body').hasClass('menu-hidden')).not.toBe(initialState);
         });

    });

    /* TODO: Write a new test suite named "Initial Entries" */
    describe('Initial Entries', function() {

        // Before each test, load the first feed and wait for it to finish.
        beforeEach(function(done) {
          loadFeed(0, function() {
            done();
          });
        });

        /* TODO: Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
        it('contains at least one entry', function(done) {
          // Is there at least one element with the entry class in the element with the feed class?
          expect($('.feed .entry').length).toBeGreaterThan(0);

          done();
        });

    });

    /* TODO: Write a new test suite named "New Feed Selection" */
    describe('New Feed Selection', function() {

        // Before each test, load the first feed and wait for it to finish.
        beforeEach(function(done) {
          loadFeed(0, function() {
            done();
          });
        });

        /* TODO: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
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
