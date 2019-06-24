import * as functions from 'firebase-functions';

exports.responseReceievd = functions.firestore
    .document('responses/{code}')
    .onWrite((change, context) => {
      // Get an object with the current document value.
      // If the document does not exist, it has been deleted.
      const document = change.after.exists ? change.after.data() : null;
      // perform desired operations ...
      console.log(document);
      return document;
    });

