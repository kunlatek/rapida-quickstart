import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:quickstart_flutter/services/storage_manager.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
        actions: [
          PopupMenuButton<String>(
            onSelected: (value) async {
              bool? isPerson = await StorageManager.getBool('isPerson');
              if (value == 'edit_profile') {
                if (isPerson == true) {
                  context.go(
                    '/person-profile',
                  ); // Navega para a página de edição de perfil pessoal
                } else {
                  context.go(
                    '/company-profile',
                  ); // Navega para a página de edição de perfil da empresa
                }
              } else if (value == 'logout') {
                // Implementar lógica de logout
                await StorageManager.clear(); // Apaga tudo do storage
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Logout realizado com sucesso!'),
                  ),
                );
                context.go('/'); // Redireciona para a página de login
              }
            },
            itemBuilder:
                (context) => [
                  const PopupMenuItem(
                    value: 'edit_profile',
                    child: Text('Editar Perfil'),
                  ),
                  const PopupMenuItem(value: 'logout', child: Text('Logout')),
                ],
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(color: Colors.deepPurple),
              child: Text(
                'Menu',
                style: TextStyle(color: Colors.white, fontSize: 24),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.home),
              title: const Text('Home'),
              onTap: () {
                Navigator.pop(context); // Fecha o drawer
                context.go('/home'); // Navega para a página Home
              },
            ),
          ],
        ),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Text(
              'Bem-vindo ao Quickstart!',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 16),
            Text(
              'Use o menu para navegar pelas opções.',
              style: TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}
