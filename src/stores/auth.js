import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { atprotoLogin } from "@/services/atproto";
import { useCache } from "@/composables/useCache";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const server = ref(null);
  const accessToken = ref(null);
  const refreshToken = ref(null);
  const did = ref(null);

  const cache = useCache();

  const isAuthenticated = computed(() => !!accessToken.value);

  function saveSession(data) {
    user.value = data.user;
    server.value = data.server;
    accessToken.value = data.accessJwt;
    refreshToken.value = data.refreshJwt;
    did.value = data.did;

    cache.set(
      "capivara_session",
      JSON.stringify({
        user: data.user,
        server: data.server,
        accessJwt: data.accessJwt,
        refreshJwt: data.refreshJwt,
        did: data.did,
      }),
      false
    );
  }

  function checkSession() {
    const stored = cache.get("capivara_session");
    try {
      const data = JSON.parse(stored);
      user.value = data.user;
      server.value = data.server;
      accessToken.value = data.accessJwt;
      refreshToken.value = data.refreshJwt;
      did.value = data.did;
    } catch (e) {
      clearSession();
    }
  }

  function clearSession() {
    user.value = null;
    server.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    did.value = null;
    cache.remove("capivara_session");
  }

  async function login(identifier, password, serverUrl) {
    try {
      const response = await atprotoLogin(identifier, password, serverUrl);

      saveSession({
        user: identifier,
        server: serverUrl,
        accessJwt: response.accessJwt,
        refreshJwt: response.refreshJwt,
        did: response.did,
      });

      return { success: true };
    } catch (error) {
      console.error("Erro no login:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Erro ao fazer login",
      };
    }
  }

  function logout() {
    clearSession();
  }

  function jwtIsValid() {
    const token = accessToken.value;
    if (!token) return false;
    const payload = token.split(".")[1];
    if (!payload) return false;
    try {
      const decoded = JSON.parse(atob(payload));
      const exp = decoded.exp;
      if (!exp) return false;
      const now = Math.floor(Date.now() / 1000);
      return exp > now;
    } catch (e) {
      console.error("Erro ao validar JWT:", e);
      return false;
    }
  }

  return {
    user,
    server,
    accessToken,
    refreshToken,
    did,
    isAuthenticated,
    login,
    logout,
    checkSession,
    saveSession,
    jwtIsValid,
  };
});
