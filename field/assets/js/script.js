(function($) {

  var Multiselect = function(element) {

    var self = this;

    // ===================================================
    //  Elements and Variables
    // ===================================================
    this.display     = $(element);
    this.placeholder = self.display.find('.placeholder');

    this.field       = self.display.parents('.field');
    this.label       = self.field.find('.label');
    this.readonly    = self.display.data('readonly');
    this.modal       = self.field.parents('.modal-content');

    this.list        = self.display.next();
    this.checkboxes  = self.list.find('input[type="checkbox"]');

    this.search      = self.list.find('.search-bar');
    this.canSearch   = self.display.data('search');

    this.selected    = [];


    // ===================================================
    //  Add a selected item
    // ===================================================
    this.add = function(item) {
      item = {
        order:  item.parents('.list-item').index(),
        name:   item.val(),
        value:  item.parent().text()
       };

      var pos = self.addToStore(item);
      self.addToDisplay(item, pos);
    };

    this.addToStore = function(item) {
      self.selected.push(item);
      return self.sort(item);
    };

    this.addToDisplay = function(item, pos) {
      var html = '<span class="item" title="' + item.name + '">' + item.value + '</span>';

      if(pos > 0) {
        self.display.find('.item').eq(pos - 1).after(html);
      } else {
        self.display.prepend(html);
      }
    };

    // prepopulate with elements
    this.prepopulate = function() {
      self.checkboxes.filter(':checked').each(function() {
        self.add($(this));
      });
    };


    // ===================================================
    //  Remove an unselected item
    // ===================================================
    this.remove = function(item) {
      var key = item.val();
      self.removeFromStore(key);
      self.removeFromDisplay(key);
    };

    this.removeFromStore = function(key) {
      self.selected = $.grep(self.selected, function(v) {
        return v.name != key;
      });
    };

    this.removeFromDisplay = function(key) {
      self.display.find('span[title="' + key + '"]').remove();
    };


    // ===================================================
    //  Sort selected items
    // ===================================================
    this.sort = function(element) {
      self.selected.sort(function(a, b) {
          return a.order - b.order;
      });

      if(element !== undefined) {
        // returns order of element
        var index = $.map(self.selected, function(e, i) {
          if(e.name == element.name) return i;
        });
        return index[0];
      }
    };


    // ===================================================
    //  Search
    // ===================================================

    this.filterSearch = function() {
      var query    = self.search.val();
      var items    = self.list.find('ul').children();
      var regex    = new RegExp("(" + query + ")", "ig");

      items.each(function() {
        self.filterSearchItem($(this), regex);
      });
    };

    this.filterSearchItem = function(item, regex) {
      var span  = item.find('span');
      var match = span.text().match(regex);

      if(match === null) {
        item.css({'display': 'none'});
      } else {
        var formatted = span.text().replace(regex, "<b>$1</b>");
        span.html(formatted);
        item.css({'display': 'block'});
      }
    };

    this.resetSearch = function() {
      self.search.val("");
      self.list.find('ul').children().each(function () {
        self.resetSearchItem($(this));
      });
    };

    this.resetSearchItem = function(item) {
      var span = item.find('span');
      span.html(span.text());
      item.css({'display':'block'});
    };


    this.setupSearch = function() {
      self.search.on('input', self.filterSearch);

      self.field.on('keydown', function(e) {
        if(e.keyCode == 27 || e.which == 27) {
          if(self.search.val() === '') {
            self.toggleDropdown();
          } else {
            self.resetSearch();
          }
        }
      });


    };


    // ===================================================
    //  Display
    // ===================================================

    this.togglePlacehoder = function () {
      if(self.selected.length > 0) {
        self.placeholder.hide();
      } else {
        self.placeholder.show();
      }
    };

    // ===================================================
    //  Dropdown
    // ===================================================

    this.toggleDropdown = function() {
      self.resetSearch();
      self.list.toggle();
      self.display.toggleClass('input-is-focused');

      if(self.display.hasClass('input-is-focused')) {
        self.search.focus();
      }

      self.modalize();
    };

    this.hideDropdown = function() {
      self.list.hide();
      self.display.removeClass('input-is-focused');
      self.modalize('remove');
    };

    this.setupDropdown = function() {
      // toggle dropdown on click
      self.display.add(self.label).on('click', self.toggleDropdown);

      // hide dropdown on outside click
      var ref = self.modal.length > 0 ? $('.modal-content') : $(document);
      ref.bind('click', function (e) {
        if(self.display.hasClass('input-is-focused') && !self.field.has($(e.target)).length) {
          self.hideDropdown();
        }
      });

      self.field.on('keydown', function(e) {
        self.keybindings(e);
      });
    };

    // ===================================================
    //  Checkboxes
    // ===================================================

    this.changeCheckbox = function(checkbox) {
      if(checkbox.is(':checked')) {
        self.add(checkbox);
      } else {
        self.remove(checkbox);
      }
      self.togglePlacehoder();
    };

    this.setupCheckboxes = function() {
      self.checkboxes.on('change', function () {
        self.changeCheckbox($(this));
      });
    };

    // ===================================================
    //  Navigate with keys
    // ===================================================

    this.getCurrentFocused = function() {
      var current = self.list.find('.list-item--focused');

      if(current.length !==0 && !current.is(':visible')) {
        current.removeClass('list-item--focused');
        return self.getCurrentFocused();
      } else {
        return current;
      }
    };

    this.changeFocussed = function() {
      var item = self.getCurrentFocused();

      if(item.length !== 0) {
        var checkbox = item.find('.checkbox');
        checkbox.prop('checked', !checkbox.prop('checked'));
        checkbox.trigger('change');
      }
    };

    this.navigateDropdown = function(direction) {
      var next;
      var last = self.getCurrentFocused();

      if(direction === 'up') {
        if(last.length === 0) {
          self.hideDropdown();
          next = {length: 0};
        } else {
          next = last.prevAll('.list-item:visible').first();

          if(next.length === 0) {
            self.search.focus();
            self.list.scrollTop(0);
          }
        }

      } else {
        if(last.length === 0) {
          next = self.list.find('.list-item:visible').first();
        } else {
          next = last.nextAll('.list-item:visible').first();

          if(next.length === 0) {
            self.search.focus();
            self.list.scrollTop(0);
          }
        }
      }


      last.removeClass('list-item--focused');

      if(next.length !== 0) {
        self.scrollDropdown(next);
        next.addClass('list-item--focused');
      }

    };

    this.scrollDropdown = function(item) {
      var searchHeight = self.search.outerHeight();
      var searchPos    = self.search.offset().top;
      var listHeight   = self.list.innerHeight() - searchHeight;
      var listPos      = self.list.scrollTop();
      var itemHeight   = item.outerHeight();
      var itemPos      = item.offset().top - searchPos;

      if(itemPos > (listHeight + listPos)) {
        self.list.scrollTop(listPos + itemHeight);
      } else if(itemPos < listPos) {
        self.list.scrollTop(listPos - itemHeight);
      }
    };


    // ===================================================
    //  Keybindings
    // ===================================================

    this.keybindings = function(e) {

      if(self.display.hasClass('input-is-focused')) {

        // hide dropdown on tab click
        if(e.which == 9) {
          self.hideDropdown();
          self.display.focus();
          e.preventDefault();

        } else if(e.which == 38) {
          self.navigateDropdown('up');

        } else if(e.which == 40) {
          self.navigateDropdown('down');

        } else if (e.which == 13) {
          self.changeFocussed();
          e.preventDefault();
        }

      } else {

        // enter or arrow-down open dropdown
        if(e.which != 9 && e.which != 38) {
          self.toggleDropdown();
        }
      }
    };


    // ===================================================
    //  Helpers
    // ===================================================

    // fixing display in structure field modal
    this.modalize = function(mode) {
      var view  = $(window).height() + $(window).scrollTop();
      if(self.modal.length > 0) {
        var modal = self.modal.offset().top + self.modal.height();
        if(view > modal) {
          if(mode == 'remove') self.modal.removeClass('overflowing');
          else self.modal.toggleClass('overflowing');
        }
      }
    };

    // ===================================================
    //  Init
    // ===================================================
    this.init = function () {
      self.prepopulate();
      self.togglePlacehoder();

      if(!self.readonly) {
        self.setupDropdown();
        self.setupCheckboxes();

        if(self.canSearch == 1) {
          self.setupSearch();
        }
      }
    };

    // start the plugin
    return this.init();
  };


  // jquery helper for the multiselect plugin
  $.fn.multiselect = function() {
    return this.each(function() {
      if($(this).data('multiselect')) {
        return $(this).data('multiselect');
      } else {
        var multiselect = new Multiselect(this);
        $(this).data('multiselect', multiselect);
        return multiselect;
      }
    });
  };

})(jQuery);
