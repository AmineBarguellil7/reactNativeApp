import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export async function registerForPushNotificationsAsync() {
  // ─── Android “heads-up” channel ────────────────────────────
  if (Platform.OS === 'android') {
    // Delete any old channel so changes take effect
    await Notifications.deleteNotificationChannelAsync('default');
    // Recreate with HIGH importance (pop-up + sound)
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
      showBadge: false,
    });
  }

  // ─── Permissions ───────────────────────────────────────────
  if (!Device.isDevice) return null;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  const finalStatus =
    existingStatus === 'granted'
      ? existingStatus
      : (await Notifications.requestPermissionsAsync()).status;
  return finalStatus;
}
