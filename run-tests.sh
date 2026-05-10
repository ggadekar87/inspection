#!/bin/bash

# AppointmentList Component - Test Coverage Scripts

# Run all tests for AppointmentList
npm test AppointmentList.test.tsx --watchAll=false

# Run tests with coverage report
npm test AppointmentList.test.tsx --coverage --watchAll=false

# Run specific test suite
npm test AppointmentList.test.tsx --testNamePattern="Render Tests" --watchAll=false

# Run tests in watch mode (for development)
npm test AppointmentList.test.tsx --watch

# Run a specific single test
npm test AppointmentList.test.tsx --testNamePattern="should render the appointments table with header" --watchAll=false

# Run with verbose output
npm test AppointmentList.test.tsx --verbose --watchAll=false

# Run and generate coverage HTML report
npm test AppointmentList.test.tsx --coverage --coverage-reporters=html --watchAll=false

# Run and update snapshots (if any)
npm test AppointmentList.test.tsx -u --watchAll=false
