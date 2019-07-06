import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';

const sid = '19u6t3aEmnEfc9vo8tfr7tBy8u5lhkvE9xYMrxT1WyrI';

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});
const db = admin.firestore();
const responsesRef = db.collection('responses');

async function handleResponse(change: any, context: any) {
    // Get an object with the current document value.
    // If the document does not exist, it has been deleted.
    const document = change.after.exists ? change.after.data() : null;
    // perform desired operations ...
    console.log(document);

    const snapshot = await responsesRef.get()
    const data = snapshot.docs.map(doc => {
        const d = doc.data()
        return [d.email, d.names, d.response, d.number, d.phone, d.dietary, d.message];
    });
    data.unshift(['Email', 'Names', 'Response', 'Number', 'Phone', 'Dietary', 'Message']);

    const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets']});
    const sheets = google.sheets({version: 'v4'});
    await sheets.spreadsheets.values.clear({
        spreadsheetId: sid,
        range: 'Responses!A:Z',
        auth: auth
    })

    const updateRange = `Responses!A:G`;
    const res = await sheets.spreadsheets.values.update({
        spreadsheetId: sid,
        range: updateRange,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            range: updateRange,
            majorDimension: 'ROWS',
            values: data
        },
        auth: auth
    });

    return res;
    //return document;
}

exports.responseReceievd = functions.firestore
    .document('responses/{code}')
    .onWrite(handleResponse);
