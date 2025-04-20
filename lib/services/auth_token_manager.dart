import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthTokenManager {
  static const _storage = FlutterSecureStorage();
  static const _authTokenKey = 'auth_token';

  // Método para salvar o token
  static Future<void> saveAuthToken(String token) async {
    await _storage.write(key: _authTokenKey, value: token);
  }

  // Método para obter o token
  static Future<String?> getAuthToken() async {
    return await _storage.read(key: _authTokenKey);
  }

  // Método para remover o token (ex.: logout)
  static Future<void> clearAuthToken() async {
    await _storage.delete(key: _authTokenKey);
  }
}
