import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import API from "../services/api";
import { useTheme } from "../context/ThemeContext";

interface DriverProfile {
  id: number;
  name: string;
  mobile: string;
  vehicle_no: string;
  vehicle_type: string;
  earnings: number;
}

interface DriverDocuments {
  license: string | null;
  aadhaar: string | null;
  pan: string | null;
}

export default function Profile() {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [driverId, setDriverId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [earnings, setEarnings] = useState(0);

  const [documents, setDocuments] =
    useState<DriverDocuments>({
      license: null,
      aadhaar: null,
      pan: null,
    });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const id = await AsyncStorage.getItem("driver_id");

      if (!id) {
        Alert.alert("Session Expired");
        router.replace("/");
        return;
      }

      setDriverId(Number(id));

      const profileRes = await API.get(
        `/driver/profile/${id}`
      );

      if (
        profileRes.data.status === "success"
      ) {
        const driver: DriverProfile = profileRes.data.driver;

        setName(driver.name);
        setMobile(driver.mobile);
        setVehicleNo(driver.vehicle_no);
        setVehicleType(driver.vehicle_type);
        setEarnings(
          driver.earnings || 0
        );
      }

      const docRes = await API.get(
        `/driver/documents/${id}`
      );

      if (
        docRes.data.status === "success"
      ) {
        setDocuments(
          docRes.data.documents
        );
      }
    } catch (err) {
      console.log(err);

      Alert.alert(
        "Error",
        "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      if (!driverId) return;

      setSaving(true);

      const response = await API.post(
        "/driver/update-profile",
        {
          driver_id: driverId,
          name,
          mobile,
          vehicle_no: vehicleNo,
          vehicle_type: vehicleType,
        }
      );

      if (
        response.data.status ===
        "success"
      ) {
        Alert.alert(
          "Success",
          "Profile Updated Successfully"
        );
      } else {
        Alert.alert(
          "Error",
          response.data.message
        );
      }
    } catch (err) {
      console.log(err);

      Alert.alert(
        "Error",
        "Update Failed"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loader,
          {
            backgroundColor:
              theme.colors.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />

        <Text
          style={{
            color: theme.colors.text,
            marginTop: 15,
            fontSize: 16,
          }}
        >
          Loading Profile...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor:
            theme.colors.background,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
            {/* ================= HEADER ================= */}

      <View style={styles.headerCard}>
        <Image
          source={{
            uri:
              "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(name),
          }}
          style={styles.avatar}
        />

        <Text
          style={[
            styles.driverName,
            {
              color: theme.colors.text,
            },
          ]}
        >
          {name}
        </Text>

        <Text
          style={[
            styles.driverMobile,
            {
              color: theme.colors.secondary,
            },
          ]}
        >
          {mobile}
        </Text>

        <View style={styles.vehicleBadge}>
          <MaterialCommunityIcons
            name="truck-fast"
            size={18}
            color="#FFF"
          />

          <Text style={styles.vehicleBadgeText}>
            {vehicleType}
          </Text>
        </View>
      </View>

      {/* ================= PROFILE ================= */}

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Personal Information
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Driver Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />
      </View>

      {/* ================= VEHICLE ================= */}

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Vehicle Details
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Vehicle Number"
          value={vehicleNo}
          onChangeText={setVehicleNo}
        />

        <TextInput
          style={styles.input}
          placeholder="Vehicle Type"
          value={vehicleType}
          onChangeText={setVehicleType}
        />
      </View>

      {/* ================= DOCUMENTS ================= */}

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Documents
        </Text>

        <View style={styles.docRow}>
          <MaterialCommunityIcons
            name="card-account-details"
            size={24}
            color="#2563EB"
          />

          <Text
            style={[
              styles.docText,
              {
                color: theme.colors.text,
              },
            ]}
          >
            Driving Licence
          </Text>

          <Text
            style={{
              color: documents.license
                ? "#16A34A"
                : "#EF4444",
              fontWeight: "700",
            }}
          >
            {documents.license
              ? "Uploaded"
              : "Missing"}
          </Text>
        </View>

        <View style={styles.docRow}>
          <MaterialCommunityIcons
            name="card-account-details-outline"
            size={24}
            color="#2563EB"
          />

          <Text
            style={[
              styles.docText,
              {
                color: theme.colors.text,
              },
            ]}
          >
            Aadhaar Card
          </Text>

          <Text
            style={{
              color: documents.aadhaar
                ? "#16A34A"
                : "#EF4444",
              fontWeight: "700",
            }}
          >
            {documents.aadhaar
              ? "Uploaded"
              : "Missing"}
          </Text>
        </View>

        <View style={styles.docRow}>
          <MaterialCommunityIcons
            name="card-text-outline"
            size={24}
            color="#2563EB"
          />

          <Text
            style={[
              styles.docText,
              {
                color: theme.colors.text,
              },
            ]}
          >
            PAN Card
          </Text>

          <Text
            style={{
              color: documents.pan
                ? "#16A34A"
                : "#EF4444",
              fontWeight: "700",
            }}
          >
            {documents.pan
              ? "Uploaded"
              : "Missing"}
          </Text>
        </View>
      </View>

      {/* ================= EARNINGS ================= */}

      <View
        style={[
          styles.earningCard,
          {
            backgroundColor: "#16A34A",
          },
        ]}
      >
        <MaterialCommunityIcons
          name="cash-multiple"
          size={42}
          color="#FFF"
        />

        <Text style={styles.earningTitle}>
          Total Earnings
        </Text>

        <Text style={styles.earningAmount}>
          ₹ {earnings}
        </Text>
      </View>
            {/* ================= BUTTONS ================= */}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={updateProfile}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <MaterialCommunityIcons
              name="content-save"
              size={22}
              color="#FFF"
            />

            <Text style={styles.saveText}>
              Save Changes
            </Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={22}
          color="#FFF"
        />

        <Text style={styles.backText}>
          Back
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerCard: {
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 24,
    paddingVertical: 30,
    marginTop: 15,
    marginBottom: 20,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#FFF",
  },

  driverName: {
    marginTop: 15,
    fontSize: 24,
    fontWeight: "bold",
  },

  driverMobile: {
    marginTop: 5,
    fontSize: 15,
  },

  vehicleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16A34A",
    marginTop: 15,
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },

  vehicleBadgeText: {
    color: "#FFF",
    marginLeft: 8,
    fontWeight: "700",
    fontSize: 15,
  },

  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 18,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFF",
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },

  docRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  docText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "600",
  },

  earningCard: {
    borderRadius: 22,
    alignItems: "center",
    padding: 30,
    marginBottom: 25,
  },

  earningTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
  },

  earningAmount: {
    color: "#FFF",
    fontSize: 34,
    fontWeight: "bold",
    marginTop: 10,
  },

  saveButton: {
    backgroundColor: "#2563EB",
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  saveText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
  },

  backButton: {
    backgroundColor: "#6B7280",
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
  },
});