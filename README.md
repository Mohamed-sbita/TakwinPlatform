
##  Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Create a `.env` file** in the backend directory with the following content:
   ```env
   EMAIL=admin@gmail.com
   PASS=123456789
   SECRET_KEY=123456789@123
   TEL=22112233
   
   # Email configuration
   EMAIL_SENDER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-gmail-password
   CLIENT_URL=http://localhost:4200
   ```

   > **Note:** For Gmail, you'll need to generate an App Password if you have 2FA enabled.

3. **Install backend dependencies**
   ```bash
   npm install
   ```

4. **Start the backend server**
   ```bash
   nodemon server
   ```
   The server will run on `http://localhost:3000`

##  Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   ng serve
   # or
   npm start
   ```
   The application will be available at `http://localhost:4200/`
