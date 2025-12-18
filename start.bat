@echo off
echo Installing backend dependencies...
cd backend
call npm install
echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install
echo.
echo Starting MongoDB (make sure MongoDB is installed and running)
echo Starting backend server...
cd ..\backend
start cmd /k "npm run dev"
echo.
echo Starting frontend server...
cd ..\frontend
start cmd /k "npm start"
echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
pause