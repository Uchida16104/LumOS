# LumOS API Documentation

This document provides comprehensive documentation for the LumOS backend API endpoints. The API follows RESTful principles and returns JSON-formatted responses for all operations.

## Authentication

The LumOS API currently implements BASIC authentication for development purposes. For production deployments, it is strongly recommended to upgrade to a more robust authentication system such as OAuth2 or JWT-based token authentication.

To authenticate requests, include the Authorization header with Base64-encoded credentials in the format username:password. The default development credentials are admin:admin123, though these must be changed immediately in any production environment.

## Base URL

All API endpoints are accessible relative to the base URL of the deployed backend service. For the production deployment, this is https://lumos-faoy.onrender.com. For local development environments, the typical base URL would be http://localhost:8080.

## Health and Status Endpoints

The health endpoint provides a simple mechanism to verify that the backend service is operational and responsive. This endpoint returns a JSON object containing the current system status and a timestamp indicating when the check was performed.

The status endpoint delivers comprehensive information about the LumOS system, including the operating system version, loaded language runtimes, database connection status, system uptime, hostname, and available network diagnostic tools. This endpoint is particularly useful for monitoring system health and verifying that all required components are properly configured and operational.

## Code Execution Endpoints

The execute endpoint enables execution of code snippets in supported programming languages. The request body must include the target programming language and the code to be executed. The response includes both standard output and standard error streams, along with the process exit code. This endpoint supports Python, Ruby, PHP, Rust, Go, JavaScript, and Bash among other languages.

The Lumos-specific execution endpoint processes code written in the Lumos programming language. The request must include the source code and the desired action, which is typically set to execute. The response provides the execution output along with any error information if the execution fails.

The Lumos compilation endpoint transforms Lumos source code into equivalent code in a target programming language. The request must specify the source code, the action set to compile, and the target language. Currently supported compilation targets include Python, JavaScript, Rust, Go, Java, C++, C#, PHP, Ruby, Swift, Kotlin, and TypeScript. The endpoint returns the compiled code as a string that can be saved and executed independently.

## Command Execution

The command execution endpoint allows for the execution of operating system commands. The request must specify the command string and optionally the target operating system type. The system supports Linux, Ubuntu, Debian, CentOS, macOS, Windows Command Prompt, and Windows PowerShell command execution. Security considerations are paramount when using this endpoint, as arbitrary command execution poses significant risks if not properly controlled and validated.

## Network Tools

The network tools endpoint provides access to various network diagnostic and analysis utilities. The request must specify which tool to execute, along with an optional target host or IP address and any additional command-line options. Supported tools include ping, traceroute, nmap, ifconfig, netstat, and arp. These tools require appropriate system permissions to function correctly and should be used in accordance with applicable network usage policies and legal requirements.

## Data Processing

The data processing endpoint performs analytical operations on provided datasets. The request must include the data to be processed as a JSON array and the desired operation type. Currently supported operations include sum, average, and count calculations. The endpoint returns the computed result in a structured JSON format. This functionality is designed for basic data analysis tasks and can be extended to support more complex analytical operations as requirements evolve.

## Response Format

All API endpoints return responses in a consistent JSON format. Successful responses include a success field set to true along with the relevant data. Error responses include a success field set to false along with an error message describing what went wrong. This standardized response format simplifies client-side error handling and ensures consistent behavior across all endpoints.

## Error Handling

The API implements comprehensive error handling to ensure that all failures are reported clearly to clients. Authentication failures return HTTP 401 Unauthorized status codes. Invalid requests return HTTP 400 Bad Request status codes. Server-side errors return HTTP 500 Internal Server Error status codes. All error responses include detailed error messages to assist with debugging and troubleshooting.

## Rate Limiting and Security

While the current development version does not implement rate limiting, production deployments should incorporate appropriate rate limiting mechanisms to prevent abuse and ensure fair resource allocation among users. Additionally, all sensitive operations should be logged for audit purposes, and input validation should be performed rigorously to prevent injection attacks and other security vulnerabilities.

## Deployment Considerations

When deploying the LumOS API to production environments, several critical security measures must be implemented. These include changing default credentials, enabling comprehensive logging and monitoring, configuring firewalls to restrict network access appropriately, implementing rate limiting to prevent abuse, and conducting regular security audits of the system. Failure to implement these measures could result in significant security vulnerabilities and operational risks.
