# Match My Files

**Match My Files** is a powerful tool for detecting and managing duplicate files and folders. Effortlessly compare folders, identify duplicate files using advanced file hashing and size matching, and streamline your file organization.

## Key Features

- Root Folder Processing: select any folder, and **Match My Files** will analyze recursively all files and folders within it, find duplicates within selected folder and save details for quick duplicates identification during comparisons with other root folders.
- Advanced Comparison: compare files and folders between a primary root folder and secondary root folders to find duplicates efficiently.
- Accurate Matching: identifies duplicates using file hashes for small and medium files and size matching for larger files.
- User-Friendly Interface: simple, colorful, intuitive interface for streamlined duplicate detection and management.

![Screenshot how Match My Files compare files](/assets/image1.png "Screenshot how Match My Files compare files").


## Libraries and tools

- [NextJS (App Router)](https://nextjs.org/)
- [Prisma ORM](https://www.prisma.io/orm)
- [Socket.io](https://socket.io/)
- [HeroUI](http://heroui.com/)
- [Tailwind](https://tailwindcss.com/)
- [Formik](https://formik.org/)
- [Yup](https://github.com/jquense/yup)

## Run locally (development mode)

- Check that `NodeJS` and `npm` have been installed (https://nodejs.org/en/download/package-manager/)
- Check that `PostgreSQL` has been installed (https://www.postgresql.org/)
- Create `.env.local` file in the project's root and add the following environment variables:
    ```text
    DATABASE_URL=
    APP_PORT=
    ```
- Run the following command in the project's root to install all packages (it should be run only the first time):
    ```shell
    npm install
    ```
- Run the following commands in the project's root to prepare your database (it should be run only the first time):
    ```shell
    npm run prisma:migrate:dev
    npm run prisma:generate:dev
    npm run prisma:generate-sql:dev
    ```
- Run the following command in the project's root to actually start the app:
    ```shell
    npm run dev
    ```
- Open [http://localhost:4000](http://localhost:4000) with your browser to see the result (the exact port depends on the `APP_PORT` env variable)

## Run locally (production mode)

- Check that `NodeJS` and `npm` have been installed (https://nodejs.org/en/download/package-manager/)
- Check that `PostgreSQL` has been installed (https://www.postgresql.org/)
- Create `.env.production` file in the project's root and add the following environment variables:
    ```text
    DATABASE_URL=
    APP_PORT=
    ```
- Run the following command in the project's root to install all packages (it should be run only the first time):
    ```shell
    npm install
    ```
- Run the following commands in the project's root to prepare your database (it should be run only the first time):
    ```shell
    npm run prisma:migrate:prod
    npm run prisma:generate:prod
    npm run prisma:generate-sql:prod
    ```
- Run the following command in the project's root to build the app:
    ```shell
    npm run build
    ```
- Run the following command in the project's root to actually start the app:
    ```shell
    npm run start
    ```
- Open [http://localhost:4000](http://localhost:4000) with your browser to see the result (the exact port depends on the `APP_PORT` env variable)

Prepared Powershell script `run.ps1` can be used to run the app in production mode on Windows environment. 

Since the **Match My Files** application works on the user's file system to find duplicates, it should be run directly on the user's PC and cannot be used inside Docker.