# Asset-Manager

## Project Description
Asset Manager is a comprehensive tool designed to help organizations manage their assets efficiently. It provides features for tracking, categorizing, and managing assets, as well as handling rental requests and user management.

## Features
- Asset tracking and categorization
- User authentication and role-based access
- Rental request management
- Dashboard for employees and managers
- Responsive and user-friendly interface

## Installation
### Backend
1. Navigate to the `asset-manager-backend` directory:
   ```bash
   cd asset-manager-backend
   ```
2. Restore dependencies:
   ```bash
   dotnet restore
   ```
3. Run the application:
   ```bash
   dotnet run --urls "https://localhost:7117"
   ```

### Frontend
1. Navigate to the `asset-manager-frontend` directory:
   ```bash
   cd asset-manager-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage
1. Access the backend API at `https://localhost:7117` (default).
2. Access the frontend application at `http://localhost:5173` (default).
3. Log in as an employee or manager to explore the features.

## API Documentation
Refer to the `asset-manager-backend/AssetManager.API.http` file for API endpoints and usage examples.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Submit a pull request.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact
For any inquiries or support, please contact the project owner at [J1nWo0](https://github.com/J1nWo0).