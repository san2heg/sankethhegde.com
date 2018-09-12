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

function isMobile() { return $(window).outerWidth() <= 535; }

function scrollTo(selector, offset) {
  $('html, body').animate({
    scrollTop: $(selector).offset().top - offset
  }, 2000, "swing");
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
    $('#top-logo'),
    $('#top-logo'),
    $('.bkg-wrapper'),
    $('#menu-mobile'),
    $('#menu-mobile'),
    $('#nav .nav-inner')
  ];
  var elemsActive = [
    true,
    true,
    true,
    true,
    true,
    isMobile(),
    isMobile(),
    isMobile()
  ];
  var properties = [
    'translateX',
    'translateX',
    'translateX',
    'opacity',
    'opacity',
    'translateX',
    'opacity',
    'opacity'
  ];
  var transformProperties = [
    'px',
    'px',
    'px',
    false,
    false,
    'px',
    false,
    false
  ];
  var startVals = [
    0,
    0,
    isMobile() ? 20 : 40,
    0,
    1,
    isMobile() ? -40 : -20,
    0,
    1
  ];
  var endVals = [
    parseFloat(elems[0].css('margin-right')),
    -1 * parseFloat(elems[1].css('margin-left')),
    -1 * parseFloat(elems[2].css('margin-left')),
    1,
    0,
    0,
    1,
    0
  ];
  var startHeights = [
    0,
    0,
    $('#title .title-inner').offset().top + $('#title .title-inner').height(),
    $('#title .title-inner').offset().top + $('#title .title-inner').height(),
    0,
    $('#title .title-inner').offset().top + $('#title .title-inner').height(),
    $('#title .title-inner').offset().top + $('#title .title-inner').height(),
    0
  ];
  var endHeights = [
    $('#centerpiece').outerHeight(true) - $('#nav').height(),
    $('#centerpiece').outerHeight(true) - $('#nav').height(),
    $('#centerpiece').outerHeight(true) - $('#nav').height(),
    $('#centerpiece').outerHeight(true) - $('#nav').height(),
    $('#centerpiece').outerHeight(true) - $('#nav').height(),
    $('#centerpiece').outerHeight(true) - $('#nav').height(),
    $('#centerpiece').outerHeight(true) - $('#nav').height(),
    $('#title .title-inner').offset().top + $('#title .title-inner').height()
  ];
  var easeMethods = [
    EasingFunctions.easeInOutQuad,
    EasingFunctions.easeInQuad,
    EasingFunctions.easeOutQuad,
    EasingFunctions.linear,
    EasingFunctions.linear,
    EasingFunctions.easeOutQuad,
    EasingFunctions.linear,
    EasingFunctions.linear
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
          elemActive = elemsActive[i],
          endVal = endVals[i],
          easeMethod = easeMethods[i],
          multiplier = endVals[i] - startVals[i] >= 0 ? 1 : -1;

      if (!elemActive) { continue; }

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
        if (i == 0) {
          $('#nav').css('border-bottom', 'none');
          $('#nav').css('background', 'none');
        }
      } else if (y < startHeight) {
        if (transformProperty != false) {
          elem.css('transform', property + '(' + startVal + transformProperty + ')');
        } else {
          elem.css(property, startVal);
        }
        if (i == 0) {
          $('#nav').css('border-bottom', 'none');
          $('#nav').css('background', 'none');
        }
      } else {
        if (transformProperty != false) {
          elem.css('transform', property + '(' + endVal + transformProperty + ')');
        } else {
          elem.css(property, endVal);
        }
        if (i == 0) {
          $('#nav').css('border-bottom', '1px solid #d9d9d9');
          $('#nav').css('background-color', 'white');
        }
      }
    }
  });

  RESETS.push(function() {
    var i;
    for (i = 0; i < elems.length; i++) {
      if (transformProperties[i] != false) {
        elems[i].css('transform', '');
        continue
      }
      elems[i].css(properties[i], '');
    }
  });
}

function setupClicks() {
  $('.down-btn').on('click', function(e) {
    e.preventDefault();
    scrollTo('#about', $('#footer').hasClass('fixed') ? 0 : $('#footer').outerHeight(true));
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

function centerpieceAnimate() {
  $('#header .bkg').animate({
    opacity: 1
  }, 1000);
}

$(document).ready(function() {
  setupRAFScroll();
  setupAnchors();
  setupClicks();
  setup();
  centerpieceAnimate();

  $(window).on('resize', function() {
    setup();
  });
});
