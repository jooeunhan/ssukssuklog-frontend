# 🌱 쑥쑥로그 (SsukSsukLog) Backend

어린이집 교사를 위한 아동 건강 기록 및 관리 웹 서비스 **쑥쑥로그**의 프론트엔드 저장소입니다.

## 📌 프로젝트 소개

쑥쑥로그는 어린이집 교사가 아동의 건강 상태를 체계적으로 기록하고 관리할 수 있도록 지원하는 웹 서비스입니다.

아동별 기본 정보와 건강 기록을 관리하고, 향후 AI 기반 건강 기록 분석 및 보호자 안내 메시지 생성 기능을 연동하는 것을 목표로 합니다.

## 📂 프로젝트 구조

```text
ssukssuklog-frontend/
├── src/
│   ├── api/            # api 호출 함수 분리
│   │   ├── client.js
│   │   ├── children.js
│   │   └── health.js
│   │
│   ├── components/
│   │   ├── common/     # 공통 컴포넌트
│   │   │   ├── Header.jsx
│   │   │   └── Button.jsx
│   │   └── health/     # 건강 분석 페이지용 컴포넌트
│   │       ├── ChildProfile.jsx
│   │       ├── TemperatureChart.jsx
│   │       ├── AIAnalysisCard.jsx
│   │       └── HealthRecordList.jsx
│   │
│   ├── pages/          # 웹페이지 폴더
│   │   ├── HealthDashboard.jsx
│   │   └── HealthInput.jsx
│   │
│   ├── styles/         # 전역 스타일
│   │   └── GlobalStyle.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── .gitignore
├── package.json
└── vite.config.js
```

## 🚀 주요 기능

### 아동 건강 입력

### 건강 기록 관리

## 🔗 Backend Repository

https://github.com/jooeunhan/ssukssuklog-backend

---

본 프로젝트는 공학종합설계 졸업작품으로 개발 중입니다.
