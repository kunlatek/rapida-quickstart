import 'package:flutter/material.dart';
import 'package:flutter_masked_text2/flutter_masked_text2.dart';
import 'package:go_router/go_router.dart';
import 'package:quickstart_flutter/services/storage_manager.dart';

class PersonProfilePage extends StatefulWidget {
  const PersonProfilePage({super.key});

  @override
  State<PersonProfilePage> createState() => _PersonProfilePageState();
}

class _PersonProfilePageState extends State<PersonProfilePage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final MaskedTextController _phoneController = MaskedTextController(
    mask: '(00) 00000-0000',
  );

  @override
  void initState() {
    super.initState();
    _loadProfileData();
  }

  Future<void> _loadProfileData() async {
    final profileData = await StorageManager.getString('profileData');
    if (profileData != null) {
      final data = Map<String, String>.from(Uri.splitQueryString(profileData));
      setState(() {
        _nameController.text = data['name'] ?? '';
        _emailController.text = data['email'] ?? '';
        _phoneController.text = data['phone'] ?? '';
      });
    }
  }

  void _saveProfile() async {
    if (_formKey.currentState!.validate()) {
      final data = {
        'name': _nameController.text.trim(),
        'email': _emailController.text.trim(),
        'phone': _phoneController.text.trim(),
      };

      await StorageManager.saveString(
        'profileData',
        Uri(queryParameters: data).query,
      );
      await StorageManager.saveBool('isPerson', true);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Perfil salvo com sucesso!')),
      );

      // Redireciona para a página inicial
      context.go('/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Editar Perfil - Pessoa')),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 800),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextFormField(
                    controller: _nameController,
                    decoration: const InputDecoration(labelText: 'Nome'),
                    validator:
                        (value) =>
                            value == null || value.isEmpty
                                ? 'Por favor, insira o nome'
                                : null,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _emailController,
                    decoration: const InputDecoration(labelText: 'Email'),
                    keyboardType: TextInputType.emailAddress,
                    validator:
                        (value) =>
                            value == null || value.isEmpty
                                ? 'Por favor, insira o email'
                                : null,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _phoneController,
                    decoration: const InputDecoration(labelText: 'Telefone'),
                    keyboardType: TextInputType.phone,
                    validator:
                        (value) =>
                            value == null || value.isEmpty
                                ? 'Por favor, insira o telefone'
                                : null,
                  ),
                  const SizedBox(height: 32),
                  ElevatedButton(
                    onPressed: _saveProfile,
                    child: const Text('Salvar'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
