import 'package:flutter/material.dart';
import 'package:quickstart_flutter/services/profile_service.dart';
import 'package:quickstart_flutter/services/storage_manager.dart';

class ProfileProvider with ChangeNotifier {
  final ProfileService _profileService = ProfileService();
  bool _isLoading = false;

  bool get isLoading => _isLoading;

  Future<bool> savePersonProfile(Map<String, String> data) async {
    _isLoading = true;
    notifyListeners();

    bool success = true;
    try {
      success = await _profileService.savePersonProfile(data);
    } catch (e) {
      debugPrint('Error saving person profile: $e');
    }

    // Salvar os dados do perfil e o tipo de usuário no armazenamento local
    try {
      await StorageManager.saveString('profileData', data.toString());
      await StorageManager.saveBool('isPerson', true);
    } catch (e) {
      debugPrint('Error saving profile data to storage: $e');
    }

    _isLoading = false;
    notifyListeners();

    return success;
  }

  Future<bool> saveCompanyProfile(Map<String, String> data) async {
    _isLoading = true;
    notifyListeners();

    bool success = true;
    try {
      success = await _profileService.saveCompanyProfile(data);
    } catch (e) {
      debugPrint('Error saving company profile: $e');
    }

    // Salvar os dados do perfil e o tipo de usuário no armazenamento local
    try {
      await StorageManager.saveString('profileData', data.toString());
      await StorageManager.saveBool('isPerson', false);
    } catch (e) {
      debugPrint('Error saving profile data to storage: $e');
    }

    _isLoading = false;
    notifyListeners();

    return success;
  }
}
