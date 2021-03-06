

var firebaseManager = {
  isUserExisting: false,
  databaseRef: {},
  firebaseUsername: "",
  isDataInit: false,

  config: {
    apiKey: YOUR_FIREBASE_APP_APIKEY,
    authDomain: YOUR_FIREBASE_APP_AUTH_DOMAIN,
    databaseURL: YOUR_FIREBASE_APP_DATABASE_URL,
    projectId: YOUR_FIREBASE_APP_PROJECT_ID,
    storageBucket: YOUR_FIREBASE_APP_STORE_BUCKET,
    messagingSenderId: YOUR_FIREBASE_APP_MESSAGING_SENDER_ID
  },

  setFirebaseUsername: function (username){
    this.firebaseUsername = username.replace('.', '+');
  },

  initData: function () {
    firebase.database().ref('users').child(this.firebaseUsername).once('value').then(function(snapshot) {
      data = snapshot.val();
      firebaseManager.isDataInit = true;
      app.init();
    });
  },

  setData: function () {
    firebase.database().ref('users').child(this.firebaseUsername).once('value').then(function(snapshot) {
      data = snapshot.val();
    });
  },

  initFirebase: function () {
    firebase.initializeApp(this.config);
    this.databaseRef = firebase.database();
    this.isDataInit = false;
  },

  saveToFirebase: function (locationData) {
    if (!data | (data && !Object.keys(data).includes(locationData.locationID))) {
      this.databaseRef.ref('users').child(this.firebaseUsername).child(locationData.locationID).set({
        name: locationData.location.locationName,
        coord: locationData.location.coord,
        posts: '',
      })
      instagramManager.requestCoordsFromLocationID(locationData.locationID);
    }

    //Save location post:
    this.databaseRef.ref('users').child(this.firebaseUsername).child(locationData.locationID).child('posts').child(locationData.location.postId).set({
      photographer: locationData.location.post.photographer,
      image: locationData.location.post.image
    })

  },

  updateCoordsFirebase: function (locationID, longitude, latitude) {
    this.databaseRef.ref('users').child(this.firebaseUsername).child(locationID).child('coord').set({
      latitude: latitude,
      longitude: longitude
    })
  },

  deleteFromFirebase: function (locationID, postID) {

    if (data[locationID].posts[postID] && Object.keys(data[locationID].posts).length <= 1) {
      this.databaseRef.ref('users').child(this.firebaseUsername).child(locationID).remove();
    } else {
      this.databaseRef.ref('users').child(this.firebaseUsername).child(locationID).child('posts').child(postID).remove();
    }

  }
}
