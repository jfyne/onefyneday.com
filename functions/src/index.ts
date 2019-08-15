import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';

const sid = '19u6t3aEmnEfc9vo8tfr7tBy8u5lhkvE9xYMrxT1WyrI';

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const responsesRef = db.collection('responses');
const roomsRef = db.collection('rooms');

async function handleResponse(change: any, context: any) {
    const document = change.after.exists ? change.after.data() : null;
    console.log(document);

    const pickedRooms: { [key:string]: string[] } = {};

    const snapshot = await responsesRef.get()
    const data = snapshot.docs.map(doc => {
        const d = doc.data()
        if (!(d.room in pickedRooms)) {
            pickedRooms[d.room] = [];
        }
        pickedRooms[d.room].push(d.email);
        return [d.email, d.names, d.response, d.number, d.phone, d.dietary, d.message, d.room];
    });
    data.unshift(['Email', 'Names', 'Response', 'Number', 'Phone', 'Dietary', 'Message', 'Room']);

    return Promise.all([updateReservations(pickedRooms), writeSheet(data)]);
}

// Update the reservations lists in the room types.
async function updateReservations(pickedRooms: { [key:string]: string[]}): Promise<any> {
    const updates: Promise<any>[] = [];
    Object.keys(pickedRooms).map(room => {
        updates.push(roomsRef.doc(room).set({requesters: pickedRooms[room]}));
    });
    return Promise.all(updates);
}

// Write the latest set of responses to the google sheet.
async function writeSheet(data: string[][]): Promise<any> {
    const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets']});
    const sheets = google.sheets({version: 'v4'});
    await sheets.spreadsheets.values.clear({
        spreadsheetId: sid,
        range: 'Responses!A:Z',
        auth: auth
    })

    const updateRange = `Responses!A:H`;
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
}

exports.responseReceievd = functions.firestore
    .document('responses/{code}')
    .onWrite(handleResponse);
