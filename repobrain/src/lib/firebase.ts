// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyrAx_ztBvn4EJ8BSzD-yfjx4klDPlHNU",
  authDomain: "repobrain-8b794.firebaseapp.com",
  projectId: "repobrain-8b794",
  storageBucket: "repobrain-8b794.firebasestorage.app",
  messagingSenderId: "992450872899",
  appId: "1:992450872899:web:253d1178b93a18ef3536f6",
  measurementId: "G-LL52DRLNYG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFile(
  file: File,
  setProgress?: (progress: number) => void,
) {
  return new Promise<string>((resolve, reject) => {
    try {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          if (setProgress) setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("upload is paused");
              break;
            case "running":
              console.log("upload is running");
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          void getDownloadURL(uploadTask.snapshot.ref).then(resolve, reject);
        },
      );
    } catch (error) {
      console.error(error);
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });
}
