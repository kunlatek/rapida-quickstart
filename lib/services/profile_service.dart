import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:quickstart_flutter/config.dart';
import 'package:quickstart_flutter/services/auth_token_manager.dart';

class ProfileService {
  Future<bool> savePersonProfile(Map<String, String> data) async {
    final url = Uri.parse('${AppConfig.baseUrl}/person-profile');
    final token = await AuthTokenManager.getAuthToken(); // Obtém o token
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(data),
    );

    return response.statusCode == 200;
  }

  Future<bool> saveCompanyProfile(Map<String, String> data) async {
    final url = Uri.parse('${AppConfig.baseUrl}/company-profile');
    final token = await AuthTokenManager.getAuthToken(); // Obtém o token
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(data),
    );

    return response.statusCode == 200;
  }
}
