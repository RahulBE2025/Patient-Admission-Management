import re
from datetime import date
from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ["id", "name", "age", "gender", "ward", "department", "doctor",
                  "admission_date", "status", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Name is required.")
        if not re.fullmatch(r"[A-Za-z ]+", value):
            raise serializers.ValidationError("Name must contain letters and spaces only.")
        return value

    def validate_age(self, value):
        if value is None or not 0 <= value <= 120:
            raise serializers.ValidationError("Age must be a number between 0 and 120.")
        return value

    def validate_admission_date(self, value):
        if value > date.today():
            raise serializers.ValidationError("Admission date cannot be in the future.")
        return value
