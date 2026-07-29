/**
 * Google Apps Script endpoint for NovaSyY Lab Hub.
 * Deploy as a Web app: Execute as Me, Who has access: Anyone.
 * Set DRIVE_FOLDER_ID and ACCESS_KEY below before deployment.
 */
const DRIVE_FOLDER_ID = 'PASTE_YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE';
const ACCESS_KEY = 'CHANGE_TO_A_LONG_RANDOM_SECRET';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    authorize_(body.key);
    if (body.action !== 'save' || !body.record) throw new Error('Permintaan tidak sah.');
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const record = body.record;
    const safeType = String(record.type || 'record').replace(/[^a-z0-9_-]/gi, '');
    folder.createFile(`${safeType}-${record.id}.json`, JSON.stringify(record, null, 2), MimeType.PLAIN_TEXT);
    return json_({ ok: true });
  } catch (error) { return json_({ ok: false, error: error.message }); }
}

function doGet(e) {
  try {
    authorize_(e.parameter.key);
    if (e.parameter.action !== 'list') throw new Error('Permintaan tidak sah.');
    const files = DriveApp.getFolderById(DRIVE_FOLDER_ID).getFiles();
    const records = [];
    while (files.hasNext()) {
      const file = files.next();
      if (file.getName().endsWith('.json')) records.push(JSON.parse(file.getBlob().getDataAsString()));
    }
    return json_({ ok: true, records: records });
  } catch (error) { return json_({ ok: false, error: error.message }); }
}

function authorize_(key) {
  if (!DRIVE_FOLDER_ID || DRIVE_FOLDER_ID.indexOf('PASTE_') === 0) throw new Error('DRIVE_FOLDER_ID belum ditetapkan.');
  if (!ACCESS_KEY || ACCESS_KEY.indexOf('CHANGE_') === 0) throw new Error('ACCESS_KEY belum ditetapkan.');
  if (key !== ACCESS_KEY) throw new Error('Akses tidak dibenarkan.');
}
function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
