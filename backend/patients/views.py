from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Patient
from .serializers import PatientSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]

    def get_queryset(self):
        queryset = super().get_queryset()
        for field in ("ward", "department", "doctor", "status"):
            value = self.request.query_params.get(field)
            if value:
                queryset = queryset.filter(**{field: value})
        return queryset

    @action(detail=True, methods=["patch"])
    def discharge(self, request, pk=None):
        patient = self.get_object()
        patient.status = Patient.Status.DISCHARGED
        patient.save(update_fields=["status", "updated_at"])
        return Response(self.get_serializer(patient).data, status=status.HTTP_200_OK)
