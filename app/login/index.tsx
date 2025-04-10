import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import React, { useState } from "react";
import { router, Stack } from "expo-router";
import enterpriseService from "@/services/enterpriseService";
import Config from "react-native-config";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from "@/services/authService";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  console.log("Config.API_URL", Config.API_URL);

  const validateForm = () => {
    if (!userData.email || !userData.password) {
      setError("Veuillez remplir tous les champs");
      return false;
    }
    if (!userData.email.includes("@")) {
      setError("Veuillez entrer une adresse email valide");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await authService.login(userData);
      console.log("res", res.data.admin);
      
      // Stocker les informations de l'utilisateur
      if (res.data && res.data.admin) {
        await AsyncStorage.setItem('userData', JSON.stringify(res.data.admin));
        router.push("/dashboard");
      } else {
        setError("Format de réponse invalide");
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la connexion");
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push("/dashboard");
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <Stack.Screen options={{ 
        title: 'Connexion', 
        headerTitle: 'Connexion',
        headerStyle: {
          backgroundColor: "#3c2f9a"
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }} />
      
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-gray-50"
      >
        <View className="flex-1 justify-center items-center p-6">
          <View className="w-full items-center mb-8">
            <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="business-outline" size={50} color="#3c2f9a" />
            </View>
            <Text className="text-2xl font-bold text-gray-800">Bienvenue</Text>
            <Text className="text-gray-500 text-center mt-2">Connectez-vous à votre compte pour continuer</Text>
          </View>

          {error ? (
            <View className="w-full bg-red-50 p-3 rounded-lg mb-4 flex-row items-center">
              <Ionicons name="alert-circle" size={20} color="#ef4444" />
              <Text className="text-red-500 ml-2 flex-1">{error}</Text>
            </View>
          ) : null}

          <View className="w-full mb-4">
            <Text className="text-gray-600 mb-1 ml-1">Email</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg bg-white">
              <View className="pl-3">
                <Ionicons name="mail-outline" size={20} color="#9ca3af" />
              </View>
              <TextInput 
                className="flex-1 p-3" 
                placeholder="Entrez votre email" 
                keyboardType="email-address" 
                value={userData.email} 
                onChangeText={(text) => setUserData({ ...userData, email: text })}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View className="w-full mb-6">
            <Text className="text-gray-600 mb-1 ml-1">Mot de passe</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg bg-white">
              <View className="pl-3">
                <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
              </View>
              <TextInput 
                className="flex-1 p-3" 
                placeholder="Entrez votre mot de passe" 
                secureTextEntry={!showPassword} 
                value={userData.password} 
                onChangeText={(text) => setUserData({ ...userData, password: text })}
              />
              <TouchableOpacity 
                className="pr-3" 
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#9ca3af" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            className={`w-full p-3 rounded-lg ${loading ? 'bg-blue-300' : 'bg-blue-600'}`} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center text-white font-semibold text-lg">Se connecter</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500">Vous n'avez pas de compte ? </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text className="text-blue-600 font-semibold">Inscrivez-vous</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
