import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image, Modal, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import { router, Stack } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ClientForm {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
}

interface UserData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  enterprise: {
    id: number;
    name: string;
  };
}

const Dashboard = () => {
  const [formData, setFormData] = useState<ClientForm>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        } else {
          // Rediriger vers la page de connexion si aucune donnée utilisateur n'est trouvée
          router.push("/login");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
        router.push("/login");
      }
    };

    loadUserData();
  }, []);

  const validateForm = () => {
    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone) {
      setError("Veuillez remplir tous les champs obligatoires");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Veuillez entrer une adresse email valide");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError("");

    try {
      // TODO: Remplacer par votre appel API réel
      const response = await fetch('VOTRE_URL_API/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du client');
      }

      const data = await response.json();
      setQrCodeUrl(data.qrCodeUrl);
      setShowSuccess(true);
      setShowForm(false);
      
      // Réinitialiser le formulaire
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        adresse: "",
      });
    } catch (error) {
      setError("Une erreur est survenue lors de la création du client");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      router.push("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ 
        title: 'Tableau de bord', 
        headerTitle: () => (
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
              <Ionicons name="person-outline" size={20} color="#3c2f9a" />
            </View>
            <View>
              <Text className="text-white font-semibold">
                {userData?.firstname} {userData?.lastname}
              </Text>
              <Text className="text-white text-xs opacity-80">
                {userData?.enterprise?.name || "Votre entreprise"}
              </Text>
            </View>
          </View>
        ),
        headerStyle: {
          backgroundColor: "#3c2f9a"
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerLeft: () => (
          <></>
        ),
        headerRight: () => (
          <View className="flex-row">
            <TouchableOpacity 
              onPress={() => setShowForm(true)}
              className="mr-4"
            >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )
      }} />
      
      <ScrollView className="flex-1">
        <View className="p-4">
          {!showForm && (
            <View className="bg-white rounded-xl p-5 shadow-sm mb-4">
              <View className="bg-blue-50 p-4 rounded-lg mb-4">
                <Text className="text-blue-800 font-medium mb-2">Conseil rapide</Text>
                <Text className="text-blue-700">Cliquez sur le bouton "+" en haut à droite pour créer un nouveau client.</Text>
              </View>
              
              <View className="flex-row justify-between">
                <View className="bg-purple-50 p-4 rounded-lg flex-1 mr-2">
                  <Ionicons name="people-outline" size={24} color="#7c3aed" />
                  <Text className="text-purple-800 font-semibold mt-2">Clients</Text>
                  <Text className="text-purple-700">0</Text>
                </View>
                <View className="bg-green-50 p-4 rounded-lg flex-1 ml-2">
                  <Ionicons name="card-outline" size={24} color="#059669" />
                  <Text className="text-green-800 font-semibold mt-2">Cartes</Text>
                  <Text className="text-green-700">0</Text>
                </View>
              </View>
            </View>
          )}
          
          {showForm && (
            <View className="bg-white rounded-xl p-5 shadow-sm mb-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-semibold text-gray-800">Créer un nouveau client</Text>
                <TouchableOpacity onPress={() => setShowForm(false)}>
                  <Ionicons name="close-circle-outline" size={24} color="#4B5563" />
                </TouchableOpacity>
              </View>

              {error ? (
                <View className="bg-red-50 p-3 rounded-lg mb-4 flex-row items-center">
                  <Ionicons name="alert-circle" size={20} color="#ef4444" />
                  <Text className="text-red-500 ml-2 flex-1">{error}</Text>
                </View>
              ) : null}

              {showSuccess && qrCodeUrl ? (
                <View className="items-center mb-4">
                  <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-2">
                    <Ionicons name="checkmark" size={32} color="#059669" />
                  </View>
                  <Text className="text-green-600 font-semibold mb-2">Client créé avec succès !</Text>
                  <Text className="text-gray-600 text-center mb-4">Voici le QR code de la carte de fidélité</Text>
                  <Image 
                    source={{ uri: qrCodeUrl }} 
                    className="w-48 h-48"
                    style={{ width: 200, height: 200 }}
                  />
                  <TouchableOpacity 
                    onPress={() => {
                      setShowSuccess(false);
                      setShowForm(false);
                    }}
                    className="mt-4 bg-blue-600 px-6 py-3 rounded-lg"
                  >
                    <Text className="text-white font-medium">Fermer</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                  <View className="mb-4">
                    <Text className="text-gray-600 mb-1 ml-1">Nom *</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-lg bg-white">
                      <View className="pl-3">
                        <Ionicons name="person-outline" size={20} color="#9ca3af" />
                      </View>
                      <TextInput
                        className="flex-1 p-3"
                        value={formData.nom}
                        onChangeText={(text) => setFormData({ ...formData, nom: text })}
                        placeholder="Entrez le nom"
                      />
                    </View>
                  </View>

                  <View className="mb-4">
                    <Text className="text-gray-600 mb-1 ml-1">Prénom *</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-lg bg-white">
                      <View className="pl-3">
                        <Ionicons name="person-outline" size={20} color="#9ca3af" />
                      </View>
                      <TextInput
                        className="flex-1 p-3"
                        value={formData.prenom}
                        onChangeText={(text) => setFormData({ ...formData, prenom: text })}
                        placeholder="Entrez le prénom"
                      />
                    </View>
                  </View>

                  <View className="mb-4">
                    <Text className="text-gray-600 mb-1 ml-1">Email *</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-lg bg-white">
                      <View className="pl-3">
                        <Ionicons name="mail-outline" size={20} color="#9ca3af" />
                      </View>
                      <TextInput
                        className="flex-1 p-3"
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        placeholder="Entrez l'email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                  </View>

                  <View className="mb-4">
                    <Text className="text-gray-600 mb-1 ml-1">Téléphone *</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-lg bg-white">
                      <View className="pl-3">
                        <Ionicons name="call-outline" size={20} color="#9ca3af" />
                      </View>
                      <TextInput
                        className="flex-1 p-3"
                        value={formData.telephone}
                        onChangeText={(text) => setFormData({ ...formData, telephone: text })}
                        placeholder="Entrez le numéro de téléphone"
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>

                  <View className="mb-6">
                    <Text className="text-gray-600 mb-1 ml-1">Adresse</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-lg bg-white">
                      <View className="pl-3">
                        <Ionicons name="location-outline" size={20} color="#9ca3af" />
                      </View>
                      <TextInput
                        className="flex-1 p-3"
                        value={formData.adresse}
                        onChangeText={(text) => setFormData({ ...formData, adresse: text })}
                        placeholder="Entrez l'adresse"
                        multiline
                        numberOfLines={3}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    className={`w-full p-3 rounded-lg ${loading ? 'bg-blue-300' : 'bg-blue-600'}`}
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-center text-white font-semibold text-lg">Créer le client</Text>
                    )}
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;