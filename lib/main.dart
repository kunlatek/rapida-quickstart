import 'package:flutter/material.dart';
import 'package:quickstart_flutter/app_router.dart';
import 'package:provider/provider.dart';
import 'package:quickstart_flutter/providers/auth_provider.dart';
import 'package:quickstart_flutter/providers/profile_provider.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ProfileProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      routerConfig: AppRouter.router, // Use o GoRouter configurado
    );
  }
}
