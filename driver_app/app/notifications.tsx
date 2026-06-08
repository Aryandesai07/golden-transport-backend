import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet
} from "react-native";

import API from "../services/api";

export default function Notifications() {

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {

    try {

      const res =
        await API.get(
          "/driver/notifications/1"
        );

      if (res.data.status === "success") {
        setItems(
          res.data.notifications || []
        );
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        🔔 Notifications
      </Text>

      {items.length === 0 ? (
        <Text>No Notifications</Text>
      ) : (
        items.map((item: any) => (
          <View
            key={item.id}
            style={styles.card}
          >
            <Text style={styles.heading}>
              {item.title}
            </Text>

            <Text>
              {item.message}
            </Text>
          </View>
        ))
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F3F6FA"
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12
  },

  heading: {
    fontWeight: "bold",
    marginBottom: 5
  }

});