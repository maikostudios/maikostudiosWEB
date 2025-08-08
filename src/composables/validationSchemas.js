// Esquemas Yup reutilizables para los pasos del formulario interactivo
import * as yup from "yup";

export const pasoUnoSchema = yup.object({
  nombre: yup.string().required("El nombre es obligatorio").min(2).max(100),
});

export const pasoDosSchema = yup.object({
  servicio: yup.string().required("Selecciona un servicio"),
});

export const pasoTresSchema = yup.object({
  email: yup
    .string()
    .required("El correo es obligatorio")
    .email("Formato de correo inválido"),
  telefono: yup
    .string()
    .required("Teléfono obligatorio")
    .matches(/^(\+56)?9\d{8,9}$/g, "Formato +569XXXXXXXX o +569XXXXXXXXX"),
});

export const pasoCuatroSchema = yup.object({
  mensaje: yup.string().required("Cuéntanos tu idea"),
});
