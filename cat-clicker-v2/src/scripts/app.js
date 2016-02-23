/**
 * app.js
 * Core functionality for the Cat Clicker application.
 */

(function(global) {
  var model = {
    init: function() {
      // Set selected cat to a random cat.
      var cats = this.getAllCats(),
          keys = Object.keys(cats);

      this.selectedCat = cats[keys[Math.floor(Math.random() * keys.length)]];

      // Make sure clicks exist in local storage.
      if (!global.window.localStorage.getItem('clicks')) {
        var clicks = {};

        for (var catID in cats) {
          clicks[catID] = 0;
        }

        global.window.localStorage.setItem('clicks', JSON.stringify(clicks));
      }
    },

    getAllCats: function() {
      return {
        1: {
          id: 1,
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
          id: 2,
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
          id: 3,
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
          id: 4,
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
          id: 5,
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
          id: 6,
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
          id: 7,
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
          id: 8,
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
          id: 9,
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
          id: 10,
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
          id: 11,
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

    getSelectedCat: function() {
      return this.selectedCat;
    },

    setSelectedCat: function(id) {
      this.selectedCat = this.getCat(id);
    },

    getAllClicks: function() {
      return JSON.parse(global.window.localStorage.getItem('clicks'));
    },

    getClicks: function(id) {
      return this.getAllClicks()[id];
    },

    addClick: function() {
      var clicks = this.getAllClicks();

      clicks[this.selectedCat.id]++;

      global.window.localStorage.setItem('clicks', JSON.stringify(clicks));
    }
  };

  var octopus = {
    init: function() {
      model.init();
      view.init();
    },

    getAllCats: function() {
      return model.getAllCats();
    },

    getCat: function(id) {
      return model.getCat(id);
    },

    getSelectedCat: function() {
      return model.getSelectedCat();
    },

    setSelectedCat: function(id) {
      model.setSelectedCat(id);
      view.listView.updateSelected();
      view.detailsView.updateSelected();
    },

    getClicks: function(id) {
      return model.getClicks(id);
    },

    addClick: function() {
      model.addClick();
    }
  };

  var view = {
    init: function() {
      this.listView.init();
      this.detailsView.init();
      this.adminView.init();
    },

    listView: {
      init: function() {
        this.listElem = global.document.getElementById('cat-list');

        this.render();
      },

      render: function() {
        var doc = global.document,
            cats = octopus.getAllCats(),
            selectedCat = octopus.getSelectedCat(),
            i,
            li,
            btn;

        for (var cat in cats) {
          li = doc.createElement('li');
          li.classList.add('cat-list-entry');

          if (cats[cat].id === selectedCat.id) {
            li.classList.add('selected');
          }

          btn = doc.createElement('button');
          btn.textContent = cats[cat].name;
          btn.id = cats[cat].id;

          btn.addEventListener('click', clickFn(cats[cat]), false);

          li.appendChild(btn);

          this.listElem.appendChild(li);
        }

        function clickFn(cat) {
          return function () {
            octopus.setSelectedCat(cat.id);
          };
        }
      },

      updateSelected: function() {
        var cat = octopus.getSelectedCat();

        // Clear existing selected.
        global.document.getElementsByClassName('selected')[0]
          .classList.remove('selected');

        // Set new selected.
        global.document.getElementById(cat.id).parentElement.classList.add('selected');
      }
    },

    detailsView: {
      init: function() {
        this.detailsElem = global.document.getElementById('cat-details');

        this.render();
      },

      render: function() {
        // Clear details view.
        this.detailsElem.innerHTML = '';

        var doc = global.document,
            nameElem = doc.createElement('h2'),
            pictureElem = doc.createElement('img'),
            clicksElem = doc.createElement('span'),
            cat = octopus.getSelectedCat();

        nameElem.id = 'cat-name';
        nameElem.textContent = cat.name;

        pictureElem.id = 'cat-picture';
        pictureElem.alt = 'A picture of a cat.';
        pictureElem.sizes = '70vw';

        pictureElem.addEventListener('click', clickFn, false);

        clicksElem.id = 'cat-clicks';

        this.detailsElem.appendChild(nameElem);
        this.detailsElem.appendChild(pictureElem);
        this.detailsElem.appendChild(clicksElem);

        this.updateSelected();

        function clickFn() {
          octopus.addClick();
          view.detailsView.updateClicks();
        }
      },

      updateClicks: function() {
        var clicksElem = global.document.getElementById('cat-clicks'),
            cat = octopus.getSelectedCat();

        clicksElem.textContent = octopus.getClicks(cat.id);
      },

      updateSelected: function() {
        var cat = octopus.getSelectedCat(),
            nameElem = global.document.getElementById('cat-name'),
            pictureElem = global.document.getElementById('cat-picture');

        nameElem.textContent = cat.name;
        pictureElem.src = cat.images[0].url;
        pictureElem.srcset = cat.images
          .reduce(function(acc, curr) {
            var set = curr.url + ' ' + curr.width;

            if (acc === '') {
              return set;
            }

            return acc += ', ' + set;
          }, '');

        this.updateClicks();
      }
    },

    adminView: {
      init: function() {
        this.adminElem = global.document.getElementById('admin');

        this.render();
      },

      render: function() {
        // TODO Fix element creation.
        var doc = global.document,
            btnElem,
            formElem,
            rowElem,
            labelElem,
            inputElem,
            cat = octopus.getSelectedCat();

        // Create the admin toggle button.
        btnElem = doc.createElement('button');
        btnElem.id = 'admin-button';
        btnElem.textContent = 'Admin';
        btnElem.addEventListener('click', function() {
          console.log(doc);
          doc.getElementById('admin-panel').classList.toggle('hidden');
        }, false);

        // Create the form.
        formElem = doc.createElement('form');
        formElem.id = 'admin-panel';
        formElem.classList.add('hidden');

        // Create the form contents.
        // Row #1: Name.
        rowElem = doc.createElement('div');
        rowElem.classList.add('row');
        labelElem = doc.createElement('label');
        labelElem.for = 'cat-name-input';
        labelElem.textContent = 'Name:';
        inputElem = doc.createElement('input');
        inputElem.id = 'cat-name-input';
        inputElem.type = 'text';
        rowElem.appendChild(labelElem);
        rowElem.appendChild(inputElem);
        formElem.appendChild(rowElem);
        // Row #2: Picture.
        rowElem = doc.createElement('div');
        rowElem.classList.add('row');
        labelElem = doc.createElement('label');
        labelElem.for = 'cat-picture-input';
        labelElem.textContent = 'Picture:';
        inputElem = doc.createElement('input');
        inputElem.id = 'cat-picture-input';
        inputElem.type = 'url';
        rowElem.appendChild(labelElem);
        rowElem.appendChild(inputElem);
        formElem.appendChild(rowElem);
        // Row #3: Clicks.
        rowElem = doc.createElement('div');
        rowElem.classList.add('row');
        labelElem = doc.createElement('label');
        labelElem.for = 'cat-clicks-input';
        labelElem.textContent = 'Clicks:';
        inputElem = doc.createElement('input');
        inputElem.id = 'cat-clicks-input';
        inputElem.type = 'number';
        rowElem.appendChild(labelElem);
        rowElem.appendChild(inputElem);
        formElem.appendChild(rowElem);
        // Row #4: Buttons.
        rowElem = doc.createElement('div');
        rowElem.classList.add('row');
        formElem.appendChild(rowElem);
        btnElem = doc.createElement('button');
        btnElem.id = 'cancel';
        btnElem.type = 'button';
        btnElem.textContent = 'Cancel';
        // TODO Add event handler.
        rowElem.appendChild(btnElem);
        btnElem = doc.createElement('button');
        btnElem.id = 'save';
        btnElem.type = 'button';
        btnElem.textContent = 'Save';
        // TODO Add event handler.
        rowElem.appendChild(btnElem);
        formElem.appendChild(rowElem);

        this.adminElem.appendChild(btnElem);
        this.adminElem.appendChild(formElem);

        /*
          <div class="row">
            <button id="cancel" type="button">Cancel</button>
            <button id="save" type="button">Save</button>
          </div>
        </form>
        */
      },

      update: function() {

      }
    }
  };

  octopus.init();
})(this);
