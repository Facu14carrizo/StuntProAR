# StuntsProAR – Registro y Login Genérico con Supabase

¡Bienvenido a **StuntsProAR**!

Este proyecto implementa un sistema de registro y login **GENÉRICO** usando Supabase como backend, pero SIN depender del sistema de autenticación nativo de Supabase (`auth`). En su lugar, los usuarios se gestionan en una tabla personalizada (`registered_users`), lo que permite registrar y validar usuarios de forma más simple mientras se desarrollan o prueban features.

---

## 🚀 Características principales

- **Registro de cuentas:**  
  Los usuarios pueden crear cuentas con email, nombre y contraseña. Todos los datos se guardan en la tabla genérica `registered_users`.
- **Login básico:**  
  Las credenciales se verifican directamente contra esa tabla. Si coinciden, el usuario accede.
- **Independencia del sistema de Auth:**  
  No es necesario crear usuarios en `auth.users`, ni configurar políticas complicadas de Row Level Security.
- **Ideal para prototipos, pruebas o demos.**

---

## ⚠️ Advertencia de Seguridad

> **¡NO USAR EN PRODUCCIÓN!**  
> Este sistema guarda las contraseñas en texto plano solo para pruebas rápidas.  
> Para un proyecto real SIEMPRE usarías el Auth de Supabase o implementarías hash de contraseñas (bcrypt, argon2, etc).

---

## 🛠️ Instalación rápida

1. Clona el repo:
   ```bash
   git clone TU_REPO_GITHUB
   cd StuntsProAR
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Configura tus variables de entorno de Supabase (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) en `.env`.

4. Crea la tabla genérica en tu Supabase (SQL editor):

   ```sql
   create table public.registered_users (
     id uuid primary key default gen_random_uuid(),
     email text not null,
     full_name text,
     password text,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );
   ```

---

## 👤 Flujo de uso

- **Registro:**  
  El usuario se registra → los datos se insertan en `registered_users`.
- **Login:**  
  El usuario inicia sesión → la app consulta la tabla, y si las credenciales coinciden, simula login exitoso.

---

## 🚧 TODO / Mejoras futuras

- Implementar hash de contraseñas.
- Mensajes de feedback más detallados.
- Upgrade al Auth real de Supabase cuando se resuelvan políticas RLS.
- Roles de usuario y administración.

---

## 🤙 Contribuciones

Toda contribución es bienvenida.  
Para pruebas o feedback rápido, simplemente abre un Issue o PR.

---

¡Gracias por usar **StuntsProAR** y aguante el código independiente de los sistemas complejos de Auth (al menos para testear)! 😎
