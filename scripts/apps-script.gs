// OneForce contact form intake — paste into Extensions > Apps Script
// on the target Google Sheet, set NOTIFY_EMAIL, then deploy as a Web App
// (Execute as: Me, Who has access: Anyone) and copy the /exec URL into
// SHEET_ENDPOINT in contact.html.

var SHEET_NAME = 'Submissions';
var NOTIFY_EMAIL = 'you@yourdomain.com'; // TODO: replace with the inbox to notify

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Company', 'Message', 'Page']);
  }

  var p = e.parameter;
  var name = p.name || '';
  var email = p.email || '';
  var company = p.company || '';
  var message = p.message || '';
  var page = p.page || '';
  var submittedAt = p.submittedAt || new Date().toISOString();

  sheet.appendRow([submittedAt, name, email, company, message, page]);

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'New OneForce contact form submission — ' + name,
    body:
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n' +
      'Company: ' + (company || '—') + '\n\n' +
      'Message:\n' + message + '\n\n' +
      'Submitted: ' + submittedAt + '\n' +
      'Page: ' + page
  });

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
