from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework.views import status
from api.models import Task


class TaskAPITest(APITestCase):
    client = APIClient()

    @staticmethod
    def create_task(title="", completed=False):
        if title != "" and completed:
            Task.objects.create(title=title, completed=completed)

    def setUp(self):
        self.create_task("Test task 1", True)
        self.create_task("Test task 2", False)

    def test_get_all_tasks(self):
        response = self.client.get(reverse("task-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_single_task(self):
        response = self.client.get(reverse("task-detail", kwargs={"pk": 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_single_task(self):
        response = self.client.get(reverse("task-detail", kwargs={"pk": 30}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
