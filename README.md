# QR/BARCODE SCANNER

## Overview
- This is a React-based QR/Barcode scanning application that allows users to:
- Create scanning sessions with location tracking
- Scan QR/barcodes and validate them against an uploaded CSV database
- View real-time statistics and scan history
- Export scan results as CSV

## Features
### Session Management
- Create new scanning sessions with user details and location
- Track active sessions using Redux
- End sessions when complete

### Scanning Functionality
- Camera-based QR/barcode scanning
- Manual scan simulation for testing
- Real-time validation against uploaded codes
- Scan limit enforcement

### Data Management
- CSV file upload with validation
- Scan history tracking
- Statistics dashboard
- Data export functionality

### UI Components
- Responsive design with Tailwind CSS
- Form validation and error handling
- Location detection (automatic and manual)
- Status indicators and alerts

## Project Structure
### Pages
- SetupPage: Initial session configuration
- ScanPage: Main scanning interface
- StatsPage: Session statistics and data management

### Components
#### Setup Components
- FileUpload: CSV file upload with validation
- LocationDetector: Automatic/manual location detection

#### Scan Components
- ScanResult: Displays scan validation results
- StatsPanel: Real-time scanning statistics

#### Stats Components
- ScansTable: Displays scan history in a table
- ExportButton: Handles CSV export functionality

## Installation
- npm install

## Run the project
- npm start

## Core
- React
- React Router
- Redux (with React-Redux)
- Axios

## Utilities
- Papa Parse (CSV parsing)
- Tailwind CSS (styling)