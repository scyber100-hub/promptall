# Design: profile-edit

## Status
- Plan: ✅ `docs/01-plan/features/profile-edit.plan.md`
- Design: 🔄 In Progress

## Current State Analysis
- `app/api/users/me/route.ts` **이미 존재** — PATCH (name, bio) — image 필드 미지원
- settings 페이지 없음
- EditProfileButton 컴포넌트 없음
- profile page: FollowButton만 렌더링, "Edit Profile" 없음

---

## Architecture

```
[Profile Page - Server Component]
  └─ [EditProfileButton - Client Component]  ← useSession으로 본인 여부 판단
       └─ Link to /[locale]/settings/profile

[Settings Profile Page - Client Component]
  ├─ 현재 user 데이터 GET /api/users/me (new)
  ├─ 폼 렌더링 (name, bio, image URL)
  ├─ PATCH /api/users/me 호출
  └─ update() → NextAuth 세션 갱신 → redirect to profile
```

---

## FR-01: PATCH /api/users/me (수정)

**현재**: name, bio만 처리
**변경**: image 필드 추가, GET 엔드포인트 추가

### GET /api/users/me
```typescript
// 인증 필요
// 응답: { user: { _id, name, username, email, bio, image, provider } }
```

### PATCH /api/users/me
```typescript
// Body: { name: string, bio?: string, image?: string }
// Validation:
//   name: 필수, 1~50자
//   bio: 선택, 최대 200자
//   image: 선택, URL 형식 또는 빈 문자열 (최대 500자)
// 응답: { user: { _id, name, username, email, bio, image } }
// DB: findByIdAndUpdate({ name, bio, image }, { new: true }).select('-password -verificationToken')
```

---

## FR-02: EditProfileButton Component

**파일**: `components/profile/EditProfileButton.tsx`

```typescript
'use client';
// Props: { targetUserId: string; locale: string }
// useSession() → session.user.id === targetUserId → "Edit Profile" 버튼 표시
// 타인 프로필 → null 반환 (FollowButton이 대신 표시됨)
// 클릭 → router.push(`/${locale}/settings/profile`)
// UI: 인디고 아웃라인 버튼 (Pencil 아이콘 + t('profile.edit_profile'))
```

**프로필 페이지 수정**: `EditProfileButton`과 `FollowButton`을 함께 렌더링
```tsx
{/* 기존 */}
<FollowButton username={u.username} targetUserId={u._id} />

{/* 변경: 두 버튼 모두 렌더링, 각자 본인/타인 여부 판단 */}
<div className="flex gap-2">
  <EditProfileButton targetUserId={u._id} locale={locale} />
  <FollowButton username={u.username} targetUserId={u._id} />
</div>
```
> EditProfileButton은 본인이면 버튼 표시 + FollowButton은 타인이면 버튼 표시
> 둘 다 null을 반환하는 경우(비로그인)도 자연스럽게 처리

---

## FR-03: Settings Profile Page

**파일**: `app/[locale]/settings/profile/page.tsx`

```typescript
'use client';
// 1. useSession() → 미인증 시 /auth/signin 리다이렉트
// 2. mount 시 GET /api/users/me → 현재 값 pre-fill
// 3. 폼 상태: name, bio, image (string)
// 4. handleSubmit: PATCH /api/users/me → update({ name, image }) → router.push(profileUrl)
```

**UI 구조**:
```
/settings/profile
┌─────────────────────────────┐
│ ← Back                       │
│ Edit Profile                 │
├─────────────────────────────┤
│ [Avatar Preview 80px]        │
│                              │
│ Name *              [input]  │
│ Username (read-only)[input]  │
│ Bio                [textarea]│
│ Profile Image URL   [input]  │
│                              │
│       [Save Changes]         │
└─────────────────────────────┘
```

**Avatar Preview**:
- image 필드 값이 있으면 `<Image>` 표시
- 없으면 이름 첫 글자 인디고 원형

**Username 필드**: disabled (변경 불가 표시)

---

## FR-04: NextAuth 세션 업데이트

`lib/auth.ts` jwt callback에 `trigger: 'update'` 처리 추가:

```typescript
async jwt({ token, user, trigger, session }) {
  // 기존 로직...

  // 프로필 수정 후 세션 갱신
  if (trigger === 'update' && session) {
    if (session.name) token.name = session.name;
    if (session.image !== undefined) token.picture = session.image;
  }
  return token;
}
```

클라이언트 settings 페이지에서:
```typescript
const { update } = useSession();
// PATCH 성공 후:
await update({ name: updatedName, image: updatedImage });
```

---

## FR-05: i18n — settings 네임스페이스

6개 locale 파일에 추가:

```json
"settings": {
  "profile_title": "Edit Profile",
  "back": "Back",
  "name_label": "Name",
  "name_placeholder": "Your name",
  "username_label": "Username",
  "username_hint": "Username cannot be changed",
  "bio_label": "Bio",
  "bio_placeholder": "Tell us about yourself...",
  "image_label": "Profile Image URL",
  "image_placeholder": "https://example.com/avatar.jpg",
  "image_hint": "Enter a URL for your profile image",
  "save_btn": "Save Changes",
  "saving": "Saving...",
  "save_success": "Profile updated!",
  "save_error": "Failed to update profile. Please try again."
}
```

---

## File Manifest

| File | Action | Description |
|------|--------|-------------|
| `app/api/users/me/route.ts` | MOD | GET 추가 + PATCH에 image 필드 추가 |
| `app/[locale]/settings/profile/page.tsx` | NEW | 프로필 편집 클라이언트 폼 페이지 |
| `components/profile/EditProfileButton.tsx` | NEW | 본인 프로필에만 표시되는 편집 버튼 |
| `app/[locale]/profile/[username]/page.tsx` | MOD | EditProfileButton 추가 |
| `lib/auth.ts` | MOD | jwt callback에 trigger='update' 처리 추가 |
| `messages/en.json` | MOD | settings 네임스페이스 추가 |
| `messages/ko.json` | MOD | settings 네임스페이스 추가 |
| `messages/ja.json` | MOD | settings 네임스페이스 추가 |
| `messages/zh.json` | MOD | settings 네임스페이스 추가 |
| `messages/es.json` | MOD | settings 네임스페이스 추가 |
| `messages/fr.json` | MOD | settings 네임스페이스 추가 |

**총 11개 파일** (3 new, 8 modified)

---

## Validation Rules

| Field | Rule |
|-------|------|
| name | 필수, 1~50자, trim 후 검사 |
| bio | 선택, 최대 200자 |
| image | 선택, URL 형식 (http/https) 또는 빈 문자열, 최대 500자 |

---

## Error Handling

| 상황 | 처리 |
|------|------|
| 미인증 | 401 → 클라이언트에서 /auth/signin 리다이렉트 |
| name 빈 값 | 400 + 인라인 에러 표시 |
| name 50자 초과 | 400 + 인라인 에러 표시 |
| bio 200자 초과 | 클라이언트에서 maxLength로 방지 |
| image 잘못된 URL | 클라이언트 정규식 검사 (선택적) |
| 서버 오류 | 500 → toast 에러 메시지 |

---

## Implementation Order

1. `app/api/users/me/route.ts` — GET 추가 + PATCH image 지원
2. `lib/auth.ts` — jwt trigger='update' 처리
3. `messages/*.json` x6 — settings 네임스페이스
4. `components/profile/EditProfileButton.tsx`
5. `app/[locale]/settings/profile/page.tsx`
6. `app/[locale]/profile/[username]/page.tsx` — EditProfileButton 추가
