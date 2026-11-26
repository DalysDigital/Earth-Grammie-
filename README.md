# Earth Gramineae 

This version keeps the working Earth Gramineae frontend unchanged and simplifies the document tools.

## Admin
- `/admin/login.php`
- Dashboard logo uses the supplied Earth Gramineae logo.
- Install App button uses the browser's PWA installation flow. On Android Chrome, installation is a standalone installed web app (WebAPK where supported), not a bookmark.

## Documents
- Invoices: simple form, Save & Preview, Print / Save PDF, amount in words, paid row hidden when empty, digital signature upload.
- Letter Heads: simple form, Save & Preview, Print / Save PDF, digital signature upload.
- Email fields have been removed from the document creation workflow as requested.

## Projects
Project image upload is built into the Add/Edit Project form and stores images under `uploads/projects/`.

## Existing database
Use `/repair.php` once if upgrading an older database. The frontend does not run migrations on every request.

## PDF
For server-generated PDFs, run `composer install` to install Dompdf. The browser Print / Save PDF option works without Composer.

## Security
After installation/repair, remove `install.php` and `repair.php` from the public server.
