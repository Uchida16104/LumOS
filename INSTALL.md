# Installation Guide for LumOS

This comprehensive guide will walk you through the complete installation and setup process for LumOS, the Universal Polyglot Operating System.

## System Requirements

Before beginning the installation, please ensure your system meets the following requirements:

### Hardware Requirements
- Minimum 2GB RAM (4GB recommended)
- 10GB available disk space
- Modern multi-core processor
- Network connectivity for package downloads

### Software Prerequisites
- Node.js version 18.0.0 or higher
- Rust version 1.70.0 or higher
- PostgreSQL 14 or higher (or Supabase account)
- Git for version control
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Installation Steps

### Step One: Repository Cloning

Begin by cloning the LumOS repository to your local machine. Open your terminal and execute the following command:

```bash
git clone https://github.com/Uchida16104/LumOS.git
cd LumOS
```

This command will download all necessary files and navigate into the project directory.

### Step Two: Environment Configuration

The system requires proper environment variables to function correctly. Create your environment configuration file by copying the example template:

```bash
cp .env.example .env
```

Open the newly created .env file in your preferred text editor and configure the following variables according to your environment:

**Backend Configuration:**
- PORT: The port number for the backend server (default: 8080)
- DATABASE_URL: Your PostgreSQL connection string
- RUST_LOG: Logging level (info, debug, or error)

**Frontend Configuration:**
- NEXT_PUBLIC_API_URL: The URL where your backend will be accessible
- NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anonymous key

**Security Configuration:**
- JWT_SECRET: A secure random string for token generation
- SESSION_TIMEOUT: Session expiration time in seconds

### Step Three: Database Initialization

If you are using Supabase, navigate to your project dashboard and execute the SQL commands found in the `database/schema.sql` file. This will create all necessary tables, indexes, and security policies.

For local PostgreSQL installations, you may execute the schema directly:

```bash
psql -U your_username -d your_database -f database/schema.sql
```

### Step Four: Dependency Installation

The project utilizes a workspace structure with multiple components. Install all necessary dependencies by running:

```bash
npm run install:all
```

This command will install dependencies for both the frontend Next.js application and the Lumos Language engine. The process may take several minutes depending on your network connection.

### Step Five: Backend Compilation

The Rust backend requires compilation before it can be executed. Navigate to the backend directory and build the project:

```bash
cd backend
cargo build --release
cd ..
```

The release build is optimized for performance and is recommended for all environments except active development.

### Step Six: Starting the Development Environment

Once all components are properly configured and built, you can start the complete development environment:

```bash
npm run dev
```

This command will simultaneously start three services:
- Frontend development server on port 3000
- Backend Rust server on port 8080
- Lumos Language engine on port 3001

You can access the LumOS interface by opening your web browser and navigating to `http://localhost:3000`.

## Initial Login

The system includes default development credentials:
- Username: admin
- Password: admin123

**Important Security Notice:** These default credentials must be changed immediately for any production deployment. Failure to do so will expose your system to significant security risks.

## Verifying Installation

To confirm that all components are functioning correctly, perform the following verification steps:

1. Open the LumOS web interface in your browser
2. Log in using the default credentials
3. Open the System Monitor application
4. Verify that all services show as "Active"
5. Open the Terminal application and execute a simple command such as "help"
6. Open the Lumos REPL and execute a basic program

If all these steps complete successfully, your installation is properly configured.

## Troubleshooting Common Issues

### Backend Server Fails to Start

If the Rust backend fails to initialize, verify the following:
- Check that the PORT environment variable is not in use by another application
- Ensure the DATABASE_URL is correctly formatted and accessible
- Review the console output for specific error messages
- Verify that all Rust dependencies were properly compiled

### Frontend Build Errors

Should the Next.js frontend encounter build errors:
- Confirm that Node.js version 18 or higher is installed
- Delete the node_modules directory and reinstall dependencies
- Clear the Next.js cache by removing the .next directory
- Review package.json for any dependency conflicts

### Database Connection Failures

When experiencing database connectivity issues:
- Verify the DATABASE_URL format matches PostgreSQL connection string requirements
- Confirm that the database server is running and accessible
- Check firewall settings to ensure the database port is not blocked
- Test the connection using a database client tool

### Network Tool Execution Errors

If network tools such as nmap or tcpdump fail to execute:
- Verify that these tools are installed on your system
- Confirm that the user running the backend has appropriate permissions
- Note that some tools may require elevated privileges
- Consider using Docker containers with appropriate permissions for production deployments

## Next Steps

Once installation is complete and verified, please review the following documentation:
- DEPLOYMENT.md for production deployment instructions
- SECURITY.md for critical security guidelines
- README.md for feature documentation and usage examples

## Support and Assistance

Should you encounter issues not covered in this guide, please refer to the project repository for additional resources and community support.
