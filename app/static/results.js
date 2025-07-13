$(function () {
    $("[data-player-name]").each(function () {
      const el = $(this);
      const playerName = el.data("player-name");
      fetch('/player_accuracy/' + encodeURIComponent(playerName) + '?quiz_id=' + encodeURIComponent(quizId))
        .then((res) => res.json())
        .then((data) => {
          const percent = data.accuracy || 0;
          const bar = el.find(".accuracy-fill");
          const text = el.find(".accuracy-value");
          text.text(`Of other users, ${percent}% guessed ${playerName} correctly.`);
          text.addClass("show");
          bar.css("width", "0%");
          requestAnimationFrame(() => {
            bar.css("width", `${percent}%`);
          });
        })
        .catch(() => {
          el.find(".accuracy-value").text("Accuracy unavailable").addClass("show");
          el.find(".accuracy-fill").css("width", "0%");
        });
    });
  
    function setupShare(btn, confirm) {
      $(btn).on('click', function () {
        navigator.clipboard.writeText(shareMessage).then(() => {
          fetch('/record_share', { method: 'POST' }).then(() => {
            $(confirm)
              .fadeIn()
              .delay(5000)
              .fadeOut(() => {
                window.location.href = '/quiz?bonus=1';
              });
          });
        });
      });
    }
  
    setupShare('#share-btn', '#share-confirm');
    setupShare('#share-btn-lb', '#share-confirm-lb');
  
    const $scoreLine = $('.score-line');
    const $resultsShare = $('#results-share');
    const $viewLink = $('#view-leaderboard');
  
    $('#view-leaderboard').on('click', function (e) {
      e.preventDefault();
      const $cards = $('#results-cards .result-card');
      $cards.each(function () {
        this.offsetWidth; // reflow
        $(this).addClass('reverse');
      });
      setTimeout(() => {
        $('#results-cards').hide();
        $scoreLine.hide();
        $resultsShare.hide();
        $viewLink.hide();
        $('#results-leaderboard').fadeIn();
        $cards.removeClass('reverse');
      }, 400);
    });
  
    $('#back-answers').on('click', function (e) {
      e.preventDefault();
      $('#results-leaderboard').fadeOut(200, function () {
        const $wrap = $('#results-cards');
        const $cards = $wrap.find('.result-card');
        $wrap.show();
        $scoreLine.show();
        $resultsShare.show();
        $viewLink.show();
        $cards.each(function (i) {
          const delay = i * 0.2;
          const infoDelay = delay + 0.4;
          $(this).css('animation', `pack-drop 0.3s ease forwards ${delay}s`);
          $(this).find('.result-info').css('animation', `pulse-in 0.4s ease forwards ${infoDelay}s`);
        });
      });
    });

    $('#open-archive').on('click', function (e) {
      e.preventDefault();
      if (!isAuthenticated) {
        window.location.href = loginUrl;
        return;
      }

      $('#archive-modal').fadeIn();
    });

    $('#close-archive').on('click', function (e) {
      e.preventDefault();
      $('#archive-modal').fadeOut();
    });
  });
