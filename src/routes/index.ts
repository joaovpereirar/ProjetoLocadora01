import  { Router } from "express";
import veiculosRoutes from "./veiculos";
import categoriasRoutes from "./categorias";
import marcasRoutes from "./marcas";
import loginRoutes from "./login";
import dashboardRoutes from "./dashboard";
import registerRoutes from "./register";

const router = Router();

router.use('/veiculos', veiculosRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/marcas', marcasRoutes);
router.use('/login', loginRoutes);
router.use('/login/register',registerRoutes)
router.use('/dashboard', dashboardRoutes)
export default router;