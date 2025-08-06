# Movie Emotion Universe - Setup Guide

## 폴더 구조

```
cdp_final/
├── private/           # 민감한 정보 (Git에 커밋되지 않음)
│   ├── api-keys.js   # API 키들
│   └── config.js.backup
├── public/           # 공개 파일들
│   ├── movie.html    # 메인 애플리케이션
│   └── config.js     # 공개 설정
├── .gitignore        # Git 무시 파일 목록
└── SETUP.md         # 이 파일
```

## API 키 설정

1. `private/api-keys.js` 파일에서 API 키를 설정하세요:
   - TMDB API 키: [The Movie Database](https://www.themoviedb.org/settings/api)에서 발급
   - OpenAI API 키: [OpenAI Platform](https://platform.openai.com/api-keys)에서 발급

2. 파일 구조:
```javascript
export const API_KEYS = {
    TMDB: 'your_tmdb_api_key_here',
    OPENAI: 'your_openai_api_key_here'
};
```

## 보안 주의사항

- `private/` 폴더는 절대 Git에 커밋하지 마세요
- API 키를 코드에 직접 하드코딩하지 마세요
- `.gitignore` 파일이 제대로 설정되어 있는지 확인하세요

## 실행 방법

1. 로컬 서버 실행 (CORS 문제 해결을 위해):
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server 설치 필요)
npx http-server

# Live Server (VS Code 확장)
Live Server 확장 사용
```

2. 브라우저에서 `http://localhost:8000/public/movie.html` 접속

## 문제 해결

- **CORS 에러**: 로컬 서버를 통해 파일을 서빙해야 합니다
- **모듈 로드 에러**: 브라우저가 ES6 모듈을 지원하는지 확인하세요
- **API 키 에러**: `private/api-keys.js` 파일이 올바르게 설정되었는지 확인하세요
