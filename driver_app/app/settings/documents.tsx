import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal, 
  Alert,
  Linking,
} from "react-native";

import API from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useTheme } from "../../context/ThemeContext";
type DocumentType = {
  id: string;
  title: string;
  icon: string;

  status: string;

  color: string;

  file?: any;

  fileName?: string;

  uploadedAt?: string;
};

export default function DocumentsScreen() {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [driverName, setDriverName] = useState("");

  const [documents, setDocuments] = useState<DocumentType[]>([
    {
      id: "license",
      title: "Driving Licence",
      icon: "card-account-details",
      status: "Missing",
      color: "#EF4444",
    },
    {
      id: "aadhaar",
      title: "Aadhaar Card",
      icon: "card-account-details-outline",
      status: "Missing",
      color: "#EF4444",
    },
    {
      id: "pan",
      title: "PAN Card",
      icon: "credit-card-outline",
      status: "Missing",
      color: "#F59E0B",
    },
    {
      id: "rc_book",
      title: "Vehicle RC Book",
      icon: "truck",
      status: "Missing",
      color: "#EF4444",
    },
    {
      id: "insurance",
      title: "Vehicle Insurance",
      icon: "shield-check",
      status: "Missing",
      color: "#EF4444",
    },
    {
      id: "puc",
      title: "PUC Certificate",
      icon: "leaf",
      status: "Missing",
      color: "#EF4444",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
  try {
    const name =
      (await AsyncStorage.getItem("driver_name")) || "";

    const driverId =
      await AsyncStorage.getItem("driver_id");

    setDriverName(name);

    if (!driverId) {
      setLoading(false);
      return;
    }

    const res = await API.get(
      `/driver/documents/${driverId}`
    );

    const docs = res.data.documents;

    setDocuments((prev) =>
      prev.map((doc) => {
        const serverDoc = docs[doc.id];

        if (!serverDoc) return doc;

        return {
          ...doc,
          status: serverDoc.status || "Missing",
          color:
            serverDoc.status === "Verified"
              ? "#22C55E"
              : serverDoc.status === "Pending Verification"
              ? "#F59E0B"
              : "#EF4444",
          file: serverDoc.url,
          fileName: serverDoc.url
          ? doc.title
          : undefined,
        };
      })
    );
  } catch (err) {
    console.log("Load Documents Error:", err);
  } finally {
    setLoading(false);
  }
};

  const openUploadModal = (doc: DocumentType) => {
    setSelectedDoc(doc);
    setModalVisible(true);
  };

  const pickFile = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: "*/*",
  });

  if (result.assets && result.assets.length > 0) {
    return result.assets[0];
  }

  return null;
};

// ==========================
// UPLOAD DOCUMENT
// ==========================

const uploadDocument = async () => {
  try {
    if (!selectedDoc?.file) {
      Alert.alert("Error", "Please select a file first.");
      return;
    }

    const driverId = await AsyncStorage.getItem("driver_id");

    if (!driverId) {
      Alert.alert("Error", "Driver not found.");
      return;
    }

    const formData = new FormData();

    formData.append("driver_id", driverId);

    formData.append(
      "document_type",
      selectedDoc.id === "dl"
        ? "license"
        : selectedDoc.id
    );
    console.log("============ FILE ============");
    console.log("URI :", selectedDoc.file.uri);
    console.log("NAME:", selectedDoc.file.name);
    console.log("TYPE:", selectedDoc.file.mimeType);
    console.log("FILE:", selectedDoc.file);
    console.log("==============================");
    formData.append("file", {
      uri: selectedDoc.file.uri,
      name: selectedDoc.file.name,
      type: selectedDoc.file.mimeType || "application/octet-stream",
    } as any);

    const response = await API.post(
      "/driver/documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.status === "success") {

      const updatedDoc = {
        ...selectedDoc,

        // Save Cloudinary URL (IMPORTANT)
        file: response.data.url,

        // Display original filename
        fileName: selectedDoc.file.name,

        status: "Pending Verification",
        color: "#F59E0B",

        uploadedAt: new Date().toLocaleString(),
      };

      setSelectedDoc(updatedDoc);

      setDocuments((prev) =>
        prev.map((d) =>
          d.id === selectedDoc.id
            ? updatedDoc
            : d
        )
      );

      Alert.alert(
        "Success",
        "Document uploaded successfully."
      );

      setModalVisible(false);

    } else {
      Alert.alert("Error", "Upload failed.");
    }

  } catch (error: any) {

    console.log("UPLOAD ERROR:", error);

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DATA:", error.response.data);

      Alert.alert(
        "Upload Failed",
        JSON.stringify(error.response.data)
      );

    } else {
      Alert.alert(
        "Upload Failed",
        error.message
      );
    }
  }
};

// ==========================
// LOADING
// ==========================

