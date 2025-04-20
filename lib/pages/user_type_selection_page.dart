import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class UserTypeSelectionPage extends StatelessWidget {
  const UserTypeSelectionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () => context.go('/person-profile'),
              style: ElevatedButton.styleFrom(minimumSize: const Size(200, 50)),
              child: const Text('Sou uma Pessoa'),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => context.go('/company-profile'),
              style: ElevatedButton.styleFrom(minimumSize: const Size(200, 50)),
              child: const Text('Sou uma Empresa'),
            ),
          ],
        ),
      ),
    );
  }
}
