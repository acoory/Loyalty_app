import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import enterpriseService from "@/services/enterpriseService";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = async () => {
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Name:", name);

    if (!email || !password || !name) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    try {
      const response = await enterpriseService.createEnterprise({ email, password, name });

      console.log("Enterprise created:", response);
      Alert.alert("Succès", "Votre compte a été créé avec succès !");
    } catch (error) {
      console.log("Error:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la création du compte.");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <Text className="text-2xl font-semibold text-gray-800 mb-6">Créer un compte</Text>

      <TextInput className="w-full p-3 mb-4 border border-gray-300 rounded-lg" placeholder="Nom" value={name} onChangeText={setName} />

      <TextInput className="w-full p-3 mb-4 border border-gray-300 rounded-lg" placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />

      <TextInput className="w-full p-3 mb-4 border border-gray-300 rounded-lg" placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity className="w-full bg-blue-500 p-3 rounded-lg" onPress={handleRegister}>
        <Text className="text-center text-white font-semibold">Créer un compte</Text>
      </TouchableOpacity>

      <TouchableOpacity className="mt-4" onPress={() => console.log("Go to Login Screen")}>
        <Text className="text-blue-500 text-center">Vous avez déjà un compte ? Connectez-vous</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;
