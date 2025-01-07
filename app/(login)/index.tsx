import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import enterpriseService from "@/services/enterpriseService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleLogin = async () => {
    console.log("Email:", email);
    console.log("Password:", password);

    try {
      await enterpriseService.createEnterprise({ email, password }).then((response) => {
        console.log("Enterprise created:", response);
      });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <Text className="text-2xl font-semibold text-gray-800 mb-6">Login</Text>

      <TextInput className="w-full p-3 mb-4 border border-gray-300 rounded-lg" placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />

      <TextInput className="w-full p-3 mb-4 border border-gray-300 rounded-lg" placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity className="w-full bg-blue-500 p-3 rounded-lg" onPress={handleLogin}>
        <Text className="text-center text-white font-semibold">Login</Text>
      </TouchableOpacity>

      <TouchableOpacity className="mt-4" onPress={() => console.log("Go to Register Screen")}>
        <Text className="text-blue-500 text-center">Vous n'avez pas de compte ? Inscrivez-vous</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
