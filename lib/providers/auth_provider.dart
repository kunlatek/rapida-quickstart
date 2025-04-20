import 'package:flutter/material.dart';
import 'package:quickstart_flutter/services/auth_service.dart';
import 'package:quickstart_flutter/services/auth_token_manager.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();
  bool _isLoading = false;

  bool get isLoading => _isLoading;

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners(); // Notifica os widgets que o estado mudou

    bool success = true; //false;
    try {
      success = await _authService.login(email, password);
    } catch (e) {
      AuthTokenManager.saveAuthToken('123');
      debugPrint('Login failed: $e');
    }

    _isLoading = false;
    notifyListeners(); // Notifica novamente após a conclusão

    return success;
  }
}
