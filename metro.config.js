const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path"); // Importante para Windows

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { 
  // Usamos ruta absoluta para evitar que Windows se confunda
  input: path.join(__dirname, "global.css") 
});