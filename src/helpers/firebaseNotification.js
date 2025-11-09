import { messaging } from "../services/firebaseConfig";
import { getToken, onMessage } from "firebase/messaging";
import axiosInstance from "../axios/axiosInstance";

export const requestWebNotificationPermission = async (dispatch, setFcmTokenRedux) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    // Get web FCM token
    const currentToken = await getToken(messaging, { vapidKey: "BP-1F-NcNNnU0nym739F_DJ8UbcPLRugZfer7nXNTezUpuy1lZgEoSbXlSQpP9XZGs6_B0pExJpDH_z8umOAkpY" });
    if (currentToken) {
      console.log("Web FCM token:", currentToken);

      // Save in Redux
      dispatch(setFcmTokenRedux(currentToken));

      // Send to backend
      await axiosInstance.post("/save_fcm_token", { fcmToken: currentToken });
      console.log("Web FCM token sent to backend");
    }

    // Listen for foreground messages
    onMessage(messaging, (payload) => {
      console.log("Web FCM message received:", payload);
      if (payload.notification) {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: payload.notification.icon || "/favicon.ico",
        });
      }
    });
  } catch (err) {
    console.error("Error in web FCM setup:", err);
  }
};
