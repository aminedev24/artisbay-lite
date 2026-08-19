<?php
// Copy this file to mail_secrets.php (gitignored) and fill in real values.
// mail_secrets.php must exist on any server that sends @artisbay.com mail
// (production HostGator, and locally if you want to test real sends).
//
// 'username' is the Google Workspace mailbox that authenticates the SMTP
// connection - contact@artisbay.com.
//
// 'password' is a Gmail App Password (myaccount.google.com/apppasswords,
// requires 2-Step Verification on the account), NOT the account login password.
//
// noreply@artisbay.com (verification/password-reset/agreement emails) and
// order@artisbay.com (invoice/deposit emails, sendInvoice.php) must both be
// added as aliases of the contact@artisbay.com user in Google Workspace Admin
// (Directory > Users > contact@artisbay.com > add alias) so Gmail accepts
// PHPMailer's setFrom() for those addresses when authenticating as contact@.
return [
    'username' => 'contact@artisbay.com',
    'password' => 'REPLACE_WITH_APP_PASSWORD',
];
