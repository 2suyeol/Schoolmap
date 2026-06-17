/* =========================================================================
   data.js — 이 파일만 고치면 지역과 학교를 추가/수정할 수 있어요.
   =========================================================================

   [지역 추가/수정]  REGIONS 에 한 줄 추가:
     키: { name:"표시이름", center:[위도, 경도], zoom: 숫자 }
     center 는 그 지역을 선택했을 때 지도가 이동할 중심 좌표예요.

   [학교 추가/수정]  SCHOOLS 배열에 객체 하나를 추가:
     - name        학교 이름 (지도에 표시됨, 검색 대상)
     - region      위 REGIONS 의 "키" 와 똑같이 적어야 분류돼요
     - lat, lng    위도/경도 (정확한 좌표가 중요해요 — 아래 안내 참고)
     - 나머지 항목  설명창에 보여줄 부가 정보 (없으면 빈 칸 "" 로 두거나 생략)

   ※ 정확한 좌표 구하는 법
     · 구글 지도에서 학교를 검색 → 마커 우클릭 → 맨 위 좌표 숫자 클릭하면 복사돼요.
       (앞이 위도 lat, 뒤가 경도 lng)
     · 전국 학교 데이터는 공공데이터포털(data.go.kr)에서 "학교 기본정보"로 받을 수 있어요.

   ※ 아래 학교들은 사용법을 보여주기 위한 "예시"라서 좌표가 정확하지 않을 수 있어요.
     실제 데이터로 바꿔서 쓰세요.
   ========================================================================= */

// 전국이 한눈에 보이는 기본 화면 (왼쪽 "전체"를 눌렀을 때)
const KOREA_VIEW = { center: [36.5, 127.8], zoom: 7 };

// 시/도 목록 — 전국 17개를 미리 넣어뒀어요. 학교가 없는 지역은 그냥 비어 있게 보여요.
const REGIONS = {
  seoul:    { name: "서울특별시",   center: [37.5665, 126.9780], zoom: 12 },
  busan:    { name: "부산광역시",   center: [35.1796, 129.0756], zoom: 12 },
  daegu:    { name: "대구광역시",   center: [35.8714, 128.6014], zoom: 12 },
  incheon:  { name: "인천광역시",   center: [37.4563, 126.7052], zoom: 12 },
  gwangju:  { name: "광주광역시",   center: [35.1595, 126.8526], zoom: 12 },
  daejeon:  { name: "대전광역시",   center: [36.3504, 127.3845], zoom: 12 },
  ulsan:    { name: "울산광역시",   center: [35.5384, 129.3114], zoom: 12 },
  sejong:   { name: "세종특별자치시", center: [36.4801, 127.2890], zoom: 12 },
  gyeonggi: { name: "경기도",       center: [37.2750, 127.0090], zoom: 10 },
  gangwon:  { name: "강원특별자치도", center: [37.8228, 128.1555], zoom: 9 },
  chungbuk: { name: "충청북도",     center: [36.8000, 127.7000], zoom: 9 },
  chungnam: { name: "충청남도",     center: [36.6588, 126.6728], zoom: 9 },
  jeonbuk:  { name: "전북특별자치도", center: [35.8200, 127.1088], zoom: 9 },
  jeonnam:  { name: "전라남도",     center: [34.8679, 126.9910], zoom: 9 },
  gyeongbuk:{ name: "경상북도",     center: [36.4919, 128.8889], zoom: 9 },
  gyeongnam:{ name: "경상남도",     center: [35.2598, 128.6647], zoom: 9 },
  jeju:     { name: "제주특별자치도", center: [33.4890, 126.5300], zoom: 11 },
};

// 학교 목록 (예시 데이터 — 실제 값으로 교체하세요)
const SCHOOLS = [
  {
    name: "서울고등학교",
    region: "seoul",
    lat: 37.4838, lng: 127.0136,
    type: "공립 · 일반계",
    address: "서울특별시 서초구 서초중앙로 22",
    founded: "1946년",
    students: "약 900명",
    homepage: "http://seoul.sen.hs.kr",
    description: "서초구에 위치한 공립 일반계 고등학교로, 오랜 역사를 가진 남자고등학교입니다.",
  },
  {
    name: "휘문고등학교",
    region: "seoul",
    lat: 37.4996, lng: 127.0606,
    type: "사립 · 자율형사립고",
    address: "서울특별시 강남구 대치동",
    founded: "1906년",
    students: "약 1,000명",
    homepage: "http://www.whimoon.hs.kr",
    description: "강남구 대치동에 위치한 자율형 사립 고등학교입니다.",
  },
  {
    name: "중동고등학교",
    region: "seoul",
    lat: 37.4925, lng: 127.0856,
    type: "사립 · 자율형사립고",
    address: "서울특별시 강남구 일원로",
    founded: "1906년",
    students: "약 1,100명",
    homepage: "http://www.joongdong.hs.kr",
    description: "강남구에 위치한 자율형 사립 고등학교입니다.",
  },
  {
    name: "부산고등학교",
    region: "busan",
    lat: 35.1882, lng: 129.0820,
    type: "공립 · 일반계",
    address: "부산광역시 연제구",
    founded: "1913년",
    students: "약 700명",
    homepage: "",
    description: "부산을 대표하는 공립 일반계 고등학교 중 하나입니다.",
  },
  {
    name: "수원고등학교",
    region: "gyeonggi",
    lat: 37.2800, lng: 127.0190,
    type: "공립 · 일반계",
    address: "경기도 수원시 팔달구",
    founded: "1956년",
    students: "약 800명",
    homepage: "",
    description: "수원시에 위치한 공립 일반계 고등학교입니다.",
  },
];
