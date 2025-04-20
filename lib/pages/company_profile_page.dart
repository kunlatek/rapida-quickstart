import 'package:flutter/material.dart';
import 'package:flutter_masked_text2/flutter_masked_text2.dart';
import 'package:go_router/go_router.dart';
import 'package:quickstart_flutter/services/storage_manager.dart';

class CompanyProfilePage extends StatefulWidget {
  const CompanyProfilePage({super.key});

  @override
  State<CompanyProfilePage> createState() => _CompanyProfilePageState();
}

class _CompanyProfilePageState extends State<CompanyProfilePage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _companyNameController = TextEditingController();
  final MaskedTextController _cnpjController = MaskedTextController(
    mask: '00.000.000/0000-00',
  );
  final TextEditingController _emailController = TextEditingController();

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
        _companyNameController.text = data['companyName'] ?? '';
        _cnpjController.text = data['cnpj'] ?? '';
        _emailController.text = data['email'] ?? '';
      });
    }
  }

  void _saveProfile() async {
    if (_formKey.currentState!.validate()) {
      final data = {
        'companyName': _companyNameController.text.trim(),
        'cnpj': _cnpjController.text.trim(),
        'email': _emailController.text.trim(),
        'isPerson': 'false',
      };

      await StorageManager.saveString(
        'profileData',
        Uri(queryParameters: data).query,
      );

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
      appBar: AppBar(title: const Text('Editar Perfil - Empresa')),
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
                    controller: _companyNameController,
                    decoration: const InputDecoration(
                      labelText: 'Nome da Empresa',
                    ),
                    validator:
                        (value) =>
                            value == null || value.isEmpty
                                ? 'Por favor, insira o nome da empresa'
                                : null,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _cnpjController,
                    decoration: const InputDecoration(labelText: 'CNPJ'),
                    keyboardType: TextInputType.number,
                    validator:
                        (value) =>
                            value == null || value.isEmpty
                                ? 'Por favor, insira o CNPJ'
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
