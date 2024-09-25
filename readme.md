# ERP System - Role-Based Views with Lead Distribution and Analytics

## Overview
This ERP system is designed to streamline business processes by providing role-based access and tailored views for various users, including **Salespersons**, **Dispatchers**, **Accountants**, **HR**, and **Admins**. The system facilitates efficient operations by allowing users to interact with relevant features based on their roles.

The most notable features include:
- **Lead Distribution**: Automates the assignment of leads to dispatchers for follow-up and processing.
- **Admin Analytics**: Provides insightful data and statistics to admins for informed decision-making.

## Features

### 1. Role-Based Views
Each user role has access to specific features based on their job responsibilities:
- **Salesperson**: Can view assigned leads, update lead statuses, and track progress.
- **Dispatcher**: Receives leads assigned by the system, tracks delivery and dispatches, and updates statuses.
- **Accountant**: Manages financial records, processes payments, and oversees transaction histories.
- **HR**: Manages employee records, tracks attendance, and handles payrolls.
- **Admin**: Has full control over the system, including access to analytics, user management, and system settings.

### 2. Lead Distribution
- Automatically distributes incoming leads among salespeople.
- Balances workloads and ensures timely processing of leads.
- Tracks the lifecycle of each lead from assignment to closure.

### 3. Admin Analytics Dashboard
- Provides admins with real-time data on sales, leads, dispatch performance, and employee productivity.
- Generates reports for data-driven decisions.
- Visualizes key metrics through charts and graphs.

## Installation

### Prerequisites
- Node.js (v14.x or higher)
- npm (v6.x or higher)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/inside-brackets/dispatch-portal.git
   ```
2. Navigate to the project directory:
   ```bash
   cd dispatch-portal
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Tech Stack
- **Frontend**: React.js (Hooks, Redux)
- **Styling**: CSS/SCSS, Material UI
- **Backend**: Node.js, Express.js
- **API**: Axios for API calls

## Contributing
If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

### Github branch management

We are using git flow for branch management.

https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow

**The overall flow of Gitflow is:**

1. A staging branch is created from main
2. Feature branches are created from staging with the prefix `feature_`
3. Bugfix branches are created from staging with the prefix `bugfix_`
4. When a feature/bugfix is complete it is merged into the staging branch
5. A release branch is created from staging
6. When the release branch is done it is merged into staging and main
7. If an issue in main is detected a hotfix branch is created from main
8. Once the hotfix is complete it is merged to both staging and main
