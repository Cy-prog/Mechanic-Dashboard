@echo off
title Instant Mechanic - Live Operations Dashboard
echo ====================================================
echo  Instant Mechanic - Live Operations Dashboard
echo ====================================================
echo.
echo Initializing database and starting production server...
echo.

call npx prisma generate
call npm run build
echo.
echo Starting server on http://localhost:3000...
echo Open http://localhost:3000 in your browser.
echo.
call npm run start
pause
