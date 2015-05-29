(function($) {

  $.fn.multiselect = function() {

    return this.each(function() {

      var multiselect = $(this);
      var field       = multiselect.parent().parent();
      var list        = multiselect.next();
      var checkboxes  = list.find('input[type="checkbox"]');
      var placeholder = multiselect.find('.placeholder');
      var label       = field.find('.label');
      var readonly    = multiselect.data('readonly');

      if(multiselect.find('.item').length > 0) placeholder.hide();

      if(!readonly) {

        multiselect.add(label).on('click', function () {
          list.toggle();
          multiselect.toggleClass('input-is-focused');
        });

        $(document).bind('click', function (e) {
          var target = $(e.target);
          if(!field.has(target).length) {
            list.hide();
            multiselect.removeClass('input-is-focused');
          }
        });


        checkboxes.on('change', function () {
          var checkbox = $(this);

          if (checkbox.is(':checked')) {
            var key   = checkbox.val();
            var value = checkbox.parent().text();
            var html  = '<span class="item" title="' + key + '">' + value + '</span>';
            multiselect.append(html);
            placeholder.hide();
          }
          else {
            $('span[title="' + checkbox.val() + '"]').remove();
            if(multiselect.find('.item').length == 0) placeholder.show();
          }
        });

      }

    });

  };

})(jQuery);
