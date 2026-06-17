/* =========================================================================
   app.js — 지도, 지역 선택, 검색, 학교 설명창 동작
   보통은 이 파일을 고칠 필요가 없어요. 학교/지역은 data.js 에서 관리하세요.
   ========================================================================= */

// 움직임을 줄이는 설정을 켠 사용자는 애니메이션 시간을 0으로
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const FLY = reduceMotion ? 0 : 0.8;

let map;
let activeRegion = "all";        // 처음 선택된 지역 ("all" = 전체)
let markers = [];                // { marker, index } 목록
let selectedIndex = null;        // 현재 클릭된 학교 인덱스

/* ---------- 지도 만들기 ---------- */
function initMap() {
  // 우리나라를 벗어나지 못하게 지도 영역을 한반도 주변으로 제한
  const KOREA_BOUNDS = L.latLngBounds(
    [33.0, 124.0],   // 남서쪽 끝 (제주 아래 ~ 서해 백령도)
    [38.9, 132.2]    // 북동쪽 끝 (강원 북부 ~ 독도)
  );

  // 처음 들어왔을 때 보여줄 화면(카메라)만 경기도로.
  // 선택은 "전체"라서 모든 지역 학교가 다 보여요. 카메라 위치만 바꾸려면 아래 한 줄을 고치세요.
  const start = REGIONS.gyeonggi;   // 예: REGIONS.seoul 로 바꾸면 서울로 열려요

  map = L.map("map", {
    zoomControl: true,
    attributionControl: true,
    maxBounds: KOREA_BOUNDS,   // 이 영역 밖으로는 못 나가게
    maxBoundsViscosity: 1.0,   // 경계를 단단한 벽처럼 고정 (1.0 = 완전 고정)
    minZoom: 7,                // 너무 축소해서 다른 나라가 보이지 않게
  }).setView(start.center, start.zoom);

  // 전 세계에서 가장 안정적으로 열리는 OSM 기본 타일
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
    bounds: KOREA_BOUNDS,      // 한국 밖 타일은 불러오지 않음
  }).addTo(map);

  // 레이아웃이 잡힌 뒤 지도 크기를 다시 계산 (간혹 첫 렌더에서 회색으로 보이는 문제 방지)
  setTimeout(() => map.invalidateSize(), 200);
}

/* ---------- 왼쪽 지역 목록 ---------- */
function countByRegion(key) {
  return SCHOOLS.filter((s) => s.region === key).length;
}

function renderRegionList() {
  const list = document.getElementById("region-list");
  list.innerHTML = "";

  // "전체" 항목
  list.appendChild(regionItem("all", "전체", SCHOOLS.length));

  // 시/도 항목들
  Object.keys(REGIONS).forEach((key) => {
    list.appendChild(regionItem(key, REGIONS[key].name, countByRegion(key)));
  });
}

function regionItem(key, label, count) {
  const li = document.createElement("li");
  const btn = document.createElement("button");
  btn.className = "region-item" + (key === activeRegion ? " is-active" : "");
  btn.dataset.key = key;
  btn.innerHTML = `<span class="region-name">${label}</span>
                   <span class="region-count">${count}</span>`;
  btn.addEventListener("click", () => selectRegion(key));
  li.appendChild(btn);
  return li;
}

function updateRegionActiveClass() {
  document.querySelectorAll(".region-item").forEach((b) => {
    b.classList.toggle("is-active", b.dataset.key === activeRegion);
  });
}

/* ---------- 지역 선택 ---------- */
function selectRegion(key, { fly = true } = {}) {
  activeRegion = key;
  updateRegionActiveClass();
  renderMarkers();
  closeInfo();

  if (fly) {
    const view = key === "all" ? KOREA_VIEW : REGIONS[key];
    map.flyTo(view.center, view.zoom, { duration: FLY });
  }
  // 모바일에서 지역을 고르면 사이드바를 닫아 지도를 보여줌
  closeSidebarOnMobile();
}

