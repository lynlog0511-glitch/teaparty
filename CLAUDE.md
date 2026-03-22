# Tea Party 사이트 리뉴얼 — Claude Code 마스터 프롬프트

## 너의 역할

너는 지금부터 Tea Party 프로젝트의 **프론트엔드 리드 개발자**야. 
Next.js + Supabase + Tailwind CSS 기반의 피지털(Phygital) 서비스 사이트를 리뉴얼한다.
**오늘 안에 끝내야 하니까 불필요한 설명 없이 코드만 짜라.**

## 기술 스택
- Next.js (App Router)
- Supabase (DB + Auth 없이 public 테이블)
- Tailwind CSS
- Framer Motion
- canvas-confetti
- lucide-react

## 프로젝트 배경

핸드메이드 토끼 모찌 키링(실물) + NFC 연동 행운 웹 서비스(디지털) 프로젝트다.
구매자가 키링을 사서 QR로 접속해 메시지를 등록하고, 수령자가 매일 NFC 태그로 366개의 행운 메시지를 하나씩 뽑는 서비스.

### 브랜드 스토리 (사이트에 반영할 것)

이 서비스의 핵심 메시지:
> "이 서비스는 내가 받고 싶어서 만든 거예요."

힘든 시간을 보내면서 "누군가 매일 나한테 괜찮아질 거야 한마디만 해줬으면" 하는 마음에서 시작된 프로젝트다.
매일 하나씩, 366번의 작은 행운과 응원. 1년 뒤에는 타임캡슐처럼 편지가 열린다.
지금 힘든 사람에게 건네는 선물.

## 현재 코드 상태

- `src/app/page.tsx` — 메인 페이지 (랜딩 + 운세 뽑기)
- `src/app/setup/[id]/page.tsx` — 메시지 등록 페이지
- `src/data/fortunes.ts` — 테마 메타 데이터 (5가지: pink, yellow, white, purple, soda)
- `src/utils/supabaseClient.ts` — Supabase 클라이언트

---

## 수정 작업 목록 (우선순위 순)

### 1. SVG 에셋 생성

`public/images/mochi/` 폴더에 5가지 테마 모찌 토끼를 SVG로 직접 그려줘.

**⚠️ 중요: 참고 일러스트가 있다.**
`public/images/reference.png` (또는 프로젝트 루트의 `일러스트2.png`)를 반드시 확인해라.
이 그림체를 최대한 따라서 SVG로 재현해야 한다.

**참고 일러스트 특징 (이걸 살려라):**
- 핑크색 토끼 얼굴이 모찌/떡처럼 납작하고 둥글다
- 귀가 위로 쫑긋 서있고, 귀 안쪽이 살짝 더 진한 핑크
- 눈은 작고 동그란 점 2개 (검정), 살짝 아래쪽에 위치
- 입은 아주 작은 'ᴗ' 또는 'w' 모양
- 이마에 초록색 하트 모양 잎사귀가 하나 달려있음
- 볼터치 있음 (연한 핑크 동그라미)
- 전체적으로 손그림 느낌, 약간 울퉁불퉁한 아웃라인
- 아웃라인은 다크 브라운/검정 계열
- 부드럽고 귀여운 느낌

**SVG 제작 시 주의:**
- 완벽한 원/도형보다 약간 불규칙한 패스를 써서 손그림 질감을 살려라
- stroke-linecap: round, stroke-linejoin: round 사용
- 사이즈: 200x200 viewBox

