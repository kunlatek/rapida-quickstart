import { MongoClient } from 'mongodb';
import { hash } from 'bcrypt';

const connectDB = async (): Promise<MongoClient> => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not defined');
    return;
  }

  const client = new MongoClient(uri);
  await client.connect();
  return client;
};

const disconnectDB = async (client: MongoClient): Promise<void> => {
  await client.close();
};

export const generateAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;
  console.info('Generating admin user...');

  const client = await connectDB();
  try {
    const database = client.db(process.env.DB_NAME);

    // Check if admin user already exists
    const adminUser = await database.collection('user').findOne({ email });
    if (adminUser) {
      console.info('Admin user already exists');
      await disconnectDB(client);
      return;
    }

    // Create new admin permission
    const permissionName = `Default Admin permission`;
    const result = await database.collection('permission').updateOne(
      { name: permissionName },
      {
        $set: {
          name: permissionName,
          description: 'Admin permission',
          isAdminPermission: true,
          modulePermissions: [],
        },
      },
      { upsert: true },
    );

    const permission =
      result.upsertedId ||
      (
        await database
          .collection('permission')
          .findOne({ name: permissionName })
      )._id;

    // Create invitation
    await database.collection('invitation').insertOne({
      email,
      permission: permission.toString(),
      accepted: true,
    });

    // Create user
    const hashedPassword = await hash(password, 10);
    const insertedUser = await database.collection('user').insertOne({
      email,
      password: hashedPassword,
    });

    // Create role
    await database.collection('role').insertOne({
      userId: insertedUser.insertedId.toString(),
      permissionId: permission.toString,
    });
    console.info(`Admin user ${email} generate!`);

    await disconnectDB(client);
    return true;
  } catch (e: any) {
    console.error(e.message);
    await disconnectDB(client);
    return true;
  }
};
