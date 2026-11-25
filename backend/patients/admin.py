from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ("name", "age", "ward", "department", "doctor", "status", "admission_date")
    list_filter = ("ward", "department", "doctor", "status")
    search_fields = ("name",)
