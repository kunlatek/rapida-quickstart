import { connectDB, disconnectDB } from "./database";
import * as permissionController from "./controllers/rapida-permission.controller";
import * as invitationController from "./controllers/rapida-invitation.controller";
import * as authController from "./controllers/rapida-auth.controller";

const generateAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Email and password must be set");
    return;
  }

  try {
    await connectDB();

    // Create new admin permission
    const permissionName = `Admin permission ${Date.now()}`;
    await permissionController.create({
      name: permissionName,
      description: `Admin permission`,
      isAdminPermission: true,
      modulePermissions: [],
    });
    const permission = (
      await permissionController.findAll({
        filter: { name: permissionName },
      })
    )[0]._id;

    // Create invitation
    await invitationController.create({ email, permission });

    // Create user
    await authController.signup(email, password);

    console.info(`Admin user ${email} generate!`);
    await disconnectDB();
    return true;
  } catch (e: any) {
    console.error(e.message);
    await disconnectDB();
    return true;
  }
};

function run() {
  const args = process.argv.slice(2);
  const functionName = args[0];

  if (functionName === "generate-admin-user") {
    generateAdmin();
  }
}

run();
