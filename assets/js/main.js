/* 凤梨学姐新生指南 — 交互与动效
   1. 导航滚动收缩  2. 滚动显现（交错延迟）
   3. 跑马灯内容复制  4. 图片懒加载兜底 */

(function () {
  "use strict";

  /* 1. 导航栏滚动态 */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 40) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* 2. 滚动显现：IntersectionObserver + 同组元素交错延迟 */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    // 为同一父容器内的 reveal 元素自动设置递增延迟
    var groups = new Map();
    revealEls.forEach(function (el) {
      var p = el.parentElement;
      if (!groups.has(p)) groups.set(p, 0);
      var i = groups.get(p);
      if (!el.style.getPropertyValue("--d")) {
        el.style.setProperty("--d", (i % 6) * 0.08 + "s");
      }
      groups.set(p, i + 1);
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* 3. 跑马灯：内容复制一份实现无缝滚动 */
  var track = document.querySelector(".marquee-track");
  if (track) {
    track.innerHTML += track.innerHTML;
  }

  /* 4. 图片加载失败兜底：替换为纯色块 */
  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () {
      img.style.display = "none";
      if (img.parentElement) {
        img.parentElement.style.background =
          "linear-gradient(135deg,#DCE4D0 0%,#A9BC9D 100%)";
      }
    });
  });

  /* 5. 滚动水印：每个版块 3 条「财院凤梨学姐」跑马灯（内容层在水印之上） */
  var WM_TEXT = "财院凤梨学姐 ✦ 财院凤梨学姐 ✦ 财院凤梨学姐 ✦ 财院凤梨学姐 ✦ ";
  document.querySelectorAll("section").forEach(function (sec) {
    var wm = document.createElement("div");
    wm.className = "wm";
    wm.setAttribute("aria-hidden", "true");
    [12, 46, 80].forEach(function (top, i) {
      var row = document.createElement("div");
      row.className = "wm-row r" + (i + 1);
      row.style.top = top + "%";
      // 内容重复 3 遍，配合 translateX(-33.333%) 实现无缝滚动
      row.textContent = WM_TEXT + WM_TEXT + WM_TEXT;
      wm.appendChild(row);
    });
    sec.insertBefore(wm, sec.firstChild);
  });

  /* 6. 内容保护：防右键、防复制快捷键、防拖拽、防 DevTools 快捷键 */
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
  document.addEventListener("dragstart", function (e) {
    e.preventDefault();
  });
  document.addEventListener("copy", function (e) {
    if (window.__allowCopy) return; // 放行「复制微信号」按钮的程序化复制
    e.preventDefault();
  });

  /* 7. 复制微信号按钮 */
  var copyBtn = document.getElementById("copy-wx");
  if (copyBtn) {
    var WX_ID = "13645126083";
    var originalText = copyBtn.textContent;
    copyBtn.addEventListener("click", function () {
      var done = function () {
        copyBtn.textContent = "已复制 ✓ 去微信粘贴添加";
        copyBtn.classList.add("copied");
        setTimeout(function () {
          copyBtn.textContent = originalText;
          copyBtn.classList.remove("copied");
        }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(WX_ID).then(done).catch(function () {
          legacyCopy();
        });
      } else {
        legacyCopy();
      }
      function legacyCopy() {
        var ta = document.createElement("textarea");
        ta.value = WX_ID;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        window.__allowCopy = true;
        try { document.execCommand("copy"); } catch (err) { /* ignore */ }
        window.__allowCopy = false;
        document.body.removeChild(ta);
        done();
      }
    });
  }
  document.addEventListener("keydown", function (e) {
    var k = e.key.toLowerCase();
    if (
      e.key === "F12" ||
      (e.ctrlKey && ["u", "s", "p", "c", "x"].indexOf(k) !== -1) ||
      (e.ctrlKey && e.shiftKey && ["i", "j", "c", "k"].indexOf(k) !== -1)
    ) {
      e.preventDefault();
    }
  });
  console.log(
    "%c财院凤梨学姐%c 本站图文均为原创实拍，请勿盗用复刻。",
    "background:#1F3D2C;color:#F2F1E7;padding:4px 10px;border-radius:99px;font-weight:bold;",
    "color:#6B7F70;padding:4px;"
  );
})();
