function parseCSS(str) { return str.match(/\d+/)[0]; }

function easeInOutQuad (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t; }

function reset() {
  $(window).off('scroll');
  $('#nav').removeClass('fixed');
  $('#footer').removeClass('fixed');
  $('#nav .nav-inner').css('margin-right', 'auto');
  $('#title .title-inner').css('margin-left', 'auto');
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
  var $navInner = $('#nav .nav-inner');
  var $titleInner = $('#title .title-inner');

  var origNavMargin = parseCSS($navInner.css('margin-right'));
  var origTitleMargin = parseCSS($titleInner.css('margin-left'));
  var endNavMargin = 0;
  var endTitleMargin = 0.7 * origTitleMargin;
  var diffNavMargin = origNavMargin - endNavMargin;
  var diffTitleMargin = origTitleMargin - endTitleMargin;
  var startHeight = 0;
  var endHeight = $('#centerpiece').outerHeight(true) - $nav.height();
  var length = endHeight - startHeight;

  $(window).on('scroll', function(event) {
    var y = $(this).scrollTop();
    if (y >= startHeight && y <= endHeight) {
      var percentComplete = (y - startHeight) / length;
      var percentEase = easeInOutQuad(percentComplete);
      $navInner.css('margin-right', origNavMargin - percentEase * diffNavMargin);
      $titleInner.css('margin-left', origTitleMargin - percentEase * diffTitleMargin);
    } else if (y < startHeight) {
      $navInner.css('margin-right', 'auto');
      $titleInner.css('margin-left', 'auto');
    } else {
      $navInner.css('margin-right', endNavMargin);
      $titleInner.css('margin-left', endTitleMargin);
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
