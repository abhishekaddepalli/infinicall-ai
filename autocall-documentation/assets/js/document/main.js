(function ($) {
  "use strict";

  $(document).ready(function () {
    // Theme initialization
    let currentTheme = localStorage.getItem("theme");
    if (!currentTheme) {
      currentTheme = "light";
      localStorage.setItem("theme", "light");
    }

    if (currentTheme === "dark") {
      $("body").addClass("dark-only");
    } else {
      $("body").removeClass("dark-only");
    }

    const iconInterval = setInterval(() => {
      if ($(".mode i").length > 0) {
        if ($("body").hasClass("dark-only")) {
          $(".mode i").removeClass("fa-moon-o").addClass("fa-lightbulb-o");
          $(".mode").attr("title", "Light");
          $(".main-title img").attr("src", "assets/images/logo/side-logo.png");
          $("#nextjs-logo").css("filter", "invert(0)");
          $("#nodejs-logo").attr("src", "assets/images/nodejs.png");
          $("#mongodb-logo").attr("src", "assets/images/mongodb.png").css("height", "70px");
        } else {
          $(".mode i").removeClass("fa-lightbulb-o").addClass("fa-moon-o");
          $(".mode").attr("title", "Dark");
          $(".main-title img").attr("src", "assets/images/logo/side-logo.png");
          $("#nextjs-logo").css("filter", "invert(1)");
          $("#nodejs-logo").attr("src", "assets/images/Node.js_logo.png");
          $("#mongodb-logo").attr("src", "assets/images/MongoDB_Logo.png").css("height", "50px");
        }
        clearInterval(iconInterval);
      }
    }, 100);

    // Toggle theme and persist
    $(document).on("click", ".mode", function (e) {
      e.preventDefault();
      const isDark = !$("body").hasClass("dark-only");

      $(".mode i").toggleClass("fa-moon-o fa-lightbulb-o");
      $("body").toggleClass("dark-only");

      if (isDark) {
        $(".mode").attr("title", "Light");
        $(".main-title img").attr("src", "assets/images/logo/side-logo.png");
        $("#nextjs-logo").css("filter", "invert(0)");
        $("#nodejs-logo").attr("src", "assets/images/nodejs.png");
        $("#mongodb-logo").attr("src", "assets/images/mongodb.png").css("height", "125px");
      } else {
        $(".mode").attr("title", "Dark");
        $(".main-title img").attr("src", "assets/images/logo/side-logo.png");
        $("#nextjs-logo").css("filter", "invert(1)");
        $("#nodejs-logo").attr("src", "assets/images/Node.js_logo.png");
        $("#mongodb-logo").attr("src", "assets/images/MongoDB_Logo.png").css("height", "45px");
      }

      localStorage.setItem("theme", isDark ? "dark" : "light");
    });

    // Font size controls
    $(document).on("click", ".decrease", function (e) {
      e.preventDefault();
      $(".content").addClass("font-decrease").removeClass("font-increase");
    });

    $(document).on("click", ".increase", function (e) {
      e.preventDefault();
      $(".content").addClass("font-increase").removeClass("font-decrease");
    });

    $(document).on("click", ".reset", function (e) {
      e.preventDefault();
      $(".content").removeClass("font-decrease").removeClass("font-increase");
    });

    // Mobile sidebar toggle
    $(".toggle-sidebar, .sidebar-button").on("click", function () {
      $(".left-sidebar, .bg-overlay").addClass("show");
    });

    $(".sidebar-close, .button-close, .bg-overlay").on("click", function () {
      $(".left-sidebar, .bg-overlay").removeClass("show");
    });

    // Scroll to top
    $(window).on("scroll", function () {
      if ($(this).scrollTop() > 600) {
        $(".tap-top").fadeIn();
      } else {
        $(".tap-top").fadeOut();
      }
    });

    $(".tap-top").click(function () {
      $("html, body").animate({ scrollTop: 0 }, 600);
      return false;
    });

    // Sidebar active highlighting and menu state persistence
    function initSidebarActiveState() {
      if ($(".nav-sidebar a").length === 0) {
        setTimeout(initSidebarActiveState, 100);
        return;
      }

      const current = window.location.pathname.split("/").pop() || "index.html";

      $(".nav-sidebar a").each(function () {
        const link = $(this).attr("href");

        if (
          link &&
          link !== "#!" &&
          (current === link || (current === "" && link === "index.html"))
        ) {
          $(this).addClass("active");

          // Open parent menus recursively
          $(this)
            .parents("ul.sub-menu, ul.nested-sub-menu")
            .each(function () {
              $(this).css("display", "block");
              $(this).prev(".title").addClass("active");
              $(this)
                .prev(".title")
                .find(".nav-link i[class*='fa-angle-down']")
                .removeClass("fa-angle-down")
                .addClass("fa-angle-up");
              $(this).parent(".menu").addClass("active");
            });
        }
      });

      // Ensure feather icons are initialized after sidebar is populated
      if (typeof feather !== "undefined") {
        feather.replace();
      }
    }

    initSidebarActiveState();

    // Sidebar menu toggle logic (using event delegation for dynamically loaded sidebar)
    $(document).on("click", ".nav-sidebar .menu > .title", function (e) {
      const link = $(this).find("a").attr("href");

      // Only prevent default if it's a toggle link (href="#!" or empty)
      if (link === "#!" || !link || link === "javascript:void(0)") {
        e.preventDefault();
      } else {
        // If it's a real link, let it navigate
        return;
      }

      const parentItem = $(this).parent(".menu");
      const subMenu = parentItem.children(".sub-menu, .nested-sub-menu");

      const isNestedMenu = parentItem.closest("ul.sub-menu").length > 0;

      if (!isNestedMenu) {
        // Close other top-level menus
        $(".nav-sidebar > .menu")
          .not(parentItem)
          .removeClass("active")
          .children(".sub-menu")
          .stop(true, true)
          .slideUp(300);

        // Reset icon of other top level menus
        $(".nav-sidebar > .menu")
          .not(parentItem)
          .find("> .title .nav-link i.fa-angle-up")
          .removeClass("fa-angle-up")
          .addClass("fa-angle-down");
      } else {
        // Close sibling nested menus
        parentItem
          .siblings(".menu")
          .removeClass("active")
          .children(".nested-sub-menu")
          .stop(true, true)
          .slideUp(300);

        // Reset icon of sibling nested menus
        parentItem
          .siblings(".menu")
          .find("> .title .nav-link i.fa-angle-up")
          .removeClass("fa-angle-up")
          .addClass("fa-angle-down");
      }

      const icon = $(this).find(
        ".nav-link i.fa, .nav-link i[class*='fa-angle']",
      );

      // Toggle current menu
      if (parentItem.hasClass("active")) {
        parentItem.removeClass("active");
        subMenu.stop(true, true).slideUp(300);
        icon.removeClass("fa-angle-up").addClass("fa-angle-down");
      } else {
        parentItem.addClass("active");
        subMenu.stop(true, true).slideDown(300);
        icon.removeClass("fa-angle-down").addClass("fa-angle-up");
      }
    });

    // Ensure feather icons are initialized after any DOM changes if needed
    if (typeof feather !== "undefined") {
      feather.replace();
    }
  });
})(jQuery);
