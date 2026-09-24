# Submission Notes

## Choices I made

- **URL as the source of truth.** Page number, search text, category, sort field and sort order all live in the query string instead of component state. That's what makes "refresh keeps the same result" and "share the link" work for free, and it also gave me a natural place to validate incoming values (see below).
- **One Axios instance, two interceptors.** `lib/axios.js` attaches the bearer token to every request and turns every possible failure (bad response, no response, network error, 401) into one consistent `{ status, message }` shape, so every screen handles errors the same way instead of each component parsing `error.response` itself.
- **Category filter disabled during search**, since the API can't do both at once. I picked search-wins because that's the more common user intent when both are set (you just typed something).
- **Delete updates local state** since the API doesn't actually persist the change. Add/Edit show a short-lived success banner and redirect back to the list, since there's nowhere real to "land" on after an edit that isn't reflected server-side.

## A problem I faced

Fast typing in the search box was firing a new request per keystroke, and because the API can respond out of order (especially with `&delay=2000` added to simulate a slow network), an old, slow response could land *after* a newer one and show stale results. I fixed it two ways at once: every request carries an `AbortController` signal, and a new keystroke aborts whatever is still in flight; on top of that, a request-id counter is checked before a response is ever applied to state, so even a response that finishes despite being "aborted" can't overwrite newer data. I tested this by throttling the network in dev tools and by manually appending `&delay=2000` to the underlying API calls.

## Where AI helped

I used Claude to scaffold the project (file/folder layout, the Axios setup with interceptors, the URL-driven search/filter/pagination logic, form validation, and the Tailwind blue/white theme). I went through the generated code, understand each part, and I'm ready to walk through it and make live changes in the next round.