if (loading) {
  return (
    <View
      style={[
        styles.loading,
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
    </View>
  );
}

return (
  <ScrollView
    style={{
      flex: 1,
      backgroundColor:
        theme.colors.background,
    }}
    contentContainerStyle={{
      padding: 20,
      paddingBottom: 40,
    }}
  >
    {/* Header */}
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={28}
          color={theme.colors.text}
        />
      </TouchableOpacity>

      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
          },
        ]}
      >
        Documents
      </Text>

      <View style={{ width: 28 }} />
    </View>

      {/* ===================== DRIVER CARD ===================== */}

<View
  style={[
    styles.driverCard,
    {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
    },
  ]}
>
  <MaterialCommunityIcons
    name="account-circle"
    size={72}
    color={theme.colors.primary}
  />

  <Text
    style={{
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text,
      marginTop: 10,
    }}
  >
    {driverName}
  </Text>

  <Text
    style={{
      color: theme.colors.secondary,
      marginTop: 5,
      fontSize: 14,
    }}
  >
    Driver Document Center
  </Text>
</View>

{/* ===================== DOCUMENT LIST ===================== */}

{documents.map((doc) => (
  <DocumentCard
    key={doc.id}
    doc={doc}
    onUpload={() => openUploadModal(doc)}
  />
))}

{/* ===================== UPLOAD MISSING DOCUMENTS ===================== */}

<TouchableOpacity
  style={[
    styles.button,
    {
      backgroundColor: theme.colors.primary,
    },
  ]}
  onPress={() => {
    const missing = documents.find(
      (d) => !d.file
    );

    if (!missing) {
      alert("All documents have already been uploaded.");
      return;
    }

    openUploadModal(missing);
  }}
>
  <MaterialCommunityIcons
    name="upload"
    size={22}
    color="white"
  />

  <Text style={styles.buttonText}>
    Upload Missing Documents
  </Text>
</TouchableOpacity>

{/* ===================== UPLOAD MODAL ===================== */}

<Modal
  visible={modalVisible}
  animationType="fade"
  transparent
>
  <View style={styles.modalOverlay}>
    <View
      style={[
        styles.modalBox,
        {
          backgroundColor: theme.colors.card,
        },
      ]}
    >

      <MaterialCommunityIcons
        name="file-upload-outline"
        size={58}
        color={theme.colors.primary}
        style={{
          alignSelf: "center",
          marginBottom: 15,
        }}
      />

      <Text
        style={[
          styles.modalTitle,
          {
            color: theme.colors.text,
            textAlign: "center",
          },
        ]}
      >
        Upload Document
      </Text>

      {selectedDoc && (
        <>
          <View
            style={{
              alignItems: "center",
              marginTop: 8,
              marginBottom: 20,
            }}
          >
            <MaterialCommunityIcons
              name={selectedDoc.icon as any}
              size={42}
              color={theme.colors.primary}
            />

            <Text
              style={{
                marginTop: 10,
                fontSize: 18,
                fontWeight: "700",
                color: theme.colors.text,
              }}
            >
              {selectedDoc.title}
            </Text>

            <Text
              style={{
                marginTop: 4,
                textAlign: "center",
                color: theme.colors.secondary,
                fontSize: 14,
              }}
            >
              Upload a clear copy of your document.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: theme.colors.background,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <MaterialCommunityIcons
                name="information-outline"
                size={20}
                color={theme.colors.primary}
              />

              <Text
                style={{
                  marginLeft: 8,
                  fontWeight: "700",
                  color: theme.colors.text,
                }}
              >
                Upload Requirements
              </Text>
            </View>

            <Text
              style={{
                color: theme.colors.secondary,
                lineHeight: 24,
                fontSize: 14,
              }}
            >
              • PDF, JPG or PNG{"\n"}
              • Maximum Size: 5 MB{"\n"}
              • Document should be clear{"\n"}
              • Blurred documents may be rejected
            </Text>
          </View>
        </>
      )}
            {/* SELECT FILE BUTTON */}

            <TouchableOpacity
              style={[
                styles.pickBtn,
                {
                  backgroundColor:
                    theme.colors.primary,
                },
              ]}
              onPress={async () => {
                const file = await pickFile();

                  if (!file || !selectedDoc) return;

                  const updatedDoc = {
                    ...selectedDoc,
                    file,
                    fileName: file.name,
                    uploadedAt: new Date().toLocaleString(),
                    status: "Pending Verification",
                    color: "#F59E0B",
                  };

                  setSelectedDoc(updatedDoc);

                  setDocuments((prev) =>
                    prev.map((d) =>
                      d.id === selectedDoc.id
                        ? updatedDoc
                        : d
                    )
                  );
              }}
            >
              <MaterialCommunityIcons
                name="paperclip"
                color="white"
                size={20}
              />

              <Text
                style={{
                  color: "white",
                  fontWeight: "700",
                  marginLeft: 8,
                  fontSize: 15,
                }}
              >
                Choose File
              </Text>
            </TouchableOpacity>

            {/* FILE PREVIEW */}

            <View
              style={{
                marginTop: 18,
                marginBottom: 22,
                alignItems: "center",
              }}
            >
              {selectedDoc?.file ? (
                <>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={28}
                    color="#22C55E"
                  />

                  <Text
                    style={{
                      marginTop: 8,
                      fontWeight: "700",
                      color:
                        theme.colors.text,
                      textAlign: "center",
                    }}
                  >
                    {selectedDoc.file.name}
                  </Text>

                  <Text
                    style={{
                      color: "#22C55E",
                      marginTop: 4,
                    }}
                  >
                    File Selected Successfully
                  </Text>
                </>
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="file-outline"
                    size={30}
                    color={
                      theme.colors.secondary
                    }
                  />

                  <Text
                    style={{
                      marginTop: 8,
                      color:
                        theme.colors.secondary,
                    }}
                  >
                    No file selected
                  </Text>
                </>
              )}
            </View>

            {/* BUTTONS */}

            <View
              style={{
                flexDirection: "row",
                justifyContent:
                  "space-between",
              }}
            >
              <TouchableOpacity
                style={[
                  styles.cancelBtn,
                  {
                    flex: 1,
                    marginRight: 10,
                    borderWidth: 1,
                    borderColor: "#EF4444",
                    borderRadius: 12,
                    alignItems: "center",
                    paddingVertical: 14,
                  },
                ]}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedDoc(null);
                }}
              >
                <Text
                  style={{
                    color: "#EF4444",
                    fontWeight: "700",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  {
                    flex: 1,
                    marginLeft: 10,
                    borderRadius: 12,
                    alignItems: "center",
                    paddingVertical: 14,
                  },
                ]}
                onPress={uploadDocument}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "700",
                  }}
                >
                  Upload Document
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