/* ---------- 마커(학교 아이콘) 그리기 ---------- */
function buildIcon(name, active) {
  return L.divIcon({
    className: "school-marker" + (active ? " is-active" : ""),
    html: `<span class="pin"></span><span class="label">${name}</span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8], // 핀의 가운데가 실제 좌표를 가리키게
  });
}

function renderMarkers() {
  markers.forEach((m) => map.removeLayer(m.marker));
  markers = [];

  SCHOOLS.forEach((s, i) => {
    if (activeRegion !== "all" && s.region !== activeRegion) return;

    const marker = L.marker([s.lat, s.lng], {
      icon: buildIcon(s.name, i === selectedIndex),
      title: s.name,
    });
    marker.on("click", () => selectSchool(i));
    marker.addTo(map);
    markers.push({ marker, index: i });
  });
}

/* ---------- 학교 선택 → 설명창 열기 ---------- */
function selectSchool(i) {
  const s = SCHOOLS[i];

  // 다른 지역의 학교를 검색으로 골랐다면 그 지역으로 맞춰줌
  if (activeRegion !== "all" && s.region !== activeRegion) {
    activeRegion = s.region;
    updateRegionActiveClass();
  }

  selectedIndex = i;
  renderMarkers();
  map.flyTo([s.lat, s.lng], 16, { duration: FLY });
  openInfo(s);
}

/* ---------- 설명창(정보 카드) ---------- */
function row(label, value) {
  if (!value) return "";
  return `<div class="info-row"><dt>${label}</dt><dd>${value}</dd></div>`;
}

function openInfo(s) {
  const panel = document.getElementById("info-panel");
  const homepage = s.homepage
    ? `<a class="info-link" href="${s.homepage}" target="_blank" rel="noopener">홈페이지 바로가기 ↗</a>`
    : "";

  panel.innerHTML = `
    <button class="info-close" aria-label="닫기" onclick="closeInfo()">✕</button>
    <p class="info-eyebrow">${REGIONS[s.region] ? REGIONS[s.region].name : ""}</p>
    <h2 class="info-title">${s.name}</h2>
    ${s.type ? `<p class="info-type">${s.type}</p>` : ""}
    ${s.description ? `<p class="info-desc">${s.description}</p>` : ""}
    <dl class="info-grid">
      ${row("개교", s.founded)}
      ${row("학생 수", s.students)}
      ${row("주소", s.address)}
    </dl>
    ${homepage}
  `;
  panel.classList.add("is-open");
}

function closeInfo() {
  const panel = document.getElementById("info-panel");
  panel.classList.remove("is-open");
  if (selectedIndex !== null) {
    selectedIndex = null;
    renderMarkers();
  }
}
window.closeInfo = closeInfo; // 버튼 onclick 에서 호출하려고 전역에 노출

/* ---------- 검색 ---------- */
function initSearch() {
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");

  function clearResults() {
    results.innerHTML = "";
    results.classList.remove("is-open");
  }

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) return clearResults();

    const found = SCHOOLS
      .map((s, i) => ({ s, i }))
      .filter((o) => o.s.name.toLowerCase().includes(q))
      .slice(0, 8);

    if (found.length === 0) {
      results.innerHTML = `<li class="search-empty">검색 결과가 없어요</li>`;
      results.classList.add("is-open");
      return;
    }

    results.innerHTML = found
      .map(
        (o) => `<li><button data-i="${o.i}">
          <span class="r-name">${o.s.name}</span>
          <span class="r-region">${REGIONS[o.s.region] ? REGIONS[o.s.region].name : ""}</span>
        </button></li>`
      )
      .join("");
    results.classList.add("is-open");

    results.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => {
        const i = Number(b.dataset.i);
        input.value = SCHOOLS[i].name;
        clearResults();
        selectSchool(i);
      });
    });
  });

  // 바깥을 클릭하면 결과 목록 닫기
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search")) clearResults();
  });
}

/* ---------- 모바일 사이드바 토글 ---------- */
function initSidebarToggle() {
  const toggle = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  toggle.addEventListener("click", () => sidebar.classList.toggle("is-open"));
}
function closeSidebarOnMobile() {
  if (window.matchMedia("(max-width: 720px)").matches) {
    document.getElementById("sidebar").classList.remove("is-open");
  }
}

/* ---------- 지도 라이브러리 로드 실패 시 안내 ---------- */
function showMapError(message) {
  const el = document.getElementById("map");
  el.innerHTML =
    `<div style="display:flex;align-items:center;justify-content:center;height:100%;
                 padding:24px;text-align:center;color:#707d92;font-size:14px;line-height:1.6">
       <div>지도를 불러오지 못했어요.<br>${message}</div>
     </div>`;
}

/* ---------- 시작 ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // 지도와 상관없이 항상 동작해야 하는 것들 먼저
  renderRegionList();
  initSearch();
  initSidebarToggle();

  // 지도는 라이브러리(Leaflet)가 있어야 함 — 실패해도 위 기능은 살아있게
  if (typeof L === "undefined") {
    showMapError("인터넷 연결을 확인하고 새로고침 해보세요. (Leaflet 로드 실패)");
    return;
  }
  try {
    initMap();
    renderMarkers();
  } catch (e) {
    showMapError("새로고침 해보세요.");
    console.error(e);
  }
});
