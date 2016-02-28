var initialCats = {
  1: {
    id: 1,
    name: 'Killit',
    nicknames: ['Killer', 'Stalker'],
    clicks: 0,
    images: {
      src: 'image/cat-1.jpg',
      srcset: [
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
    }
  },
  2: {
    id: 2,
    name: 'Scratchit',
    nicknames: ['Scratcher', 'Clawz'],
    clicks: 0,
    images: {
      src: 'image/cat-2.jpg',
      srcset: [
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
    }
  },
  3: {
    id: 3,
    name: 'Watchit',
    nicknames: ['Peep'],
    clicks: 0,
    images: {
      src: 'image/cat-3.jpg',
      srcset: [
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
    }
  },
  4: {
    id: 4,
    name: 'Pounceonit',
    nicknames: ['Ambush-the-Prey', 'Jumper'],
    clicks: 0,
    images: {
      src: 'image/cat-4.jpg',
      srcset: [
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
    }
  },
  5: {
    id: 5,
    name: 'Warmm',
    nicknames: ['Cozy'],
    clicks: 0,
    images: {
      src: 'image/cat-5.jpg',
      srcset: [
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
    }
  },
  6: {
    id: 6,
    name: 'Curious',
    nicknames: ['9Lives'],
    clicks: 0,
    images: {
      src: 'image/cat-6.jpg',
      srcset: [
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
    }
  },
  7: {
    id: 7,
    name: 'Guru',
    nicknames: ['Buddha', 'Aang'],
    clicks: 0,
    images: {
      src: 'image/cat-7.jpg',
      srcset: [
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
    }
  },
  8: {
    id: 8,
    name: 'Myspot',
    nicknames: ['Greedy'],
    clicks: 0,
    images: {
      src: 'image/cat-8.jpg',
      srcset: [
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
    }
  },
  9: {
    id: 9,
    name: 'Lazy',
    nicknames: ['Sleepy'],
    clicks: 0,
    images: {
      src: 'image/cat-9.jpg',
      srcset: [
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
    }
  },
  10: {
    id: 10,
    name: 'Feedme',
    nicknames: ['Fatso'],
    clicks: 0,
    images: {
      src: 'image/cat-10.jpg',
      srcset: [
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
    }
  },
  11: {
    id: 11,
    name: 'Petme',
    nicknames: ['Sweety'],
    clicks: 0,
    images: {
      src: 'image/cat-11.jpg',
      srcset: [
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
  }
};

var Cat = function(data) {
  this.id = ko.observable(data.id);
  this.clickCount = ko.observable(data.clicks);
  this.name = ko.observable(data.name);
  this.imgSrc = ko.observable(data.images.src);
  this.imgSrcset = assembleSrcsetObservable(data.images.srcset);
  this.nicknames = ko.observableArray(data.nicknames);
  this.level = ko.computed(function() {
    if (this.clickCount() < 10) {
      return 'Newborn';
    } else if (this.clickCount() < 50) {
      return 'Infant';
    } else if (this.clickCount() < 100) {
      return 'Youngster';
    } else if (this.clickCount() < 200) {
      return 'Teen';
    } else {
      return 'Adult';
    }
  }, this);

  function assembleSrcsetObservable(srcset) {
    var result = '';

    srcset.forEach(function(set) {
      set = set.url + ' ' + set.width;

      if (result) {
        set = ', ' + set;
      }

      result += set;
    });

    return ko.observable(result);
  }
};

var ViewModel = function() {
  var self = this;

  this.catList = ko.observableArray([]);

  for (var cat in initialCats) {
    self.catList.push(new Cat(initialCats[cat]));
  }

  this.currentCat = ko.observable(this.catList()[0]);

  this.incrementCounter = function() {
    // Used with data-bind="with: currentCat" in HTML.
    // Alternatively, assign var self = this, then use self.currentCat().clickCount.
    this.clickCount(this.clickCount() + 1);
  };

  this.setCat = function(clickedCat) {
    self.currentCat(clickedCat);
  };
};

ko.applyBindings(new ViewModel());
