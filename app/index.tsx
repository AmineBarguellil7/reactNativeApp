import {
  StyleSheet,
  TextInput,
  FlatList,
  View,
  Text,
} from "react-native";
import { theme } from "../themes/theme";
import { ShoppingListItem } from "@/components/ShoppingListItem";
import { useEffect, useState } from "react";
import { getFromStorage, saveToStorage } from "@/utils/storage";


type ShoppingListItemProps = {
  id: string;
  name: string;
  completedAtTimeStamp?: number;
  lastUpdatedTimestamp: number;
};

const storageKey = "shopping-list";

export default function HomeScreen() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItemProps[]>([]);

  const [value, setValue] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      const data = await getFromStorage(storageKey);
      if (data) {
        setShoppingList(data);
      }
    };
    fetchInitialData();
  }, []);

  const handleSubmit = () => {
    if (value) {
      const newShoppingList = [
        {
          id: new Date().toTimeString(),
          name: value,
          lastUpdatedTimestamp: Date.now(),
        },
        ...shoppingList,
      ];
      setShoppingList(newShoppingList);
      saveToStorage(storageKey, shoppingList);
      setValue("");
    }
  };

  const handleDelete = (id: string) => {
    const newShoppingList = shoppingList.filter((item) => item.id !== id);
    setShoppingList(newShoppingList);
    saveToStorage(storageKey, shoppingList);
  };

  const handleToggleComplete = (id: string) => {
    const newShoppingList = shoppingList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          lastUpdatedTimestamp: Date.now(),
          completedAtTimeStamp: item.completedAtTimeStamp
            ? undefined
            : Date.now(),
        };
      }
      return item;
    });
    setShoppingList(newShoppingList);
    saveToStorage(storageKey, shoppingList);
  };

  return (
    <FlatList
      data={orderShoppingList(shoppingList)}
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text>
            No items in your shopping list. Add some items to get started!
          </Text>
        </View>
      }
      ListHeaderComponent={
        <TextInput
          placeholder="e.g coffee"
          style={styles.textInput}
          value={value}
          onChangeText={setValue}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
      }
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      renderItem={({ item }) => (
        <ShoppingListItem
          name={item.name}
          onDelete={() => handleDelete(item.id)}
          onToggleComplete={() => handleToggleComplete(item.id)}
          isCompleted={Boolean(item.completedAtTimeStamp)}
        />
      )}
    />
  );
}

function orderShoppingList(shoppingList: ShoppingListItemProps[]) {
  return shoppingList.sort((a, b) => {
    if (a.completedAtTimeStamp && b.completedAtTimeStamp) {
      return b.completedAtTimeStamp - a.completedAtTimeStamp;
    }
    if (a.completedAtTimeStamp && !b.completedAtTimeStamp) {
      return 1;
    }
    if (!a.completedAtTimeStamp && b.completedAtTimeStamp) {
      return -1;
    }
    if (!a.completedAtTimeStamp && !b.completedAtTimeStamp) {
      return b.lastUpdatedTimestamp - a.lastUpdatedTimestamp;
    }
    return 0;
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    paddingVertical: 12,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  listEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
  textInput: {
    borderColor: theme.colorLightGrey,
    borderWidth: 2,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    fontSize: 18,
    borderRadius: 50,
    backgroundColor: theme.colorWhite,
  },
});
