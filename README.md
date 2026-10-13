# GoVista

GoVista is a full-stack vacation management application developed for Full Stack Web Developer Project #3.

## Technologies

- **Frontend:** React, TypeScript, Vite, Material UI
- **Backend:** Node.js, Express, TypeScript
- **Database:** MySQL
- **Additional features:** OpenAI recommendations, MCP server, JWT authentication, Docker

## Features

### Registered users

- Register, log in, and log out
- View vacations as cards, sorted by start date
- Like or unlike vacations and see their like counts
- Browse vacations with pagination (9 per page)
- Filter all, liked, active, and upcoming vacations
- Request AI travel recommendations
- Ask database-related questions using MCP

### Admin

- Add, edit, and delete vacations
- Upload vacation images
- View a vacation likes report
- Export vacation statistics as CSV

## Project Structure

```text
GoVista/
├── Backend/                  # Node.js + Express API and MCP server
├── Frontend/                 # React + TypeScript application
├── Database/
│   └── vacations.sql        # Database schema and initial data
├── docker-compose.yaml
└── README.md
```

The Postman collection is included in the `Backend` folder.

## Running with Docker

**Requirements:** Docker Desktop (or Docker Engine with Docker Compose) and the required API credentials.

1. Clone or download the project.
2. Configure private environment files in the root, `Backend`, and `Frontend` directories. These files are excluded from Git and must be created locally.
3. Make sure the following settings are provided:

   **Root `.env`:**
   - `MYSQL_ROOT_PASSWORD` — password for the Docker MySQL root user
   - `VITE_RECAPTCHA_SITE_KEY` — public reCAPTCHA site key

   **`Backend/.env`:**
   - `ENVIRONMENT`
   - `MYSQL_HOST`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`
   - `JWT_SECRET`
   - `OPENAI_API_KEY`
   - `HASH_SALT`
   - `RECAPTCHA_SECRET_KEY`

   **`Frontend/.env`:**
   - `VITE_RECAPTCHA_SITE_KEY`

   When using Docker, `docker-compose.yaml` overrides the backend's MySQL host, user, password, and database settings. The root `MYSQL_ROOT_PASSWORD` supplies the Docker database password.

4. From the main project directory, run:

   ```bash
   docker compose up -d --build
   ```

5. Open the frontend at **http://localhost:5173**. The backend API runs on **http://localhost:4000**.

On a **new Docker volume**, MySQL initializes the `vacations` database using `Database/vacations.sql`. Existing volumes retain their stored data and credentials.

### Useful Docker Commands

```bash
docker compose ps
docker compose logs backend-service --tail=50
docker compose down
```

`docker compose down` stops and removes the containers without deleting named database volumes.

**Do not use `docker compose down -v` unless you intentionally want to delete the database volume.**

## Running without Docker

Start MySQL locally and import `Database/vacations.sql`. Configure the backend environment file with your local MySQL credentials.

In one terminal:

```bash
cd Backend
npm install
npm start
```

In another terminal:

```bash
cd Frontend
npm install
npm start
```

The frontend normally runs on port 5173 and the backend on port 4000.

## Security Notes

- Do not commit `.env` files, API keys, passwords, or `node_modules`.
- Keep backup SQL dumps containing user data outside public repositories.
- Configure your own OpenAI and reCAPTCHA credentials before testing their features.

## GitHub Repository

**Repository:** https://github.com/omriCohen512/GoVista

## Author

Omri Cohen