**색상별:**
- `pink.svg`: 핑크(#FFB5C5) 바디 + 초록(#90EE90) 잎
- `yellow.svg`: 연노랑(#FFF3B0) 바디 + 주황(#FFB347) 잎
- `white.svg`: 흰색(#FAFAFA) 바디 + 연핑크(#FFD1DC) 잎
- `purple.svg`: 연보라(#D8B5FF) 바디 + 진보라(#9B59B6) 잎
- `soda.svg`: 연하늘(#B5E8FF) 바디 + 민트(#7FDBCA) 잎

**추가로 Tea Party 텍스트 로고:**
- `public/images/logo.svg`로 생성
- Gaegu 폰트 느낌의 손글씨체 + 작은 주전자 또는 토끼 실루엣
- 메인 컬러: #5D4037

### 2. 이모지 → 일러스트 이미지 교체 시스템 구축

**목표:** 현재 사이트 전체에서 이모지(🌸🍊🥛🫐🥤🐰)를 사용하는 부분을 커스텀 SVG 이미지로 교체한다.

**작업:**
- `src/data/fortunes.ts`에서 각 테마에 `image` 필드를 추가한다
- 사이트 전체에서 이모지를 렌더링하는 부분을 `<Image>` 컴포넌트 또는 `<img>` 태그로 교체한다
- 이미지가 아직 없는 경우를 대비해 **fallback으로 기존 이모지**가 보이도록 한다

```typescript
// fortunes.ts 수정 예시
pink: {
  name: "벚꽃 모찌",
  color: "text-pink-600",
  bg: "bg-pink-50",
  border: "border-pink-200",
  icon: "🌸",           // fallback
  image: "/images/mochi/pink.svg",  // 추가
  desc: "연애운 & 설렘",
},
```

### 3. 랜딩 페이지 리뉴얼

**목표:** 현재 랜딩 페이지를 "판매를 위한 랜딩"으로 리뉴얼한다.

**현재 문제:**
- "구매하기" 버튼이 `alert('준비 중이에요!')` 로 되어있음
- 서비스가 뭔지 설명이 없음
- 이모지 떡칠로 바이브코딩 느낌

**수정 사항:**

**A. 히어로 섹션 (최상단)**
- Tea Party 로고 (logo.svg 사용)
- 메인 카피: "행운을 선물하세요"
- 서브 카피: "핸드메이드 모찌 키링에 NFC를 터치하면, 매일 새로운 행운이 찾아와요."
- [구매하기] 버튼 → 윗치폼 링크로 연결 (환경변수: NEXT_PUBLIC_WITCHFORM_URL)
- 버튼이 환경변수 비어있으면 "곧 오픈 예정" 텍스트로 대체

**B. 브랜드 스토리 섹션**
- 위의 브랜드 스토리를 감성적으로 보여주는 섹션
- 짧게: "이 서비스는 내가 받고 싶어서 만든 거예요." 를 중심으로
- 배경색 구분, 따옴표 스타일 등으로 감성 살리기

**C. 이용 방법 섹션 (3단계)**
```
어떻게 사용하나요?

Step 1: 모찌를 선물하며 마음을 담은 편지를 써요
Step 2: 받는 사람이 매일 NFC를 터치하면 행운 메시지가 나와요
Step 3: 366일 뒤, 타임캡슐이 열려요
```
- 각 스텝은 카드 형태로
- 아이콘은 lucide-react 사용 (이모지 X): PenLine, Sparkles, Mail 등

**D. 모찌 컬렉션 섹션**
- 현재 5가지 테마 그대로 유지
- 이모지 대신 SVG 이미지 사용 (위의 1번, 2번 작업 연동)
- "구매하기" 버튼 → `NEXT_PUBLIC_WITCHFORM_URL` 환경변수로 연결
- 버튼 텍스트: "주문하기"

**E. 하단 CTA**
```
"선물을 받으셨나요?"
"인형의 NFC를 터치하면 행운이 시작돼요!"
```

### 4. 운세 뽑기 페이지 (mode === 'fortune') 개선

- 이모지 → SVG 이미지 교체 (2번 작업 연동)
- 운세 카드 뒤집기 애니메이션은 유지
- "공유하기" 기능은 유지하되, 공유 텍스트에 사이트 URL 포함

### 5. 메시지 등록 페이지 (setup/[id]) 개선

- 이모지 → SVG 이미지 교체
- 기존 기능 유지

### 6. 환경변수 정리

`.env.local` 또는 `.env`에 추가할 변수:
```
NEXT_PUBLIC_SUPABASE_URL=기존값
NEXT_PUBLIC_SUPABASE_ANON_KEY=기존값
NEXT_PUBLIC_WITCHFORM_URL=윗치폼_주문서_링크
NEXT_PUBLIC_WITCHFORM_COMMISSION_URL=커미션_주문서_링크
NEXT_PUBLIC_SITE_URL=https://teaparty.vercel.app
```

### 7. LocalStorage 데이터 Supabase 백업 (시간 되면)

**현재 문제:** 운세 히스토리(`fortune_history_*`), 뽑은 운세 ID(`seen_ids_*`)가 전부 LocalStorage에만 저장됨. 브라우저 캐시 지우면 전부 날아감.

**최소한의 해결:**
- Supabase에 `fortune_progress` 테이블이 있다고 가정 (없으면 생성 SQL 안내)
  - `rabbit_id` (text, PK)
  - `theme` (text)
  - `seen_ids` (jsonb)
  - `fortune_history` (jsonb)
  - `updated_at` (timestamp)
- 운세를 뽑을 때마다 LocalStorage와 Supabase 양쪽에 저장
- 페이지 로드 시 LocalStorage가 비어있으면 Supabase에서 복구

**이건 시간이 되면 하고, 안 되면 스킵해도 된다.**

---

## 디자인 가이드라인

### 컬러
- 메인 브라운: `#5D4037` (텍스트, 헤더)
- 배경: `#FFFDF5` (따뜻한 크림)
- 포인트: 각 테마 컬러 (핑크, 옐로, 화이트, 퍼플, 스카이)

### 폰트
- Gaegu (구글 폰트) — 현재 유지

### 스타일 원칙
- **이모지 사용 최소화** — 가능하면 lucide-react 아이콘 또는 커스텀 SVG 이미지 사용
- 라운드 카드 (rounded-2xl ~ rounded-[2rem])
- 그림자는 부드럽게 (shadow-lg, shadow-xl)
- 모바일 퍼스트 (max-w-md 기준)
- 전체적으로 따뜻하고 감성적인 톤

---

## 주의사항

1. 기존에 작동하는 기능(운세 뽑기, 메시지 등록, confetti 등)을 깨뜨리지 마라
2. TypeScript 에러가 나지 않도록 타입을 정확히 맞춰라
3. 이미지가 아직 없을 수 있으니 반드시 fallback 처리해라
4. Vercel 배포 기준으로 `next build`가 에러 없이 통과해야 한다
5. 환경변수가 비어있을 때 에러가 나지 않도록 방어 코드를 넣어라
6. 브랜드 스토리 섹션은 과하지 않게, 담백하지만 감성적으로

---

## 실행 순서

1. `public/images/mochi/` 폴더 생성 + SVG 모찌 5종 + 로고 SVG 생성
2. `fortunes.ts` 수정 (image 필드 추가)
3. `page.tsx` 랜딩 섹션 리뉴얼 (히어로 + 스토리 + 이용방법 + 컬렉션 + CTA)
4. `page.tsx` 운세 모드 이모지 → SVG 이미지 교체
5. `setup/[id]/page.tsx` 이모지 → SVG 이미지 교체
6. 환경변수 정리
7. 빌드 테스트 (`npm run build`)
