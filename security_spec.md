# Security Specification for Mamabora

## Data Invariants
1. A baby profile must belong to a valid user.
2. A log entry must belong to a valid baby profile owned by the user.
3. A chat session must belong to the logged-in user.
4. A message must belong to a chat session owned by the user.
5. `createdAt` and `ownerId`/`userId` fields are immutable after creation.
6. Only the owner can read/write their data.

## The Dirty Dozen Payloads (Targeting Baby Collection)
1. **Identity Spoofing**: `create` baby with `ownerId` of another user.
2. **Shadow Field Injection**: `create` baby with unauthorized `isVerified: true` field.
3. **ID Poisoning**: `create` baby with 2KB string as ID.
4. **State Shortcutting**: `update` baby `createdAt` field.
5. **Type Poisoning**: `update` baby `name` with a boolean.
6. **Relational Sync Break**: `create` log for a `babyId` that doesn't exist.
7. **Size Exhaustion**: `update` baby `name` with 1MB string.
8. **PII Leak**: `get` user profile of another user.
9. **Blanket Query**: `list` all babies without filtering by `ownerId`.
10. **Unauthorized Update**: A non-owner user attempting to update a baby profile.
11. **Recursive Cost Attack**: Deeply nested document ID injection.
12. **Timestamp Forgery**: `create` baby with client-side `createdAt` instead of `serverTimestamp()`.

## Test Runner (Logic)
The following `firestore.rules` will be tested against these payloads using the Firebase Emulator or manual audit.
All payloads above MUST result in `PERMISSION_DENIED`.
