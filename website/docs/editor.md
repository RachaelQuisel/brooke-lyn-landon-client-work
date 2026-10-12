# Reading with Sage editor

Open `/edit` and select **Sign in with ChatGPT**. Editing is limited by the hosted `EDITOR_EMAILS` setting to the owner and the Brooke account Rachael approved.

Choose a page, change its text, and select **Save changes**. The six-session text is shared with the Program page, Parents page, and printable guide. Site-wide labels and search previews can also be edited.

Choose **Photos** to upload Brooke & Sage photos, the book cover, or the social sharing image. JPG, PNG, and WebP files up to 5 MB are supported. Add a useful photo description and select **Save changes**. Uploading alone does not replace the website photo.

Saved text lives in D1. Photos live in R2 and use randomly generated immutable filenames. Every editor API operation checks platform-authenticated identity. Writes also require a same-origin browser request. Requests and uploads have size limits and per-user rate limits. Stale saves are rejected to prevent one editor overwriting another editor’s changes.

The public pages keep their Storybook styling and original structure. Booking, contact delivery, and parent email signup still require their separate Formspree configuration; editing the website does not activate those services.

For local development, the Sites starter simulates a ChatGPT account on loopback only. `.dev.vars` selects that local editor and is ignored by Git and deployment packaging. Production authentication is handled by Sites. There are no passwords or editor accounts stored in the application.
