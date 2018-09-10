RESETS = [];
SCROLL_FUNCS = [];

function reset() {
  var i;
  for (i = 0; i < RESETS.length; i++) {
    RESETS[i]();
  }

  RESETS = [];
  SCROLL_FUNCS = [];
}

function setupCenterpiece() {
  var windowHeight = window.innerHeight;
  var cpHeight = $('#centerpiece').height();
  var navHeight = $('#nav').height();
  var marginHeight = (windowHeight - cpHeight) / 2;

  $('#centerpiece').css('padding-top', marginHeight - navHeight/2);
  $('#centerpiece').css('padding-bottom', marginHeight + navHeight/2);
}

function setupAnchors() {
  $('.content-section').css({
    'padding-top': $('#nav').height(),
    'margin-bottom': $('#nav').height() * -1
  })
  $('#header').css('margin-bottom', $('#nav').height() * -1);
  $('#footer').css('margin-top', $('#nav').height());
  $('#content .content-section:last-child').css('padding-bottom', $('#footer').height());
}

function setupStickyScroll() {
  var $nav = $('#nav');
  var $footer = $('#footer');
  var navTop = $nav.offset().top;
  var footerBottom = $footer.offset().top + $footer.height();
  console.log('footerBottom = ' + footerBottom);

  SCROLL_FUNCS.push(function(y) {
    var yBottom = y + $(window).height();
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
  })

  RESETS.push(function() {
    $('#nav').removeClass('fixed');
    $('#footer').removeClass('fixed');
  });
}

function setupScrollAnimation() {
  var elems = [
    $('#nav .nav-inner'),
    $('#title .title-inner'),
    $('#nav #top-logo'),
    $('#nav #top-logo')
  ];
  var properties = [
    'translateX',
    'translateX',
    'translateX',
    'opacity'
  ];
  var transformProperties = [
    'px',
    'px',
    'px',
    false
  ];
  var startVals = [
    0,
    0,
    0,
    0
  ];
  var endVals = [
    parseFloat(elems[0].css('margin-right')),
    -1 * parseFloat(elems[1].css('margin-left')),
    -1 * parseFloat(elems[2].css('margin-left')),
    1
  ];
  var startHeights = [
    0,
    0,
    $('#title .title-inner').offset().top + $('#title .title-inner').height(),
    $('#title .title-inner').offset().top + $('#title .title-inner').height()
  ];
  var endHeights = [
    $('#centerpiece').outerHeight(true) - $('#nav').height(),
    $('#centerpiece').outerHeight(true) - $('#nav').height(),
    $('#centerpiece').outerHeight(true) - $('#nav').height(),
    $('#centerpiece').outerHeight(true) - $('#nav').height()
  ];
  var easeMethods = [
    EasingFunctions.easeInOutQuad,
    EasingFunctions.easeInQuad,
    EasingFunctions.easeInOutQuad,
    EasingFunctions.easeInOutQuad
  ]

  SCROLL_FUNCS.push(function(y) {
    var i;
    for (i = 0; i < elems.length; i++) {
      var startHeight = startHeights[i],
          endHeight = endHeights[i],
          property = properties[i],
          transformProperty = transformProperties[i],
          startVal = startVals[i],
          diffVal = Math.abs(endVals[i] - startVals[i]),
          elem = elems[i],
          endVal = endVals[i],
          easeMethod = easeMethods[i],
          multiplier = endVals[i] - startVals[i] >= 0 ? 1 : -1;

      var length = endHeight - startHeight;
      if (y >= startHeight && y <= endHeight) {
        var percentComplete = (y - startHeight) / length;
        var percentEase = easeMethod(percentComplete);
        var currVal = startVal + (percentEase * diffVal) * multiplier;
        if (transformProperty != false) {
          elem.css('transform', property + '(' + currVal + transformProperty + ')');
        } else {
          elem.css(property, currVal);
        }
        if (elem.hasClass('nav-inner')) {
          // $('#nav').css('border-bottom', 'none');
        }
      } else if (y < startHeight) {
        if (transformProperty != false) {
          elem.css('transform', property + '(' + startVal + transformProperty + ')');
        } else {
          elem.css(property, startVal);
        }
        if (elem.hasClass('nav-inner')) {
          // $('#nav').css('border-bottom', 'none');
        }
      } else {
        if (transformProperty != false) {
          elem.css('transform', property + '(' + endVal + transformProperty + ')');
        } else {
          elem.css(property, endVal);
        }
        if (elem.hasClass('nav-inner')) {
          // $('#nav').css('border-bottom', '1px solid #E0E0E0');
        }
      }
    }
  });

  RESETS.push(function() {
    $('#nav .nav-inner').css('transform', 'none');
    $('#title .title-inner').css('transform', 'none');
    $('#nav #top-logo').css('transform', 'none');
    $('#nav #top-logo').css('opacity', 0);
  });
}

function setup() {
  reset()
  setupCenterpiece();
  setupStickyScroll();
  setupScrollAnimation();
  $(window).trigger('scroll');
}

function setupRAFScroll() {
  var lastScrollY = 0;
  var ticking = false;
  var k = 0, j = 0;

  var update = function() {
    var i;
    for (i = 0; i < SCROLL_FUNCS.length; i++) {
      SCROLL_FUNCS[i](lastScrollY);
    }
    ticking = false;
  };

  var requestTick = function() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  };

  var onScroll = function() {
    lastScrollY = window.scrollY;
    requestTick();
  };

  $(window).on('scroll', onScroll);
}

$(document).ready(function() {
  setupRAFScroll();
  setupAnchors();
  setup();

  $(window).on('resize', function() {
    setup();
  });
});
