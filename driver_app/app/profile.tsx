import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";
import { router } from "expo-router";

// =====================================
// TYPES
// =====================================

interface DriverProfile {
  id?: number;
  name: string;
  mobile: string;
  vehicle_no: string;
  vehicle_type: string;
  earnings?: number;
  photo?: string | null;
}

// =====================================
// MAIN COMPONENT
// =====================================

export default function Profile() {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [driverId, setDriverId] = useState<number | null>(null);

  const [name, setName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [vehicleNo, setVehicleNo] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");

  const [documents, setDocuments] = useState<any>(null);

  const [photo, setPhoto] = useState<string | null>(null);

  const [earnings, setEarnings] = useState<number>(0);

  // =====================================
  // LOAD PROFILE
  // =====================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const storedId = await AsyncStorage.getItem("driver_id");

      if (!storedId) {
        Alert.alert("Session Expired", "Please login again");
        router.replace("/login");
        return;
      }

      const id = Number(storedId);

      if (Number.isNaN(id)) {
        Alert.alert("Error", "Invalid driver session");
        router.replace("/login");
        return;
      }

      setDriverId(id);

      // =========================
      // PROFILE API CALL
      // =========================
      const response = await API.get(`/driver/profile/${id}`);

      if (response?.data?.status === "success") {
        const driver: DriverProfile = response.data.driver;

        setName(driver?.name ?? "");
        setMobile(driver?.mobile ?? "");
        setVehicleNo(driver?.vehicle_no ?? "");
        setVehicleType(driver?.vehicle_type ?? "");
        setPhoto(driver?.photo ?? null);
        setEarnings(driver?.earnings ?? 0);
      } else {
        Alert.alert(
          "Error",
          response?.data?.message || "Failed to load profile"
        );
      }

      // =========================
      // DOCUMENT API CALL
      // =========================
      const docRes = await API.get(`/driver/documents/${id}`);

      if (docRes?.data?.status === "success") {
        setDocuments(docRes.data.documents);
      }

    } catch (error: unknown) {
        const err = error as { response?: { data?: any } };

      console.log("PROFILE LOAD ERROR:", err?.response?.data || error);

      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to load profile"
      );

    } finally {
      setLoading(false);
    }
  };


  const pickProfilePhoto = async () => {
    if (!driverId) return;

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Gallery permission required");
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

    if (result.canceled) return;

    const image = result.assets[0];

    const formData = new FormData();

    formData.append("driver_id", String(driverId));

    formData.append("file", {
      uri: image.uri,
      type: "image/jpeg",
      name: "profile.jpg",
    } as any);

    try {
      const response = await API.post(
        "/driver/upload-profile-photo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        setPhoto(response.data.photo);
        Alert.alert("Success", "Profile photo updated");
      }

    } catch (error: any) {
        console.log(error);
        Alert.alert("Error", "Photo upload failed");
      }
  };

  // =====================================
  // UPDATE PROFILE
  // =====================================

  const updateProfile = async () => {
    try {
      if (!driverId) {
        Alert.alert("Error", "Driver not found");
        return;
      }

      // =========================
      // VALIDATION
      // =========================

      if (!name?.trim()) {
        Alert.alert("Validation", "Please enter full name");
        return;
      }

      if (!mobile?.trim() || !/^[0-9]{10}$/.test(mobile.trim())) {
        Alert.alert("Validation", "Enter valid mobile number");
        return;
      }

      if (!vehicleNo?.trim()) {
        Alert.alert("Validation", "Vehicle number is required");
        return;
      }

      if (!vehicleType?.trim()) {
        Alert.alert("Validation", "Vehicle type is required");
        return;
      }

      // prevent multiple clicks
      if (saving) return;

      setSaving(true);

      const payload = {
        driver_id: driverId,
        name: name.trim(),
        mobile: mobile.trim(),
        vehicle_no: vehicleNo.trim(),
        vehicle_type: vehicleType.trim(),
      };

      console.log("UPDATE PAYLOAD:", payload);

      const response = await API.post(
        "/driver/update-profile",
        payload
      );

      if (response?.data?.status === "success") {
        Alert.alert(
          "Success",
          "Profile updated successfully ✔",
          [
            {
              text: "OK",
              onPress: () => {
                console.log("Profile update confirmed");
              },
            },
          ]
        );

        console.log("PROFILE UPDATED SUCCESS:", response?.data);
      } else {
        Alert.alert(
          "Error",
          response?.data?.message || "Update failed"
        );
      }

    } catch (error: unknown) {
      const err = error as any;

      console.log("UPDATE ERROR:", err?.response?.data || error);

      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to update profile"
      );

    } finally {
      setSaving(false);
    }
  };
    // =====================================
  // LOADING SCREEN
  // =====================================

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563EB" />

        <Text style={{ marginTop: 10 }}>
          Loading Profile...
        </Text>
      </View>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ================= PROFILE HEADER ================= */}

      <LinearGradient
        colors={["#2563EB", "#3B82F6"]}
        style={styles.profileHeader}
      >

        <TouchableOpacity onPress={pickProfilePhoto}>

          <Image
            source={
              photo
                ? { uri: photo }
                : require("../assets/profile.png")
            }
            style={styles.profileImage}
          />

        </TouchableOpacity>

        <Text style={styles.driverName}>
          {name || "Driver"}
        </Text>

        <Text style={styles.driverId}>
          Driver ID : #{driverId}
        </Text>

        <TouchableOpacity
          style={styles.changePhotoButton}
          onPress={pickProfilePhoto}
        >
          <Text style={styles.changePhotoText}>
            Change Photo
          </Text>
        </TouchableOpacity>

      </LinearGradient>

      <View style={styles.photoContainer}>
        <Image
          source={
            photo
              ? { uri: photo }
              : require("../assets/profile.png")
          }
          style={styles.photo}
        />

        <TouchableOpacity
          style={styles.photoButton}
          onPress={pickProfilePhoto}
        >
          <Text style={styles.photoButtonText}>
            Change Photo
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= EARNINGS CARD ================= */}

      <View style={styles.earningsCard}>

        <Text style={styles.earningsTitle}>
          💰 Total Earnings
        </Text>

        <Text style={styles.earningsAmount}>
          ₹ {earnings.toLocaleString()}
        </Text>

      </View>

      {/* ================= DOCUMENTS ================= */}

      <View style={styles.card}>

        <Text style={styles.cardTitle}>
          📄 Driver Documents
        </Text>

        <View style={styles.docRow}>
          <Text style={styles.docName}>🪪 License</Text>

          <Text
            style={[
              styles.docStatus,
              documents?.license_status === "Approved"
                ? styles.green
                : documents?.license_status === "Pending Verification"
                ? styles.orange
                : documents?.license_status === "Rejected"
                ? styles.red
                : styles.gray,
            ]}
          >
            {documents?.license_status ?? "Missing"}
          </Text>
        </View>

        {documents?.license_rejection_reason && (
          <Text style={styles.rejectReason}>
            Reason : {documents.license_rejection_reason}
          </Text>
        )}

        <View style={styles.docRow}>
          <Text style={styles.docName}>🆔 Aadhaar</Text>

          <Text
            style={[
              styles.docStatus,
              documents?.aadhaar_status === "Approved"
                ? styles.green
                : documents?.aadhaar_status === "Pending Verification"
                ? styles.orange
                : documents?.aadhaar_status === "Rejected"
                ? styles.red
                : styles.gray,
            ]}
          >
            {documents?.aadhaar_status ?? "Missing"}
          </Text>
        </View>

        <View style={styles.docRow}>
          <Text style={styles.docName}>💳 PAN</Text>

          <Text
            style={[
              styles.docStatus,
              documents?.pan_status === "Approved"
                ? styles.green
                : documents?.pan_status === "Pending Verification"
                ? styles.orange
                : documents?.pan_status === "Rejected"
                ? styles.red
                : styles.gray,
            ]}
          >
            {documents?.pan_status ?? "Missing"}
          </Text>
        </View>

        <View style={styles.docRow}>
          <Text style={styles.docName}>📘 RC Book</Text>

          <Text
            style={[
              styles.docStatus,
              documents?.rc_book_status === "Approved"
                ? styles.green
                : documents?.rc_book_status === "Pending Verification"
                ? styles.orange
                : documents?.rc_book_status === "Rejected"
                ? styles.red
                : styles.gray,
            ]}
          >
            {documents?.rc_book_status ?? "Missing"}
          </Text>
        </View>

        <View style={styles.docRow}>
          <Text style={styles.docName}>🛡 Insurance</Text>

          <Text
            style={[
              styles.docStatus,
              documents?.insurance_status === "Approved"
                ? styles.green
                : documents?.insurance_status === "Pending Verification"
                ? styles.orange
                : documents?.insurance_status === "Rejected"
                ? styles.red
                : styles.gray,
            ]}
          >
            {documents?.insurance_status ?? "Missing"}
          </Text>
        </View>

        <View style={styles.docRow}>
          <Text style={styles.docName}>🚗 PUC</Text>

          <Text
            style={[
              styles.docStatus,
              documents?.puc_status === "Approved"
                ? styles.green
                : documents?.puc_status === "Pending Verification"
                ? styles.orange
                : documents?.puc_status === "Rejected"
                ? styles.red
                : styles.gray,
            ]}
          >
            {documents?.puc_status ?? "Missing"}
          </Text>
        </View>

      </View>

            {/* ================= PROFILE CARD ================= */}

            <View style={styles.card}>

              {/* Profile Photo */}

              <View style={styles.photoContainer}>

                <Image
                  source={
                    photo
                      ? { uri: photo }
                      : require("../assets/profile.png")
                  }
                  style={styles.profilePhoto}
                />

                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={pickProfilePhoto}
                >
                  <Text style={styles.photoButtonText}>
                    Change Photo
                  </Text>
                </TouchableOpacity>

              </View>

              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
              />

              <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
                onChangeText={setMobile}
              />

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

              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  saving && styles.disabledBtn,
                ]}
                onPress={updateProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.btnText}>
                    💾 Save Changes
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => router.back()}
              >
                <Text style={styles.btnText}>
                  ⬅ Back
                </Text>
              </TouchableOpacity>

            </View>
    </ScrollView>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FA",
    padding: 20,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    color: "#111827",
  },

    // ==========================
  // PROFILE PHOTO
  // ==========================

  photoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#2563EB",
    backgroundColor: "#E5E7EB",
  },

  photoButton: {
    marginTop: 12,
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  photoButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
    elevation: 4,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  cardTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#111827",
  marginBottom: 12,
},

    input: {
      backgroundColor: "#FFFFFF",
      borderWidth: 1,
      borderColor: "#D1D5DB",
      borderRadius: 12,
      padding: 15,
      marginBottom: 14,
      fontSize: 16,
      color: "#111827",
    },

      profileHeader: {
      borderRadius: 22,
      paddingVertical: 30,
      alignItems: "center",
      marginTop: 20,
      marginBottom: 20,
    },

    profileImage: {
      width: 130,
      height: 130,
      borderRadius: 65,
      borderWidth: 4,
      borderColor: "#FFFFFF",
      backgroundColor: "#E5E7EB",
    },

    driverName: {
      color: "#FFFFFF",
      fontSize: 24,
      fontWeight: "bold",
      marginTop: 15,
    },

    docRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  docName: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },

  docStatus: {
    fontWeight: "bold",
    fontSize: 14,
  },

  green: {
    color: "#16A34A",
  },

  orange: {
    color: "#F59E0B",
  },

  red: {
    color: "#DC2626",
  },

  gray: {
    color: "#6B7280",
  },

  rejectReason: {
    color: "#DC2626",
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 5,
    fontStyle: "italic",
  },

    earningsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    alignItems: "center",

    elevation: 4,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  earningsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6B7280",
  },

  earningsAmount: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#16A34A",
    marginTop: 10,
  },

  driverId: {
    color: "#E5E7EB",
    fontSize: 15,
    marginTop: 4,
  },

  changePhotoButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 18,
  },

  changePhotoText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: "#16A34A",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  disabledBtn: {
    opacity: 0.6,
  },

  backBtn: {
    backgroundColor: "#6B7280",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },

  btnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },

photo: {
  width: 130,
  height: 130,
  borderRadius: 65,
  borderWidth: 3,
  borderColor: "#2563EB",
  backgroundColor: "#E5E7EB",
},
});