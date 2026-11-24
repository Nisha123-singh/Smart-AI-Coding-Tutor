# Firestore Security Specification

## Data Invariants
1. A `/userProgress/{userId}` document can only be read, created, updated, or deleted by the authenticated, email-verified user whose `request.auth.uid == userId`.
2. Listing `/userProgress` across users is strictly forbidden (`allow list: if false`).
3. `userId` and `createdAt` are immutable after creation; `createdAt` and `updatedAt` must equal `request.time` via `serverTimestamp()`.
4. No arbitrary shadow fields are permitted (`hasAll` + `hasOnly` on create, `affectedKeys().hasOnly(...)` on update).
5. `completedLessons` is bounded to at most 50 entries and `quizAnswers` is bounded to at most 50 entries.
6. `lastVisitedLanguage` must be one of `python`, `java`, `cpp`, or `sql`.

## Dirty Dozen Adversarial Payloads (Must Return PERMISSION_DENIED)
1. Unauthenticated `get` on `/userProgress/user123`.
2. Unauthenticated `create` on `/userProgress/user123`.
3. Cross-user `get` (`auth.uid = 'attacker'` reading `/userProgress/victim`).
4. Cross-user `list` query on `/userProgress`.
5. Unverified email (`email_verified = false`) attempting `create` or `update`.
6. Identity spoofing (`auth.uid = 'userA'` writing `{ userId: 'userB' }` to `/userProgress/userA`).
7. Ghost/shadow field injection (`{ ..., isAdmin: true }`).
8. Invalid path ID poisoning (`/userProgress/../../evil` or 200-char ID).
9. Negative or non-integer counters (`codeRuns: -5` or `codeRuns: "99"`).
10. Invalid language enum (`lastVisitedLanguage: "ruby"`).
11. Client-forged timestamp (`createdAt: Timestamp(2020-01-01)` instead of `request.time`).
12. Immutable field mutation on update (attempting to change `userId` or `createdAt`).
