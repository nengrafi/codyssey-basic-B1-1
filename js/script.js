"use strict";

/* 1. 설정: 이 값만 본인 GitHub 아이디로 교체한다. 토큰은 넣지 않는다. */
const GITHUB_USERNAME = "nengrafi";
const HEADER_SCROLL = 60;
const TOP_SCROLL = 300;
const REVEAL_THRESHOLD = 0.2;

/* 2. DOM 선택: #은 id 선택자, querySelectorAll은 여러 요소를 반환한다. */
const menuButton = document.querySelector("#menu-toggle");
const nav = document.querySelector("#site-nav");
const navLinks = document.querySelectorAll("#site-nav a");
const header = document.querySelector("header");
const themeButton = document.querySelector("#theme-toggle");
const topButton = document.querySelector("#scroll-top");
const projectList = document.querySelector("#project-list");
const projectsStatus = document.querySelector("#projects-status");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const messageCount = document.querySelector("#message-count");
const fields = {
  name: document.querySelector("#name"),
  email: document.querySelector("#email"),
  message: document.querySelector("#message")
};

/* 3. 상태와 렌더링 분리: 이벤트 → state 변경 → render 함수 호출.
   DOM에 보이는 값을 상태의 유일한 저장소로 삼지 않는다. */
const state = {
  menuOpen: false,
  theme: "light",
  projects: { status: "idle", items: [], error: "" },
  form: { values: { name: "", email: "", message: "" }, errors: {}, status: "" }
};
// 저장소 접근이 제한된 브라우저에서도 나머지 기능은 계속 실행한다.
try {
  state.theme = localStorage.getItem("theme") === "dark" ? "dark" : "light";
} catch (error) {
  console.warn("저장된 테마를 읽지 못해 기본 테마를 사용합니다.", error);
  state.theme = "light";
}

const renderMenu = () => {
  // 두 번째 인수가 true이면 추가, false이면 제거한다.
  nav.classList.toggle("active", state.menuOpen);
  menuButton.textContent = state.menuOpen ? "✕" : "☰";
  menuButton.setAttribute("aria-expanded", String(state.menuOpen));
  menuButton.setAttribute("aria-label", state.menuOpen ? "메뉴 닫기" : "메뉴 열기");
};
menuButton.addEventListener("click", () => {
  state.menuOpen = !state.menuOpen;
  renderMenu();
});
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    state.menuOpen = false;
    renderMenu();
    // 모바일 메뉴를 숨긴 뒤 포커스도 도착 섹션으로 옮긴다.
    const section = document.querySelector(link.getAttribute("href"));
    section.setAttribute("tabindex", "-1");
    section.focus({ preventScroll: true });
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.menuOpen) {
    state.menuOpen = false;
    renderMenu();
    menuButton.focus();
  }
});
// 모바일에서 연 메뉴 상태가 데스크톱 전환 후 남지 않게 한다.
window.matchMedia("(min-width: 768px)").addEventListener("change", () => {
  state.menuOpen = false;
  renderMenu();
});

const renderTheme = () => {
  document.documentElement.dataset.theme = state.theme;
  const isDark = state.theme === "dark";
  themeButton.textContent = isDark ? "☀" : "☾";
  themeButton.setAttribute("aria-label", isDark ? "라이트 모드 켜기" : "다크 모드 켜기");
  themeButton.setAttribute("aria-pressed", String(isDark));
};
themeButton.addEventListener("click", () => {
  state.theme = state.theme === "light" ? "dark" : "light";
  try {
    localStorage.setItem("theme", state.theme);
  } catch (error) {
    console.warn("테마 설정을 저장하지 못했습니다. 현재 페이지에서만 적용됩니다.", error);
  }
  renderTheme();
});
renderTheme();

/* 4. 스크롤 처리는 한 곳에서 관리한다. 새로고침 직후 상태도 반영한다. */
const renderScroll = () => {
  header.classList.toggle("scrolled", window.scrollY >= HEADER_SCROLL);
  topButton.hidden = window.scrollY < TOP_SCROLL;
};
window.addEventListener("scroll", renderScroll, { passive: true });
renderScroll();
topButton.addEventListener("click", () => {
  document.querySelector("#main").focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
});

/* 5. 폼: novalidate를 JS에서 켜서 오류를 입력창 근처에 직접 표시한다.
   required/type=email은 유지하며, validity.typeMismatch로 브라우저의 이메일 검사 사용. */
contactForm.noValidate = true;
const validateField = (key) => {
  const value = state.form.values[key].trim();
  if (!value) return { name: "이름을 입력해 주세요.", email: "이메일을 입력해 주세요.", message: "메시지를 입력해 주세요." }[key];
  if (key === "email" && fields.email.validity.typeMismatch) return "올바른 이메일 형식으로 입력해 주세요.";
  return "";
};
const renderForm = () => {
  Object.entries(fields).forEach(([key, field]) => {
    // [key, field]는 배열 구조분해 할당이다.
    const error = state.form.errors[key] || "";
    document.querySelector(`#${key}-error`).textContent = error;
    field.setAttribute("aria-invalid", String(Boolean(error)));
  });
  messageCount.textContent = `${state.form.values.message.length}자 입력됨`;
  formStatus.textContent = state.form.status;
};
Object.entries(fields).forEach(([key, field]) => {
  field.addEventListener("input", () => {
    state.form.values[key] = field.value;
    state.form.errors[key] = validateField(key);
    state.form.status = "";
    renderForm();
  });
});
contactForm.addEventListener("submit", (event) => {
  event.preventDefault(); // 기본 제출(페이지 이동)을 막는다.
  Object.entries(fields).forEach(([key, field]) => {
    state.form.values[key] = field.value; // 자동완성으로 들어온 값도 다시 읽는다.
    state.form.errors[key] = validateField(key);
  });
  const firstInvalid = Object.keys(fields).find((key) => state.form.errors[key]);
  state.form.status = firstInvalid
    ? "입력 내용을 확인해 주세요."
    : `${state.form.values.name.trim()}님, 입력 확인이 완료되었습니다. 실제 전송 기능은 아직 연결되지 않았습니다.`;
  renderForm();
  if (firstInvalid) fields[firstInvalid].focus();
});

