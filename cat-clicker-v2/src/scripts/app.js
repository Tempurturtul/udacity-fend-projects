/**
 * app.js
 * Core functionality for the Cat Clicker application.
 */

(function(global) {
  var model = {
    init: function() {
      if (!global.window.localStorage.getItem('clicks')) {
        var clicks = {};
        var cats = this.getAllCats();

        for (var catID in cats) {
          clicks[catID] = 0;
        }

        global.window.localStorage.setItem('clicks', JSON.stringify(clicks));
      }
    },

    getAllCats: function() {
      return {
        1: {
          name: 'Killit',
          images: [
            {
              width: '1920w',
              url: 'image/cat-1.jpg'
            },
            {
              width: '960w',
              url: 'image/960x635/cat-1-960x635.jpg'
            },
            {
              width: '480w',
              url: 'image/480x318/cat-1-480x318.jpg'
            }
          ]
        },
        2: {
          name: 'Scratchit',
          images: [
            {
              width: '1920w',
              url: 'image/cat-2.jpg'
            },
            {
              width: '960w',
              url: 'image/960x635/cat-2-960x635.jpg'
            },
            {
              width: '480w',
              url: 'image/480x318/cat-2-480x318.jpg'
            }
          ]
        },
        3: {
          name: 'Watchit',
          images: [
            {
              width: '1920w',
              url: 'image/cat-3.jpg'
            },
            {
              width: '960w',
              url: 'image/960x635/cat-3-960x635.jpg'
            },
            {
              width: '480w',
              url: 'image/480x318/cat-3-480x318.jpg'
            }
          ]
        },
        4: {
          name: 'Pounceonit',
          images: [
            {
              width: '1920w',
              url: 'image/cat-4.jpg'
            },
            {
              width: '960w',
              url: 'image/960x635/cat-4-960x635.jpg'
            },
            {
              width: '480w',
              url: 'image/480x318/cat-4-480x318.jpg'
            }
          ]
        },
        5: {
          name: 'Warmm',
          images: [
            {
              width: '1920w',
              url: 'image/cat-5.jpg'
            },
            {
              width: '960w',
              url: 'image/960x635/cat-5-960x635.jpg'
            },
            {
              width: '480w',
              url: 'image/480x318/cat-5-480x318.jpg'
            }
          ]
        },
        6: {
          name: 'Curious',
          images: [
            {
              width: '1920w',
              url: 'image/cat-6.jpg'
            },
            {
              width: '960w',
              url: 'image/960x635/cat-6-960x635.jpg'
            },
            {
              width: '480w',
              url: 'image/480x318/cat-6-480x318.jpg'
            }
          ]
        },
        7: {
          name: 'Guru',
          images: [
            {
              width: '1920w',
              url: 'image/cat-7.jpg'
            },
            {
              width: '960w',
              url: 'image/960x635/cat-7-960x635.jpg'
            },
            {
              width: '480w',
              url: 'image/480x318/cat-7-480x318.jpg'
            }
          ]
        },
        8: {
          name: 'Myspot',
          images: [
            {
              width: '1920w',
              url: 'image/cat-8.jpg'
            },
            {
              width: '960w',
              url: 'image/960x635/cat-8-960x635.jpg'
            },
            {
              width: '480w',
              url: 'image/480x318/cat-8-480x318.jpg'
            }
          ]
        },
        9: {
          name: 'Lazy',
          images: [
            {
              width: '1920w',
              url: 'image/cat-9.jpg'
            },
            {
              width: '960w',
              url: 'image/960x635/cat-9-960x635.jpg'
            },
            {
              width: '480w',
              url: 'image/480x318/cat-9-480x318.jpg'
            }
          ]
        },
        10: {
          name: 'Feedme',
          images: [
            {
              width: '1920w',
              url: 'image/cat-10.jpg'
            },
            {
              width: '960w',
              url: 'image/960x635/cat-10-960x635.jpg'
            },
            {
              width: '480w',
              url: 'image/480x318/cat-10-480x318.jpg'
            }
          ]
        },
        11: {
          name: 'Petme',
          images: [
            {
              width: '1920w',
              url: 'image/cat-11.jpg'
            },
            {
              width: '960w',
              url: 'image/960x635/cat-11-960x635.jpg'
            },
            {
              width: '480w',
              url: 'image/480x318/cat-11-480x318.jpg'
            }
          ]
        }
      };
    },

    getCat: function(id) {
      return this.getAllCats()[id];
    },

    getAllClicks: function() {
      return JSON.parse(global.window.localStorage.getItem('clicks'));
    },

    getClicks: function(id) {
      return this.getAllClicks()[id];
    },

    addClick: function(id) {
      var clicks = this.getAllClicks();

      clicks[id]++;

      global.window.localStorage.setItem('clicks', JSON.stringify(clicks));
    }
  };

  var octopus = {
    init: function() {
      model.init();
      view.init();
    }
  };

  var view = {
    init: function() {

    }
  };

  octopus.init();
})(this);
