import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { app } from "./config";

const storage = getStorage(app);

/**
 * Uploads a base64 data URL image to Firebase Storage
 * and returns the permanent download URL.
 */
export async function uploadImageFromDataUrl(
  dataUrl: string,
  path: string
): Promise<string> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadString(storageRef, dataUrl, "data_url", {
    contentType: "image/png",
  });
  return await getDownloadURL(snapshot.ref);
}
