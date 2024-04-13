from django.test import TestCase
from api.models import Task
from api.serializers import TaskSerializer


class TaskSerializerTest(TestCase):
    def setUp(self):
        self.task_attributes = {"title": "Test task", "completed": True}
        self.task = Task.objects.create(**self.task_attributes)
        self.serializer = TaskSerializer(instance=self.task)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(data.keys(), ["id", "title", "completed"])

    def test_title_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["title"], self.task_attributes["title"])

    def test_completed_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["completed"], self.task_attributes["completed"])
