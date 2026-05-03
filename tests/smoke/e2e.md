# UPI + Admin smoke checklist

Pre-reqs: `npm run dev` running on http://localhost:3000 with `.env.local` populated by `vercel env pull`.

## Customer flow
1. Open `/`, add BPC-157 to cart.
2. Open cart, type `FIRST5` → Apply → enter your email → click Send → check inbox → enter the OTP → click Verify. Coupon line should read `FIRST5 applied`.
3. Type a contact email in the cart's `Contact email` field.
4. Click `Pay via UPI`. Modal opens, QR renders (or fallback link), UPI ID shows.
5. Click `I've paid — enter UTR`. Type `123456789012`. Click `CONFIRM ORDER`.
6. Modal switches to "Order placed" with a reference like `ABL-X7K2P9QM`.
7. Inbox: customer "received" email, admin alert email. Both arrive within ~30 s.

## Admin flow
8. Click the link in the admin email. Should land on `/admin/order.html?id=...` after one redirect via `/api/admin/auth`.
9. Browser should be sitting on the order detail page; the audit log shows `placed` row.
10. Click `APPROVE — MARK PAID`. Confirm dialog. Status pill flips to `PAID`. Audit log gains an `approve` row. Customer inbox: "Order confirmed" email.
11. Click `MARK SHIPPED`, enter `ABCD123`, confirm. Status flips to `SHIPPED`. Audit row added. Customer inbox: "Order shipped" email.
12. Sign out from the header. Reload `/admin/index.html`. Should redirect to `/admin/login.html`.

## Negative paths
13. Visit `/admin/index.html` in a private window without a session — should redirect to login.
14. Submit a UTR that's < 12 digits — modal should refuse without hitting the network.
15. With FIRST5 verified once, place an order, then try to verify FIRST5 again on a fresh cart — the OTP `verified` flag is now consumed, so the OTP request flow runs anew but `coupon_usage` already has the email, so verify-coupon returns `Already used`.
