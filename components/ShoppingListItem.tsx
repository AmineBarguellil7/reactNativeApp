import {
  TouchableOpacity,
  Alert,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";
import { theme } from "../themes/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

type Props = {
  name?: string;
  isCompleted?: boolean;
  onDelete: () => void;
  onToggleComplete: () => void;
};

export function ShoppingListItem({
  name,
  isCompleted,
  onDelete,
  onToggleComplete,
}: Props) {
  const handleDelete = () => {
    Alert.alert(
      `Are you sure you want to delete this ${name}?`,
      "This action cannot be undone.",
      [
        {
          text: "Yes",
          onPress: () => onDelete(),
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <Pressable
      style={[
        styles.itemContainer,
        isCompleted ? styles.completedContainer : undefined,
      ]}
      onPress={onToggleComplete}
    >
      <View style={styles.row}>
        <Entypo
          name={isCompleted ? "check" : "circle"}
          size={24}
          color={ isCompleted ? theme.colorGrey : theme.colorCerulean}  
        />
        <Text
          numberOfLines={1}
          style={[
            styles.itemText,
            isCompleted ? styles.completedText : undefined,
          ]}
        >
          {" "}
          {name}
        </Text>
      </View>
      <TouchableOpacity onPress={handleDelete}>
        <AntDesign
          name="closecircle"
          size={24}
          color={isCompleted ? theme.colorGrey : theme.colorRed}
        />
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    justifyContent: "center",
  },
  completedContainer: {
    backgroundColor: theme.colorLightGrey,
    borderBottomColor: theme.colorLightGrey,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: theme.colorGrey,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colorCerulean,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  itemText: {
    fontWeight: "200",
    fontSize: 18,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
});
