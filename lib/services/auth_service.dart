import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:quickstart_flutter/config.dart';
import 'package:quickstart_flutter/services/auth_token_manager.dart';

class AuthService {
  Future<bool> login(String email, String password) async {
    final url = Uri.parse('${AppConfig.baseUrl}/login');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);

      final token = data['token'];

      await AuthTokenManager.saveAuthToken(token);

      return true;
    } else {
      return false;
    }
  }
}
