// googleDrive.ts
import { gapi } from 'gapi-script';

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

export async function initGapi(clientId: string, apiKey: string) {
  await new Promise((r) => gapi.load('client:auth2', r));
  await gapi.client.init({ clientId, apiKey, discoveryDocs: DISCOVERY_DOCS, scope: SCOPES });
}
export async function signInGoogle() {
  const auth = gapi.auth2.getAuthInstance();
  return auth.signIn();
}
export function getProfileEmail() {
  const user = gapi.auth2.getAuthInstance().currentUser.get();
  return user.getBasicProfile().getEmail();
}
export async function uploadToDrive(blob: Blob, fileName: string) {
  const token = gapi.auth.getToken().access_token;
  const metadata = { name: fileName, mimeType: blob.type };
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', blob);
  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });
  return res.json();
}
