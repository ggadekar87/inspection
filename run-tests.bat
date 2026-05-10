@echo off
REM AppointmentList Component - Test Coverage Scripts for Windows

echo ========================================
echo AppointmentList Test Commands
echo ========================================
echo.

REM Run all tests for AppointmentList
echo 1. Run all tests for AppointmentList:
echo    npm test AppointmentList.test.tsx --watchAll=false
echo.

REM Run tests with coverage report
echo 2. Run tests with coverage report:
echo    npm test AppointmentList.test.tsx --coverage --watchAll=false
echo.

REM Run specific test suite
echo 3. Run specific test suite (e.g., "Render Tests"):
echo    npm test AppointmentList.test.tsx --testNamePattern="Render Tests" --watchAll=false
echo.

REM Run tests in watch mode
echo 4. Run tests in watch mode (for development):
echo    npm test AppointmentList.test.tsx --watch
echo.

REM Run a specific single test
echo 5. Run a specific single test:
echo    npm test AppointmentList.test.tsx --testNamePattern="should render the appointments table" --watchAll=false
echo.

REM Run with verbose output
echo 6. Run with verbose output:
echo    npm test AppointmentList.test.tsx --verbose --watchAll=false
echo.

REM Run and generate coverage HTML report
echo 7. Run and generate coverage HTML report:
echo    npm test AppointmentList.test.tsx --coverage --coverage-reporters=html --watchAll=false
echo.

echo To run any of the above commands, copy and paste into your terminal.
