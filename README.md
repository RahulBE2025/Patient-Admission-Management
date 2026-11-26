# CareDesk – Patient Admission Management

A responsive patient admission management app.

## Stack
- Frontend: React 18, Vite, Axios, Lucide
- Backend: Python, Django, Django REST Framework
- Database: PostgreSQL

## Features
Add, list, edit and delete patient records; search by name; filter by ward, department and doctor; mark a patient discharged; responsive layout; frontend and backend validation.

## Backend setup (Windows PowerShell)
1. `cd backend`
2. `python -m venv venv`
3. `.env\Scripts\Activate.ps1`
4. `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and set your PostgreSQL password.
6. Create a PostgreSQL database named `patient_admission`.
7. `python manage.py makemigrations patients`
8. `python manage.py migrate`
9. `python manage.py runserver`

API base URL: `http://127.0.0.1:8000/api/`
- `GET/POST /patients/`
- `GET/PATCH/DELETE /patients/{id}/`
- `PATCH /patients/{id}/discharge/`
- Search: `?search=name`
- Filters: `?ward=ICU&department=Cardiology&doctor=Dr.%20Sharma`

## Frontend setup
1. Open a second terminal.
2. `cd frontend`
3. `npm install`
4. Copy `.env.example` to `.env` (defaults to local API).
5. `npm run dev`
6. Open the URL Vite prints, normally `http://localhost:5173`.

## Validation
- Name: required, alphabetic characters and spaces only.
- Age: integer from 0 through 120.
- Gender, ward, department and doctor: required and constrained to allowed choices.
- Admission date: required and cannot be in the future.
- Validation is enforced in React and Django REST Framework.
## Important
The doctor, ward and department dropdown choices are sample fixed lists for this task. Adjust them if your evaluator has supplied a required official list.
