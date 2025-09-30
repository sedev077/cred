import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

type CredentialDetailModalProps = {
  visible: boolean;
  onClose: () => void;
  credential: { service: string; username: string; password: string; passwordPlaceholder: string } | null;
};

export default function CredentialDetailModal({ visible, onClose, credential }: CredentialDetailModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    if (visible){
      setShowPassword(false);
    }
  }, [visible]);

  if (!credential) return null; // no data, don't render

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{credential.service}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.value}>{credential.username}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Password:</Text>
            <Text style={styles.value}>
              {showPassword ? credential.password : credential.passwordPlaceholder}
            </Text>
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.toggle}>{showPassword ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontWeight: "600",
    marginRight: 8,
  },
  value: {
    flex: 1,
  },
  toggle: {
    color: "#007AFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});