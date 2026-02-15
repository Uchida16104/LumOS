# LumOS - Universal Polyglot Operating System

<div align="center">

**Next-Generation Browser-Based Operating System with Lumos Language Integration**

[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Uchida16104/LumOS)

[Live Demo](https://lumos-tawny-seven.vercel.app) | [Documentation](#documentation) | [Features](#features)

</div>

## Overview

LumOS represents a revolutionary approach to browser-based operating systems, bringing the comprehensive power of the Lumos Language directly to web environments. The system enables execution of code across more than one hundred programming languages, provides robust file management capabilities, delivers sophisticated data analysis tools, and facilitates comprehensive network operations - all accessible through a modern web browser interface.

### Current Deployment

The production deployment operates across three primary infrastructure components. The frontend application is hosted on Vercel at https://lumos-tawny-seven.vercel.app, providing users with a responsive and highly available interface. The backend services run on Render at https://lumos-faoy.onrender.com, delivering robust API endpoints and code execution capabilities. Database operations are managed through Supabase's managed PostgreSQL service, ensuring reliable data persistence and scalability.

## Core Capabilities

The Lumos Language integration provides native support for real-time code execution and multi-target compilation, enabling developers to write code once and deploy across numerous platforms and environments. The multi-language execution environment supports Python, Ruby, PHP, Rust, Go, COBOL, JavaScript, and more than one hundred additional programming languages, each with proper runtime isolation and resource management.

The file management system implements a complete virtual filesystem supporting upload, download, edit, and delete operations with proper permission controls and security policies. Network diagnostic tools provide comprehensive capabilities including ping, traceroute, nmap, SSH, FTP, and advanced network analysis features suitable for professional network administration tasks.

Data analytics functionality delivers built-in data processing, analysis, and visualization tools that operate seamlessly within the browser environment. The terminal emulator provides a full-featured command-line interface supporting Linux, macOS, and Windows commands with appropriate platform-specific handling and security controls.

Database operations integrate directly with PostgreSQL through Supabase, enabling sophisticated data management scenarios including user authentication, file storage, execution logging, and analytics tracking.

## Technical Architecture

The system architecture follows modern cloud-native principles with clear separation of concerns across multiple layers. The frontend employs Next.js 14 with React 18 and TypeScript, providing a type-safe and performant user interface with real-time updates and responsive design. Styling leverages Tailwind CSS for rapid development and consistent visual presentation, while Framer Motion delivers smooth animations and transitions throughout the interface.

The backend implements a hybrid architecture combining Rust with Actix-Web for high-performance API endpoints and request handling, while the Lumos Language engine operates on Node.js to provide dynamic code execution and compilation capabilities. Database persistence utilizes PostgreSQL hosted on Supabase, benefiting from enterprise-grade reliability and built-in security features.

Language support encompasses Lumos, Python, Ruby, PHP, JavaScript, Rust, Go, C, C++, C#, COBOL, and more than ninety additional programming languages, each with appropriate runtime configuration and security sandboxing to prevent unauthorized system access.

## Getting Started

To begin working with LumOS locally, first clone the repository from GitHub using the command git clone https://github.com/Uchida16104/LumOS.git and navigate into the project directory. Copy the environment example file to create your local configuration with cp .env.example .env, then install all dependencies across the monorepo workspace using npm run install:all. Finally, start the complete development environment with npm run dev.

For detailed installation instructions including system requirements, dependency management, and troubleshooting guidance, please refer to the INSTALL.md file included in the project documentation.

## License and Author

This project is distributed under the MIT License as detailed in the LICENSE file. Development and maintenance are led by Hirotoshi Uchida, whose GitHub profile can be found at github.com/Uchida16104.

The system is built with dedication to the Lumos Language and represents a comprehensive implementation of modern web-based operating system concepts.
