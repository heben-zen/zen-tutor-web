// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  firebaseConfig: {
    apiKey: "AIzaSyBz3Bc9wXNTwGPgxNJxkQwiWXKa1l7mbYw",
    authDomain: "zen-social-media.firebaseapp.com",
    projectId: "zen-social-media",
    storageBucket: "zen-social-media.appspot.com",
    messagingSenderId: "743793788639",
    appId: "1:743793788639:web:3f2b8420da169f88810b6a",
    measurementId: "G-F6T5BZ42LB"
  },
  API_HOST: 'http://localhost:8080',
  API_URL: 'http://localhost:8080/api/v1',
  VIDEO_WS_URI: 'ws://localhost',
  VIDEO_WS_PORT: '8081',
  MESSAGING_URI: 'ws://localhost',
  MESSAGING_PORT: '8083'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
