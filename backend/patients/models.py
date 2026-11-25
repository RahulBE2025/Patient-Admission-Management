from django.db import models

class Patient(models.Model):
    class Gender(models.TextChoices):
        MALE = "Male", "Male"
        FEMALE = "Female", "Female"
        OTHER = "Other", "Other"

    class Ward(models.TextChoices):
        GENERAL = "General", "General"
        PRIVATE = "Private", "Private"
        ICU = "ICU", "ICU"
        EMERGENCY = "Emergency", "Emergency"

    class Department(models.TextChoices):
        CARDIOLOGY = "Cardiology", "Cardiology"
        NEUROLOGY = "Neurology", "Neurology"
        ORTHOPEDICS = "Orthopedics", "Orthopedics"
        PEDIATRICS = "Pediatrics", "Pediatrics"
        GENERAL_MEDICINE = "General Medicine", "General Medicine"
        SURGERY = "Surgery", "Surgery"

    class Doctor(models.TextChoices):
        SHARMA = "Dr. Sharma", "Dr. Sharma"
        PATEL = "Dr. Patel", "Dr. Patel"
        REDDY = "Dr. Reddy", "Dr. Reddy"
        KUMAR = "Dr. Kumar", "Dr. Kumar"

    class Status(models.TextChoices):
        ADMITTED = "Admitted", "Admitted"
        DISCHARGED = "Discharged", "Discharged"

    name = models.CharField(max_length=100)
    age = models.PositiveSmallIntegerField()
    gender = models.CharField(max_length=10, choices=Gender.choices)
    ward = models.CharField(max_length=20, choices=Ward.choices)
    department = models.CharField(max_length=40, choices=Department.choices)
    doctor = models.CharField(max_length=40, choices=Doctor.choices)
    admission_date = models.DateField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ADMITTED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.status})"