/* ===================== DOCUMENT CARD ===================== */

function DocumentCard({
  doc,
  onUpload,
}: any) {
  const { theme } = useTheme();

  const downloadFile = async () => {
  try {
    console.log("DOC OBJECT:", doc);

    const fileUrl = doc.file;

    if (!fileUrl) {
      Alert.alert("Error", "No document found.");
      return;
    }

    console.log("Opening:", fileUrl);

    const supported = await Linking.canOpenURL(fileUrl);

    if (!supported) {
      Alert.alert("Error", "This device cannot open the document.");
      return;
    }

    await Linking.openURL(fileUrl);

  } catch (e) {
    console.log("DOWNLOAD ERROR:", e);
    Alert.alert("Error", "Failed to open document.");
  }
};

  return (
  <View
    style={[
      styles.documentCard,
      {
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.border,
      },
    ]}
  >
    {/* Left Icon */}
    <MaterialCommunityIcons
      name={doc.icon}
      size={30}
      color={theme.colors.primary}
    />

    {/* Content */}
    <View
      style={{
        flex: 1,
        marginLeft: 15,
      }}
    >
      {/* Document Title */}

      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: theme.colors.text,
        }}
      >
        {doc.title}
      </Text>

      {/* Status */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <MaterialCommunityIcons
          name={
            doc.status === "Verified"
              ? "check-decagram"
              : doc.status === "Pending Verification"
              ? "clock-outline"
              : doc.status === "Rejected"
              ? "close-circle"
              : "alert-circle"
          }
          size={18}
          color={doc.color}
        />

        <Text
          style={{
            marginLeft: 6,
            color: doc.color,
            fontWeight: "700",
            fontSize: 14,
          }}
        >
          {doc.status}
        </Text>
      </View>

  {/* FILE NAME */}

  {doc.fileName && (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
      }}
    >
      <MaterialCommunityIcons
        name="file-document-outline"
        size={18}
        color={theme.colors.primary}
      />

      <Text
        style={{
          marginLeft: 6,
          color: theme.colors.text,
          fontSize: 13,
          flex: 1,
        }}
        numberOfLines={1}
      >
        {doc.fileName}
      </Text>
    </View>
  )}

  {/* UPLOAD DATE */}

  {doc.uploadedAt && (
    <Text
      style={{
        marginTop: 6,
        color: theme.colors.secondary,
        fontSize: 12,
      }}
    >
      Uploaded : {doc.uploadedAt}
    </Text>
  )}

  {/* ACTION BUTTONS */}

  <View
    style={{
      flexDirection: "row",
      marginTop: 14,
      alignItems: "center",
    }}
  >
    {/* Upload / Replace */}

    <TouchableOpacity
      onPress={onUpload}
      style={{ marginRight: 22 }}
    >
      <Text
        style={{
          color: "#2563EB",
          fontWeight: "700",
        }}
      >
        {doc.file ? "Replace" : "Upload"}
      </Text>
    </TouchableOpacity>

    {/* Download */}

    <TouchableOpacity
      disabled={!doc.file}
      onPress={downloadFile}
    >
      <Text
        style={{
          color: doc.file ? "#10B981" : "#9CA3AF",
          fontWeight: "700",
        }}
      >
        Download
      </Text>
    </TouchableOpacity>
  </View>

</View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={28}
        color={theme.colors.secondary}
      />
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  driverCard: {
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },

  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },

  button: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 10,
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },

  modalBox: {
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },

  pickBtn: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelBtn: {
    padding: 10,
  },

  saveBtn: {
    backgroundColor: "#3B82F6",
    padding: 10,
    borderRadius: 8,
  },
});