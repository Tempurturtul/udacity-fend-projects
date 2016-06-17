/**
 * app.js
 * Core functionality for the Cat Clicker application.
 */

(function(global) {
  var model = {
    init: function() {
      var cats,
          ids;

      // Initialize cats if not in local storage.
      if (!global.window.localStorage.getItem('cats')) {
        cats = {
          1: {
            id: 1,
            name: 'Killit',
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

        global.window.localStorage.setItem('cats', JSON.stringify(cats));
      }

      // Initialize selected cat and admin mode.
      cats = this.getAllCats();
      ids = Object.keys(cats);

      // Use a random cat ID for the selected cat.
      this.selectedCat = ids[Math.floor(Math.random() * ids.length)];
      this.adminMode = true;  // False to completely disable the admin view.
    },

    getAllCats: function() {
      return JSON.parse(global.window.localStorage.getItem('cats'));
    },

    getCat: function(id) {
      return this.getAllCats()[id];
    },

    getSelectedCat: function() {
      return this.getCat(this.selectedCat);
    },

    setSelectedCat: function(id) {
      this.selectedCat = id;
    },

    editCat: function(id, data) {
      var cats = this.getAllCats(),
          cat = cats[id];

      if (data.name) {
        cat.name = data.name;
      }

      if (data.clicks) {
        cat.clicks = parseInt(data.clicks);
      }

      if (data.images) {
        cat.images = data.images;
      }

      global.window.localStorage.setItem('cats', JSON.stringify(cats));
    },

    incrementClicks: function(id) {
      var clicks = this.getCat(id).clicks;

      this.editCat(id, {clicks: clicks + 1});
    },

    getAdminMode: function() {
      return this.adminMode;
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

      if (this.getAdminMode()) {
        view.adminView.update();
      }
    },

    editSelectedCat: function(data) {
      var cat = this.getSelectedCat();

      // Edit data to avoid unnecessarily overwriting srcset data if the src didn't change.
      if (data.images.src === cat.images.src){
        data.images = cat.images;
      }

      model.editCat(cat.id, data);
      view.listView.render();
      view.detailsView.updateSelected();
    },

    incrementClicks: function() {
      var id = this.getSelectedCat().id;

      model.incrementClicks(id);
      view.detailsView.updateClicks();

      if (this.getAdminMode()) {
        view.adminView.update();
      }
    },

    getAdminMode: function() {
      return model.getAdminMode();
    }
  };

  var view = {
    init: function() {
      this.listView.init();
      this.detailsView.init();

      if (octopus.getAdminMode()) {
        this.adminView.init();
      }
    },

    listView: {
      init: function() {
        this.listElem = global.document.getElementById('cat-list');

        this.render();
      },

      render: function() {
        // Clear list view.
        this.listElem.innerHTML = '';

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
          octopus.incrementClicks();
        }
      },

      updateClicks: function() {
        var clicksElem = global.document.getElementById('cat-clicks'),
            cat = octopus.getSelectedCat();

        clicksElem.textContent = cat.clicks;
      },

      updateSelected: function() {
        var cat = octopus.getSelectedCat(),
            nameElem = global.document.getElementById('cat-name'),
            pictureElem = global.document.getElementById('cat-picture');

        nameElem.textContent = cat.name;
        pictureElem.src = cat.images.src;

        if (cat.images.srcset) {
          pictureElem.srcset = cat.images.srcset
            .reduce(function(acc, curr) {
              var set = curr.url + ' ' + curr.width;

              if (acc === '') {
                return set;
              }

              return acc += ', ' + set;
            }, '');
        } else {
          pictureElem.srcset = '';
        }

        this.updateClicks();
      }
    },

    adminView: {
      init: function() {
        this.adminElem = global.document.getElementById('admin');

        this.render();
      },

      render: function() {
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
        btnElem.addEventListener('click', toggleFn, false);
        this.adminElem.appendChild(btnElem);

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
        inputElem.value = cat.name;
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
        inputElem.value = cat.images.src;
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
        inputElem.value = cat.clicks;
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
        btnElem.addEventListener('click', cancelFn, false);
        rowElem.appendChild(btnElem);
        btnElem = doc.createElement('button');
        btnElem.id = 'save';
        btnElem.type = 'button';
        btnElem.textContent = 'Save';
        btnElem.addEventListener('click', saveFn, false);
        rowElem.appendChild(btnElem);
        formElem.appendChild(rowElem);
        this.adminElem.appendChild(formElem);

        function toggleFn() {
          doc.getElementById('admin-panel').classList.toggle('hidden');
        }

        function cancelFn() {
          // Toggle the form and reset the form inputs.
          var cat = octopus.getSelectedCat(),
              nameInputElem = doc.getElementById('cat-name-input'),
              pictureInputElem = doc.getElementById('cat-picture-input'),
              clicksInputElem = doc.getElementById('cat-clicks-input');

          toggleFn();

          nameInputElem.value = cat.name;
          pictureInputElem.value = cat.images.src;
          clicksInputElem.value = cat.clicks;
        }

        function saveFn() {
          // Toggle the form and save the form inputs, then update the view.
          var data = {
            name: doc.getElementById('cat-name-input').value,
            images: {
              src: doc.getElementById('cat-picture-input').value
            },
            clicks: doc.getElementById('cat-clicks-input').value
          };

          toggleFn();

          octopus.editSelectedCat(data);
        }
      },

      update: function() {
        var doc = global.document,
            cat = octopus.getSelectedCat(),
            nameInputElem = doc.getElementById('cat-name-input'),
            pictureInputElem = doc.getElementById('cat-picture-input'),
            clicksInputElem = doc.getElementById('cat-clicks-input');

        nameInputElem.value = cat.name;
        pictureInputElem.value = cat.images.src;
        clicksInputElem.value = cat.clicks;
      }
    }
  };

  octopus.init();
})(this);
