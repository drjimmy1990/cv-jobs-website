# Deployment Guide for aaPanel

This guide outlines the steps to deploy your React/Vite application to a server managed by aaPanel.

## Prerequisites
- Access to your aaPanel dashboard.
- Access to your project files locally.
- Node.js installed on your local machine.

## Step 1: Build the Application Locally

1.  Open your terminal in the project root directory.
2.  Run the build command:
    ```bash
    npm run build
    ```
3.  This will create a `dist` folder in your project directory containing the production-ready files.

## Step 2: Prepare Files for Upload

1.  Navigate to your project directory.
2.  Compress the `dist` folder into a ZIP file (e.g., `dist.zip`).

## Step 3: Upload to aaPanel

1.  Log in to your aaPanel dashboard.
2.  Go to **Files**.
3.  Navigate to the directory where you want to host your site (e.g., `/www/wwwroot/your-domain.com`).
4.  Click **Upload** and select your `dist.zip` file.
5.  Once uploaded, right-click the file and select **Unzip**.
6.  Move the *contents* of the `dist` folder to the root of your site directory (so `index.html` is directly in `/www/wwwroot/your-domain.com`).

## Step 4: Configure Website in aaPanel

1.  Go to **Website** in the sidebar.
2.  Click **Add Site**.
3.  **Domain**: Enter your domain name.
4.  **Database**: Not needed for the frontend (you are using Supabase).
5.  **PHP Version**: Select "Static" (or any PHP version, it doesn't matter for React).
6.  Click **Submit**.

## Step 5: Configure Nginx for React Router

Since this is a Single Page Application (SPA), you need to configure Nginx to redirect all requests to `index.html` so that React Router can handle the routing.

1.  In the **Website** list, click the name of your site (or "Conf").
2.  Go to **Config** (or **URL rewrite** / **ConfigFile** depending on your aaPanel version).
3.  Find the `server` block or the `location /` block.
4.  Add or modify the `location /` block to look like this:

    ```nginx
    location / {
        try_files $uri $uri/ /index.html;
    }
    ```

    *If you are editing the main configuration file, it usually looks like this:*

    ```nginx
    server {
        listen 80;
        server_name your-domain.com;
        root /www/wwwroot/your-domain.com;
        index index.html index.htm;

        location / {
            try_files $uri $uri/ /index.html;
        }

        # ... other configs ...
    }
    ```

5.  **Save** the configuration.

## Step 6: Verify Deployment

1.  Open your browser and visit your domain.
2.  You should see your application.
3.  Navigate to different pages (e.g., `/services`, `/login`) and refresh the page to ensure the Nginx configuration is working (you shouldn't get a 404 error).

## Database Setup

1.  Go to your Supabase Dashboard.
2.  Go to the **SQL Editor**.
3.  Open the `schema_clean.sql` file provided in your project.
4.  Copy the contents and paste them into the SQL Editor.
5.  Run the script to set up your database tables and policies.
