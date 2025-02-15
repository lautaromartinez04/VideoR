import { contextBridge } from 'electron'; // Importa correctamente 'contextBridge' desde 'electron'

// Aquí defines las funciones que expondrás a la ventana renderizada
const api = {
  sendData: (message) => {
    console.log(message); // Aquí puedes hacer lo que necesites con el mensaje
  },
};

// Asegúrate de que la función se exponga correctamente
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api); // Exponemos 'api' con la función 'sendData'
  } catch (error) {
    console.error(error);
  }
} else {
  window.api = api; // En el caso en que no haya contexto aislado, simplemente lo agregamos a 'window'
}
