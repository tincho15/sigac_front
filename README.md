This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Sesión y verificación en dos pasos (Google Authenticator)

- Los Route Handlers de `app/api/auth/` reenvían las solicitudes al backend (`BACKEND_URL`) y guardan los JWT en cookies `httpOnly` (`sigac_session` para la sesión, `sigac_2fa` para el paso intermedio del login). Los nombres y opciones están en `config/authCookie.ts` y la lógica compartida en `lib/auth/session.ts`.
- Si la cuenta tiene 2FA activo, `components/auth/LoginForm.tsx` pasa al paso `TwoFactorLoginStep`, que pide el código de 6 dígitos; al validarlo se completa el login en el `AuthContext` igual que sin 2FA.
- **2FA obligatoria:** mientras `user.debe_activar_2fa` sea `true`, el layout privado solo deja estar en `/activar-2fa` (`app/(private)/activar-2fa`, sin menú lateral). Al activarlo se refresca el `AuthContext` y el usuario pasa a `/solicitudes`. En el primer login de un usuario nuevo el orden es `/change-password` → `/activar-2fa` → `/solicitudes`; las reglas están en `lib/auth/redirects.ts`.
- La pantalla privada `/cuenta/seguridad` (`app/(private)/cuenta/seguridad`, menú **Seguridad**) muestra el estado del 2FA y permite desactivarlo con contraseña + código. Como es obligatorio, después de desactivarlo se vuelve a pedir la activación (sirve para cambiar de celular).

La guía completa de configuración y uso está en el README del backend (`sigac_gateway`), sección **Autenticacion de dos factores**.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Docker

##Usando con npm los siguientes comandos: 
npm run docker:build 
    Es lo mismo que ejecutar-> "docker build -t sigac-front ." 
        --> Construye la imagen de Docker con el nombre "sigac-front"

npm run docker:start 
    Es lo mismo que ejecutar-> "docker run -d --rm --name sigac-front -p 3000:3000 sigac-front" 
        --> Inicia un contenedor de Docker en segundo plano con el nombre "sigac-front" y mapea el puerto 3000 del contenedor al puerto 3000 del host

npm run docker:stop 
    Es lo mismo que ejecutar-> "docker stop sigac-front" 
        ---> Detiene el contenedor de Docker con el nombre "sigac-front"





Se necesita tener Docker instalado y en ejecución. La imagen de producción se construye con salida standalone de Next.js.

Construir la imagen desde la raíz del proyecto:

```bash
docker build -t sigac-front .
```

Iniciar el contenedor y publicar el puerto 3000:

```bash
docker run --name sigac-front -p 3000:3000 sigac-front
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000). Para detener y eliminar el contenedor:

```bash
docker stop sigac-front
docker rm sigac-front
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
