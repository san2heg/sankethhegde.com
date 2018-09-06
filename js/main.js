function reset() {
  $(window).off('scroll');
  $('#nav').removeClass('fixed');
  $('#footer').removeClass('fixed');
}

function setupCenterpiece() {
  var windowHeight = window.innerHeight;
  var cpHeight = $('#centerpiece').height();
  var navHeight = $('#nav').height();
  var marginHeight = (windowHeight - cpHeight) / 2;

  $('#centerpiece').css('margin-top', marginHeight - navHeight/2);
  $('#centerpiece').css('margin-bottom', marginHeight + navHeight/2);
}

function setupScroll() {
  var $nav = $('#nav');
  var $footer = $('#footer');
  var navTop = $nav.offset().top;
  var footerBottom = $footer.offset().top + $footer.height();
  console.log(footerBottom);

  $(window).on('scroll', function(event) {
    var y = $(this).scrollTop();
    var yBottom = y + $(this).height();
    console.log(y);
    var navIsFixed = $nav.hasClass('fixed');
    var footerIsFixed = $footer.hasClass('fixed');

    if (y >= navTop) {
      if (!navIsFixed) {
        $nav.addClass('fixed');
      }
    } else {
      if (navIsFixed) {
        $nav.removeClass('fixed');
      }
    }

    if (yBottom >= footerBottom) {
      if (!footerIsFixed) {
        $footer.addClass('fixed');
      }
    } else {
      if (footerIsFixed) {
        $footer.removeClass('fixed');
      }
    }
  });
}

function setup() {
  setupCenterpiece();
  setupScroll();
}

$(document).ready(function() {
  setup();

  $(window).on('resize', function() {
    reset();
    setup();
    $(window).trigger('scroll');
  });
});
