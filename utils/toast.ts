// utils/toast.ts
import Toast from "react-native-toast-message";

export const AppToast = {
  add: {
    success: (message: string) =>
      Toast.show({
        type: "success",
        text1: "Ajouté avec succès",
        text2: message,
        position: 'bottom',
      }),
    error: (message: string) =>
      Toast.show({
        type: "error",
        text1: "Erreur d'ajout",
        text2: message,
        position: 'bottom',
      }),
  },

  update: {
    success: (message: string) =>
      Toast.show({
        type: "success",
        text1: "Mise à jour réussie",
        text2: message,
        position: 'bottom',
      }),
    error: (message: string) =>
      Toast.show({
        type: "error",
        text1: "Échec de la mise à jour",
        text2: message,
        position: 'bottom',
      }),
  },

  delete: {
    success: (message: string) =>
      Toast.show({
        type: "success",
        text1: "Supprimé",
        text2: message,
        position: 'bottom',
      }),
    error: (message: string) =>
      Toast.show({
        type: "error",
        text1: "Échec de suppression",
        text2: message,
        position: 'bottom',
      }),
  },
};