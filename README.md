# Currency Converter

## Description
The **Currency Converter** is a utility web application created as part of a home assignment for **Coralogix**. Its primary goal is to allow users to convert between currencies while saving and displaying conversion history in a separate tab. The project adheres to best practices for responsiveness, performance optimization, and user experience.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Setup](#setup)
- [Usage Instructions](#usage-instructions)
- [Future Improvements](#future-improvements)
- [Technical Highlights](#technical-highlights)
- [Deployment](#deployment)
- [GitHub Issues](#github-issues)
- [License](#license)

## Features
1. **Currency Conversion**:
   - Users can enter an amount and select two currencies to perform the conversion.
   - Displays calculated conversion results in real-time.

2. **Conversion History**:
   - Saves the user's conversion results and displays them in a separate history tab.
   - Conversion history persists after refresh using **session storage**.

3. **7-Day Currency Chart**:
   - Visual representation of exchange rates over the past 7 days.

4. **Responsive UI**:
   - Fully responsive design optimized for both desktop and mobile devices.

5. **Enhanced Form Validation**:
   - Prevents selecting the same currency for conversion.
   - Displays error messages such as “Currency not found” for invalid input.

6. **Better UX Enhancements**:
   - Disables the amount input when a selected currency is invalid.
   - Improves the original UI layout for a smoother user experience.

## Installation

### Prerequisites
- **Node.js** (LTS version recommended)
- **Angular CLI**

### Steps
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd currency-converter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   ng s
   ```
   > **Note:** For optimal performance and avoiding development-specific issues in Angular 19, run:
   ```bash
   ng s --no-hmr
   ```

4. Access the app in your browser:
   ```
   http://localhost:4200
   ```

## Setup
- The project is deployed using **Vercel** for production-ready hosting.
- For development:
   - Use `--no-hmr` to disable Hot Module Replacement (HMR).
   - Alternatively, use the `npm run start` script for consistent development behavior.

## Usage Instructions

### Currency Conversion
1. Enter the desired amount in the input field.
2. Select the "From" and "To" currencies from the dropdown menus.
3. View the converted result instantly.

### View Conversion History
- Navigate to the "History" tab to see past conversion results.
- History persists even after a page refresh.

### View Currency Chart
- A chart displays currency exchange rates for the past 7 days to provide historical trends.

## Future Improvements
1. **Mimic Google Converter Features**:
   - Automatically set the amount to `1` if it’s invalid.
   - Swap "From" and "To" currencies when the same currency is selected to avoid validation errors.

2. **UX Optimizations**:
   - Enhance form interactivity to dynamically update when the user modifies the input or dropdowns.
   - Show error messages using a **toaster** or **snackbar** for better visibility.

## Technical Highlights
1. **Minimal API Calls**:
   - Optimized API logic to minimize network requests for better performance.

2. **Reusable Logic**:
   - Designed with Angular **services** and **pipes** to ensure reusability and maintainability.

3. **Form Validation**:
   - Strong adherence to form validation to enhance user interaction.

4. **UI/UX Design**:
   - Redesigned the UI to provide a clean and intuitive user experience.
   - Disabled the amount input dynamically when currency selection is invalid.

## Deployment
The project is deployed on **Vercel** and accessible at:  
[**Live Demo URL**](#) *https://carologix-currency-converter.vercel.app/*

## GitHub Issues
Added the link for Angular 19 run time issue:  
[**GitHub Issues**](#) *(https://github.com/angular/angular/issues/59058)*

---
