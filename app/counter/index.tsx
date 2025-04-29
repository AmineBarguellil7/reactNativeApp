import { theme } from "@/themes/theme";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import { Duration, intervalToDuration, isBefore } from "date-fns";
import { TimeSegment } from "@/components/TimeSegment";
import * as Notifications from "expo-notifications";
import { getFromStorage, saveToStorage } from "@/utils/storage";
import * as Haptics from "expo-haptics";

type CountdownStatus = {
  isOverdue: boolean;
  distance: Duration;
};

const frequence = 60 * 60 * 1000;

export const countdownStorageKey = "countdown";

export type PersistedCountdownState = {
  currentNotificationId: string | undefined;
  completedAtTimestamps: number[];
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function CounterScreen() {


  const [countdownState, setCountdownState] =
    useState<PersistedCountdownState>();
  const [status, setStatus] = useState<CountdownStatus>({
    isOverdue: false,
    distance: {},
  });

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(countdownStorageKey);
      setCountdownState(value);
    };
    init();
  }, []);

  const lastCompletedAt = countdownState?.completedAtTimestamps[0];


  useEffect(() => {
    const intervalId = setInterval(() => {
      const timestamp = lastCompletedAt
        ? lastCompletedAt + frequence
        : Date.now();
      const isOverdue = isBefore(timestamp, Date.now());

      const distance = intervalToDuration(
        isOverdue
          ? { end: Date.now(), start: timestamp }
          : { start: Date.now(), end: timestamp },
      );

      setStatus({ isOverdue, distance });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [lastCompletedAt]);

  const scheduleNotification = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    let pushNotificationId;
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time to wash the car! 🚗",
        },
        trigger: {
          seconds: frequence / 1000,
          channelId: "default",
        },
      });
    } else {
      Alert.alert(
        "Unable to schedule notification",
        "Enable the notifications permission for Expo Go in settings",
      );
    }

    if (countdownState?.currentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        countdownState.currentNotificationId,
      );
    }

    const newCountdownState: PersistedCountdownState = {
      currentNotificationId: pushNotificationId,
      completedAtTimestamps: countdownState
        ? [Date.now(), ...countdownState.completedAtTimestamps]
        : [Date.now()],
    };

    setCountdownState(newCountdownState);

    await saveToStorage(countdownStorageKey, newCountdownState);
  };


  return (
    <View
      style={[
        styles.container,
        status.isOverdue ? styles.containerLate : undefined,
      ]}
    >
      {status.isOverdue ? (
        <Text style={[styles.heading, styles.whiteText]}>Car wash overdue by</Text>
      ) : (
        <Text>Car wash due in</Text>
      )}
      <View style={styles.row}>
        <TimeSegment
          unit="days"
          number={status.distance.days || 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          unit="hours"
          number={status.distance.hours || 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          unit="minutes"
          number={status.distance.minutes || 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          unit="seconds"
          number={status.distance.seconds || 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={scheduleNotification}>
        <Text style={styles.buttonText}>Wash the car</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorWhite,
  },
  text: {
    fontSize: 24,
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 24,
    color: theme.colorWhite,
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: theme.colorBlack,
  },
  containerLate: {
    backgroundColor: theme.colorRed,
  },
  whiteText: {
    color: theme.colorWhite,
  },
});
