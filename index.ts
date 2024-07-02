import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./database";
import { authMiddleware } from "./middleware";
import { swaggerDocs } from "./swagger-config";
import cors from "cors";

import moduleRoutes from "./routes/rapida-module.route";
import userRoutes from "./routes/rapida-user.route";
import permissionRoutes from "./routes/rapida-permission.route";
import invitationRoutes from "./routes/rapida-invitation.route";
import authRoutes from "./routes/rapida-auth.route";

const app = express();

connectDB();

swaggerDocs(app);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
const version = process.env.API_VERSION;
app.use(`/${version}/auth`, authRoutes);
app.use(`/${version}/user`, authMiddleware, userRoutes);
app.use(`/${version}/modules`, authMiddleware, moduleRoutes);
app.use(`/${version}/permissions`, authMiddleware, permissionRoutes);
app.use(`/${version}/invitations`, authMiddleware, invitationRoutes);

// Views
app.set("view engine", "ejs");
app.get("/app/login", (_, res) => res.render("auth/login"));
app.get("/app/home", (_, res) => res.render("home/home"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
