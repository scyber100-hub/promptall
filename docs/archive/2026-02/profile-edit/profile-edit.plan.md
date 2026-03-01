# Plan: profile-edit

## Overview
사용자가 자신의 프로필을 수정할 수 있는 기능. 현재 프로필 페이지에는 "Edit Profile" 버튼이 렌더링되지 않으며, PATCH API도 없음.

## Problem Statement
- 현재 프로필 정보(이름, 소개, 아바타)는 가입 시 설정된 값으로 고정됨
- 사용자가 자신의 프로필을 수정할 방법이 없어 UX 저하
- Google 로그인 사용자의 경우 구글 프로필 이미지가 초기값이나 변경 불가

## Goals
- 본인 프로필 페이지에 "Edit Profile" 버튼 표시 (타인 프로필엔 숨김)
- 이름(name), 소개(bio), 아바타 이미지 URL 수정 가능
- 수정 후 NextAuth 세션 업데이트 (Header 아바타/이름 즉시 반영)
- 유효성 검사: name 필수(최대 50자), bio 선택(최대 200자), image URL 선택(유효한 URL)

## Non-Goals (이번 사이클 제외)
- username 변경 (URL에 직접 사용되므로 별도 처리 필요)
- 파일 업로드 (이미지 URL 직접 입력 방식으로 대체)
- 이메일 변경 / 비밀번호 변경
- 계정 삭제

## Functional Requirements

### FR-01: PATCH /api/users/me
- 인증된 사용자의 name, bio, image 업데이트
- 유효성 검사: name 필수(1~50자), bio 최대 200자, image 유효한 URL 또는 빈 문자열
- 응답: 업데이트된 user 객체 (password 제외)

### FR-02: "Edit Profile" 버튼 (본인 프로필만)
- 프로필 페이지에서 세션 userId === 프로필 userId 일 때만 표시
- FollowButton 자리에 조건부 렌더링 (클라이언트 컴포넌트)

### FR-03: 프로필 편집 페이지
- 경로: `/[locale]/settings/profile`
- 폼 필드: 이름, 소개(textarea), 아바타 이미지 URL
- 현재 값 pre-fill, 저장 시 PATCH 호출
- 성공 시 프로필 페이지로 리다이렉트

### FR-04: 세션 업데이트
- 편집 성공 후 `update()` (NextAuth useSession) 호출
- Header의 이름/아바타 즉시 반영

### FR-05: i18n
- 6개 언어 locale 키 추가: `settings` 네임스페이스
- 기존 `profile.edit_profile` 키 활용

## Tech Stack
- Next.js 16 App Router (params Promise)
- MongoDB / Mongoose (User 모델 수정 불필요, 기존 필드 사용)
- NextAuth v4 JWT 전략 (세션 업데이트)
- next-intl v4
- Tailwind CSS v4

## Affected Files
- NEW: `app/api/users/me/route.ts`
- NEW: `app/[locale]/settings/profile/page.tsx`
- NEW: `components/profile/EditProfileButton.tsx`
- MOD: `app/[locale]/profile/[username]/page.tsx` (EditProfileButton 추가)
- MOD: `messages/*.json` x6 (settings 네임스페이스 추가)

## Success Criteria
- 본인 프로필에서 "Edit Profile" 버튼 클릭 → 편집 페이지 이동
- 이름/소개/이미지 변경 후 저장 → DB 반영 + 세션 업데이트
- Header 아바타/이름 즉시 변경 확인
- 타인 프로필에선 "Edit Profile" 버튼 미노출
- 6개 언어 번역 적용

## Priority
High — 기본적인 사용자 경험 필수 기능

## Estimated Scope
Small (5~7 files)