/* 6. API 문자열을 innerHTML에 넣기 전 HTML 특수문자를 이스케이프한다.
   외부 데이터의 <script> 같은 문자열이 HTML로 실행되지 않게 한다. */
const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[char]);

const renderProjects = () => {
  // 객체 구조분해: state.projects에서 필요한 속성만 꺼낸다.
  const { status, items, error } = state.projects;
  projectList.setAttribute("aria-busy", String(status === "loading"));
  projectList.innerHTML = "";
  if (status === "loading") {
    projectsStatus.textContent = "프로젝트 로딩 중...";
  } else if (status === "error") {
    projectsStatus.textContent = `프로젝트를 불러올 수 없습니다. ${error}`;
    projectList.innerHTML = '<button class="button" id="retry-projects" type="button">재시도</button>';
  } else if (status === "empty") {
    projectsStatus.textContent = "표시할 프로젝트가 없습니다.";
  } else if (status === "success") {
    projectsStatus.textContent = `${items.length}개의 프로젝트를 표시합니다.`;
    // map: 각 객체를 카드 문자열로 변환, join: 배열을 하나의 HTML 문자열로 결합.
    projectList.innerHTML = items.map(({ name, description, language, stargazers_count }) => {
      // URL을 신뢰 가능한 GitHub origin에서 직접 구성한다.
      const url = `https://github.com/${encodeURIComponent(GITHUB_USERNAME)}/${encodeURIComponent(name)}`;
      return `<article class="project-card">
        <h3>${escapeHTML(name)}</h3>
        <p>${escapeHTML(description || "등록된 프로젝트 설명이 없습니다.")}</p>
        <p>${escapeHTML(language || "언어 미지정")} · ★ ${escapeHTML(stargazers_count)}</p>
        <a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">저장소 보기 ↗<span class="sr-only">: ${escapeHTML(name)}</span></a>
      </article>`;
    }).join("");
  }
};

const loadProjects = async () => {
  if (state.projects.status === "loading") return; // 중복 요청 방지
  state.projects = { status: "loading", items: [], error: "" };
  renderProjects();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    if (GITHUB_USERNAME === "YOUR_GITHUB_USERNAME") {
      throw new Error("js/script.js의 GITHUB_USERNAME을 본인 아이디로 변경해 주세요.");
    }
    // fetch는 HTTP 404/403에서 자동으로 예외를 던지지 않으므로 ok를 직접 확인한다.
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?sort=updated&per_page=100`, {
      headers: { Accept: "application/vnd.github+json" }, signal: controller.signal
    });
    if (!response.ok) {
      if (response.status === 404) throw new Error("GitHub 아이디를 확인해 주세요.");
      if (response.status === 403 || response.status === 429) throw new Error("API 접근 또는 요청 횟수가 제한되었습니다. 잠시 후 다시 시도해 주세요.");
      throw new Error(`HTTP ${response.status} 오류가 발생했습니다.`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("서버 응답 형식이 올바르지 않습니다.");
    // filter: fork 저장소 제외. 최신 100개 중 원본 저장소 최대 6개를 보여준다.
    const items = data.filter(({ fork }) => !fork).slice(0, 6);
    state.projects = { status: items.length ? "success" : "empty", items, error: "" };
  } catch (error) {
    state.projects = { status: "error", items: [], error: error.name === "AbortError" ? "요청 시간이 초과되었습니다. 다시 시도해 주세요." : error.message };
  } finally {
    window.clearTimeout(timeout);
    renderProjects();
  }
};
// 이벤트 위임: 나중에 생성되는 재시도 버튼도 부모의 click 이벤트로 처리한다.
projectList.addEventListener("click", (event) => {
  if (event.target.closest("#retry-projects")) loadProjects();
});
document.querySelector("#projects-note").textContent = "최근 업데이트된 공개 저장소 중 fork를 제외하고 최대 6개를 표시합니다.";
if (GITHUB_USERNAME !== "YOUR_GITHUB_USERNAME") {
  document.querySelector("#github-link").href = `https://github.com/${encodeURIComponent(GITHUB_USERNAME)}`;
}

/* 7. IntersectionObserver: 요소가 화면에 들어오면 visible 클래스를 추가한다.
   긴 section은 20%가 화면 높이보다 클 수 있어, 작은 자식 단위를 관찰한다. */
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // 한 번 나타난 요소는 재실행하지 않는다.
      }
    });
  }, { threshold: REVEAL_THRESHOLD });
  document.querySelectorAll("main > section > h2, .about-content img, .skill-list li").forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}
document.querySelector("#year").textContent = new Date().getFullYear();
renderMenu();
renderForm();
loadProjects();
