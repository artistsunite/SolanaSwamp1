# Security Specification: SolanaSwamp (Purple Croc)

## 1. Data Invariants
- Proposals must have a title, description, status, and valid expiration date.
- Memes must have an image URL and a reference to the author.
- Stats are globally readable but only writable by the admin.
- Settings are globally readable but only writable by the admin.
- Voting on a proposal must increment both `yesVotes` (if applicable) and `totalVotes`.

## 2. The "Dirty Dozen" Payloads
1. **Admin Spoofing**: Attempt to update `stats/current` as a non-admin user.
2. **Identity Theft (Memes)**: Attempt to create a meme with an `author` field that doesn't match the user's UID or username.
3. **Ghost Fields**: Attempt to add an `isAdmin` field to a user profile (if it existed) or a meme.
4. **Negative Tips**: Create/Update a meme with negative tips.
5. **Vote Manipulation**: Update a proposal's `yesVotes` by more than 1 or without incrementing `totalVotes`.
6. **Past Expiry**: Create a proposal with an `endsAt` date in the past.
7. **Jumbo Document ID**: Attempt to create a document with a 1MB string as the ID.
8. **Unauthorized Deletion**: Attempt to delete another user's meme.
9. **Settings Hijack**: Attempt to change the `hero_image` setting as a non-admin.
10. **Orphaned Meme**: Create a meme with a broken image URL (empty string).
11. **State Jumping**: Change a proposal status from 'Active' directly to 'Passed' without a valid vote outcome (if logic were server-side, but here we validate transitions).
12. **Denial of Wallet**: Infinite loop of tiny writes to the same collection (handled by quota, but rules should restrict spam).

## 3. Test Runner (Draft Logic)
The `firestore.rules.test.ts` will verify these payloads.
