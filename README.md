# 고등학교 지도 (High School Map)

지역별로 고등학교를 찾아보고, 학교 아이콘을 클릭하면 간단한 설명과 정보를
한눈에 볼 수 있는 지도 사이트입니다. 서버 없이 깃허브 페이지로 무료 운영돼요.

## 주요 기능
- 왼쪽에서 지역을 선택하면 그 지역으로 지도가 이동하고 해당 학교만 표시
- 학교 이름으로 검색
- 학교 아이콘 아래에 이름 표시, 클릭하면 설명창(개교·학생수·주소·홈페이지 등)
- 휴대폰 화면 대응

## 폴더 구성
```
highschool-map/
├─ index.html        ← 페이지 뼈대 (보통 안 건드려도 됨)
├─ styles.css        ← 색/글꼴/디자인 (색은 맨 위 :root 변수만 바꾸면 됨)
└─ js/
   ├─ data.js        ← ★ 학교와 지역을 추가/수정하는 파일 (여기를 주로 편집)
   └─ app.js         ← 동작 로직 (보통 안 건드려도 됨)
```

## 학교 추가하는 법
`js/data.js` 파일을 열고 `SCHOOLS` 배열에 아래처럼 한 칸 추가하면 끝이에요.

```js
{
  name: "학교이름",
  region: "seoul",          // js/data.js 위쪽 REGIONS 의 "키" 와 똑같이
  lat: 37.1234, lng: 127.1234,
  type: "공립 · 일반계",
  address: "주소",
  founded: "0000년",
  students: "약 000명",
  homepage: "https://...",  // 없으면 ""
  description: "한 줄 설명",
},
```

**좌표(lat, lng) 구하기**
- 구글 지도에서 학교 검색 → 지점 우클릭 → 맨 위 좌표 숫자 클릭하면 복사돼요. (앞=위도 lat, 뒤=경도 lng)
- 전국 학교 데이터는 공공데이터포털(data.go.kr)에서 "학교 기본정보"로 받을 수 있어요.

> 지금 들어있는 학교들은 사용법 예시라 좌표가 정확하지 않을 수 있어요. 실제 값으로 교체하세요.

## 깃허브 페이지에 올리는 법
1. 깃허브에서 새 저장소(repository)를 만들어요. (예: `highschool-map`)
2. 이 폴더 안의 파일들(`index.html`, `styles.css`, `js/` 폴더)을 그 저장소에 업로드해요.
   - 웹에서 할 경우: 저장소 → **Add file → Upload files** → 드래그해서 올리고 **Commit**.
3. 저장소 → **Settings → Pages** 로 이동.
4. **Build and deployment** 의 Source 를 **Deploy from a branch** 로,
   Branch 를 **main / (root)** 으로 선택하고 **Save**.
5. 잠시 뒤 `https://(내아이디).github.io/highschool-map/` 주소로 사이트가 열려요.

## 색상 바꾸기
`styles.css` 맨 위 `:root` 의 변수만 고치면 전체 색이 바뀌어요.
```css
--ink:    #14253f;  /* 사이드바·글자 진한 남색 */
--accent: #e0992b;  /* 선택됐을 때 강조색 */
```

## 참고
- 지도는 Leaflet + OpenStreetMap(CARTO) 타일을 써서 API 키가 필요 없어요.
- 한국식 지도(카카오맵)로 바꾸고 싶다면 카카오 개발자 키 발급 후 교체할 수 있어요.
