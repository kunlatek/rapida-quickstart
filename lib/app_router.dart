import 'package:go_router/go_router.dart';
import 'package:quickstart_flutter/pages/company_profile_page.dart';
import 'package:quickstart_flutter/pages/home_page.dart';
import 'package:quickstart_flutter/pages/login_page.dart';
import 'package:quickstart_flutter/pages/person_profile_page.dart';
import 'package:quickstart_flutter/pages/user_type_selection_page.dart';
import 'package:quickstart_flutter/services/auth_token_manager.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    redirect: (context, state) async {
      // Verifica se o usuário está autenticado
      final authToken = await AuthTokenManager.getAuthToken();
      final isLoggingIn = state.uri.toString() == '/';

      // Se o usuário não estiver autenticado e não estiver na página de login, redirecione para login
      if (authToken == null && !isLoggingIn) {
        return '/';
      }
      print(authToken);

      // Caso contrário, permita o acesso
      return null;
    },
    routes: [
      GoRoute(path: '/', builder: (context, state) => const LoginPage()),
      GoRoute(
        path: '/user-type',
        builder: (context, state) => const UserTypeSelectionPage(),
      ),
      GoRoute(
        path: '/person-profile',
        builder: (context, state) => const PersonProfilePage(),
      ),
      GoRoute(
        path: '/company-profile',
        builder: (context, state) => const CompanyProfilePage(),
      ),
      GoRoute(path: '/home', builder: (context, state) => const HomePage()),
    ],
  );
}
