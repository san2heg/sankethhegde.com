RESETS = [];

function reset() {
  $(window).off('scroll');
  var i;
  for (i = 0; i < RESETS.length; i++) {
    RESETS[i]();
  }

  RESETS = [];
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
    'margin-right',
    'margin-left',
    'margin-left',
    'opacity'
  ]
  var multipliers = [
    -1,
    -1,
    -1,
    1
  ];
  var startVals = [
    parseFloat(elems[0].css('margin-right')),
    parseFloat(elems[1].css('margin-left')),
    parseFloat(elems[2].css('margin-left')),
    0
  ];
  var endVals = [
    0,
    0,
    0,
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

  $(window).on('scroll', function(event) {
    var y = $(this).scrollTop();
    var i;
    for (i = 0; i < elems.length; i++) {
      var startHeight = startHeights[i],
          endHeight = endHeights[i],
          property = properties[i],
          startVal = startVals[i],
          diffVal = Math.abs(endVals[i] - startVals[i]),
          elem = elems[i],
          endVal = endVals[i],
          multiplier = multipliers[i],
          easeMethod = easeMethods[i]

      var length = endHeight - startHeight;
      if (y >= startHeight && y <= endHeight) {
        var percentComplete = (y - startHeight) / length;
        var percentEase = easeMethod(percentComplete);
        elem.css(property, startVal + (percentEase * diffVal) * multiplier);
        if (elem.hasClass('nav-inner')) {
          $('#nav').css('border-bottom', 'none');
        }
      } else if (y < startHeight) {
        elem.css(property, startVal);
        if (elem.hasClass('nav-inner')) {
          $('#nav').css('border-bottom', 'none');
        }
      } else {
        elem.css(property, endVal);
        if (elem.hasClass('nav-inner')) {
          $('#nav').css('border-bottom', '1px solid #E0E0E0');
        }
      }
    }
  });

  RESETS.push(function() {
    $('#nav .nav-inner').css('margin-right', 'auto');
    $('#title .title-inner').css('margin-left', 'auto');
    $('#nav #top-logo').css('margin-left', startVals[2]);
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

$(document).ready(function() {
  setup();

  $(window).on('resize', function() {
    setup();
  });
});
