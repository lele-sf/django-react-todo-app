from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework.views import status
from api.models import Task
from api.serializers import TaskSerializer


class BaseViewTest(APITestCase):
    client = APIClient()

    @staticmethod
    def create_task(title="", completed=False):
        if title != "":
            Task.objects.create(title=title, completed=completed)

    def setUp(self):
        self.create_task("Test task 1", True)
        self.create_task("Test task 2", False)


class TaskViewSetTest(BaseViewTest):

    def test_get_all_tasks(self):
        response = self.client.get(reverse("task-list"))
        expected = Task.objects.all()
        serialized = TaskSerializer(expected, many=True)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_task(self):
        response = self.client.post(
            reverse("task-list"), data={"title": "Test task 3", "completed": False}
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 3)

    def test_get_single_task(self):
        response = self.client.get(reverse("task-detail", kwargs={"pk": 1}))
        expected = Task.objects.get(pk=1)
        serialized = TaskSerializer(expected)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_task(self):
        response = self.client.put(
            reverse("task-detail", kwargs={"pk": 2}),
            data={"title": "Updated task", "completed": True},
        )
        expected = Task.objects.get(pk=2)
        serialized = TaskSerializer(expected)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_task(self):
        response = self.client.delete(reverse("task-detail", kwargs={"pk": 1}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_create_task_with_invalid_data(self):
        response = self.client.post(reverse("task-list"), {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(
            reverse("task-list"), {"title": "", "completed": False}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
