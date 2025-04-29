# reactNativeApp

This mobile application, built with React Native and Expo, offers two primary features: a Shopping List Manager and a Car Wash Countdown Timer with notification reminders.

Shopping List Manager:

- Users can add, delete, and mark items as completed in a shopping list.

- Items are sorted intelligently: active items are shown first, followed by completed ones based on the time of update.

- The app persists the shopping list locally using AsyncStorage, ensuring that the data remains even if the app is closed or restarted.

- The UI emphasizes usability with clear item statuses (checked/unchecked) and deletion confirmation dialogs.

Car Wash Countdown Timer:

- A separate section lets users start a countdown for their next car wash, with a default frequency of once every hour (for demo purposes; easily adjustable).

- A push notification is scheduled to remind users when it's time to wash their car, leveraging Expo Notifications.

- If a new countdown is started, the previous scheduled notification is canceled and replaced.

- The app provides real-time countdown updates (days, hours, minutes, seconds) and visually indicates when the car wash is overdue by changing the background color.

- Haptic feedback enhances the user experience when scheduling a new countdown.

Countdown History:

- A history screen lists all previous car wash completions, formatted with human-readable timestamps.

- This list is also persisted locally and displayed using a clean FlatList component.

Navigation:

- The app uses expo-router with a combination of Tabs and Stack Navigation.

- There are two main tabs: Shopping List and Counter.

- Inside the Counter tab, there's a nested navigation flow: the main Counter Screen and a linked History Screen.

- A header button (history icon) is available in the Counter screen to quickly access the history.

Push Notifications:

- Proper permissions are handled with Expo's permission request flow.

- For Android, a high-importance notification channel is set up to ensure notifications are seen immediately with popups and sound.

Storage Handling:

- All persistent data (shopping list and countdown state) is saved and retrieved using simple utility functions wrapping AsyncStorage, ensuring safe and clean storage access.
