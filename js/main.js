// Get number from string, e.g. '10px'
function parseCSS(str) {
  return str.match(/\d+/)[0];
}

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

function setupStickyScroll() {
  var $nav = $('#nav');
  var $footer = $('#footer');
  var navTop = $nav.offset().top;
  var footerBottom = $footer.offset().top + $footer.height();

  $(window).on('scroll', function(event) {
    var y = $(this).scrollTop();
    var yBottom = y + $(this).height();
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

function setupScrollAnimation() {
  var $nav = $('#nav');
  var $navInner = $('#nav .nav-inner')
  var origMargin = parseCSS($navInner.css('margin-left'));
  var endMargin = 50;
  var diffMargin = origMargin - endMargin;
  var startHeight = $nav.offset().top;
  var endHeight = $('#centerpiece').outerHeight(true);
  var length = endHeight - startHeight;

  $(window).on('scroll', function(event) {
    var y = $(this).scrollTop();
    if (y >= startHeight && y <= endHeight) {
      var percentComplete = (y - startHeight) / length;
      $navInner.css('margin-left', origMargin - percentComplete * diffMargin);
    } else if (y < startHeight) {
      $navInner.css('margin-left', 'auto');
    } else {
      $navInner.css('margin-left', endMargin);
    }
  });
}

function setup() {
  setupCenterpiece();
  setupStickyScroll();
  setupScrollAnimation();
}

$(document).ready(function() {
  setup();

  $(window).on('resize', function() {
    reset();
    setup();
    $(window).trigger('scroll');
  });
});
