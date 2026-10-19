# 나를 소개하는 포트폴리오

순수 HTML, CSS, JavaScript로 만든 반응형 개인 포트폴리오입니다. 시맨틱 HTML로 페이지를 구성하고, CSS Flexbox/Grid로 다양한 화면에 맞는 레이아웃을 만들었습니다. JavaScript는 메뉴, 테마, 문의 폼을 제어하며 GitHub 공개 저장소 API에서 프로젝트를 가져옵니다.

이 프로젝트의 목적은 화면을 만드는 것에 그치지 않고 **사용자 이벤트 → 상태 변경 → DOM 업데이트 → 화면 변화**의 흐름을 직접 구현하고 설명하는 것입니다. 구현을 진행한 순서와 기능별 확인 방법은 아래와 같습니다.

## 프로젝트 진행 과정

1. **콘텐츠와 문서 구조 설계:** 포트폴리오에 필요한 Hero, About, Skills, Projects, Contact, Footer 영역을 나누고, 각 영역을 시맨틱 HTML 요소와 제목으로 표현했습니다.
2. **기본 스타일과 반응형 레이아웃 작성:** 색상·간격은 CSS 변수로 관리하고, 작은 화면을 기본으로 만든 뒤 768px과 1024px에서 레이아웃을 확장했습니다. 헤더와 기술 목록에는 Flexbox, 프로젝트 카드에는 Grid를 사용했습니다.
3. **사용자 인터랙션 연결:** `addEventListener`로 메뉴, 테마, 스크롤, 입력, 제출 이벤트를 처리했습니다. UI에 필요한 값은 JavaScript 상태에 두고 `render...()` 함수가 상태를 DOM에 반영하도록 구성했습니다.
4. **GitHub API와 상태별 UI 구현:** `fetch`와 `async/await`로 공개 저장소를 불러오고 로딩, 성공, 오류, 빈 결과를 구분했습니다. 오류 상태에는 재시도 버튼을 표시합니다.
5. **폼과 접근성 보완:** 입력값과 이메일 형식을 확인하고, 오류를 필드 가까이에 표시합니다. 키보드 포커스, ARIA 상태, 움직임 감소 설정도 반영했습니다.
6. **로컬 확인 및 배포 준비:** Live Server로 실행한 다음 여러 화면 크기와 테마, 폼/API 상태를 확인합니다. GitHub Pages는 아래 절차로 직접 활성화한 뒤 실제 URL과 스크린샷을 기록합니다.

개념 설명과 발표할 때 참고할 코드 흐름은 [tech.md](./tech.md)에 정리했습니다.

## 실행하기

1. 이 저장소를 내려받아 VS Code에서 엽니다.
2. VS Code 확장에서 **Live Server**를 설치합니다.
3. `index.html`을 우클릭하고 **Open with Live Server**를 선택합니다.

빌드 도구나 외부 프론트엔드 라이브러리는 사용하지 않습니다. 파일을 직접 브라우저에서 여는 것보다 Live Server 같은 로컬 웹 서버를 사용하면 `fetch`와 경로를 안정적으로 확인할 수 있습니다.

## 파일 구성

```text
.
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   └── profile.jpg
├── README.md
└── tech.md
```

## 내 정보로 수정하기

- `js/script.js`의 `GITHUB_USERNAME`은 현재 `nengrafi`로 설정되어 있습니다. 다른 계정을 사용할 경우 본인의 GitHub 아이디로 바꾸세요. 토큰이나 비밀번호는 브라우저 코드에 넣지 않습니다.
- `index.html`의 이름, 소개, 관심 분야, 기술 목록과 저작권 표시를 본인 정보로 수정하세요.
- 프로필 이미지를 교체하려면 이미지를 `images/`에 추가하고 `<img>`의 `src`와 의미에 맞는 `alt` 설명을 수정하세요.
- 문의 폼은 입력값을 검사하고 성공 안내를 보여주는 학습용 폼입니다. 서버나 이메일 전송 서비스에는 연결되어 있지 않으므로 실제 메시지는 전송되지 않습니다.

## 구현 기능

- 모바일 내비게이션과 앵커 부드러운 스크롤
- 스크롤 60px 이후 헤더 스타일 변경, 300px 이후 맨 위 버튼 표시
- 다크 모드 및 `localStorage`를 이용한 테마 유지
- Intersection Observer를 이용한 콘텐츠 등장 효과 (`threshold: 0.2`)
- 이름·이메일·메시지 필수값 검사와 이메일 형식 검사
- GitHub 공개 저장소 API 연동: fork 저장소를 제외한 최근 저장소 최대 6개 및 로딩·성공·오류·빈 상태 표시
- 768px, 1024px 브레이크포인트를 사용하는 모바일 퍼스트 반응형 레이아웃

## 사용 기술

- HTML5: 시맨틱 구조, 폼, 접근성 속성
- CSS3: CSS 변수, Flexbox, Grid, 미디어 쿼리, 애니메이션
- JavaScript (ES6+): DOM 이벤트, 상태와 렌더 함수, 배열 메서드, `fetch`/`async`/`await`
- GitHub REST API: 공개 저장소 목록 조회
- 개발/배포: VS Code Live Server, GitHub Pages

## GitHub Pages 배포

**GitHub 저장소 URL:** [https://github.com/nengrafi/codyssey-basic-B1-1](https://github.com/nengrafi/codyssey-basic-B1-1)

1. 저장소 최상위에 `index.html`이 있는지 확인하고 GitHub에 푸시합니다.
2. 저장소의 **Settings → Pages**로 이동합니다.
3. **Build and deployment → Deploy from a branch**를 선택합니다.
4. 기본 브랜치(예: `main`)와 폴더(`/ (root)`)를 선택하고 저장합니다.
5. Pages 설정에 표시되는 URL을 열어 페이지, API, 모바일 메뉴, 폼, 테마를 확인합니다.
6. 아래 배포 URL을 실제 Pages 주소로 바꾸고 스크린샷을 추가합니다.

**배포 URL:** 아직 확인되지 않았습니다. Pages를 활성화한 뒤 표시되는 실제 URL을 여기에 적으세요. 프로젝트 사이트는 일반적으로 `https://<아이디>.github.io/<저장소명>/` 형식입니다.

## 스크린샷

아직 스크린샷이 추가되지 않았습니다. 배포 후 데스크톱, 모바일, 다크 모드에서 실제 화면을 캡처해 아래 파일로 `images/` 폴더에 저장하면 미리보기가 표시됩니다.

```markdown
![데스크톱 화면](images/screenshot-desktop.png)
![모바일 화면](images/screenshot-mobile.png)
![다크 모드 화면](images/screenshot-dark.png)
```