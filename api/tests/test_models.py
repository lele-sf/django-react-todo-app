from django.test import TestCase
from django.core.exceptions import ValidationError
from api.models import Task


class TaskModelTest(TestCase):
    def test_create_task(self):
        task = Task.objects.create(title="Test task", completed=True)
        self.assertEqual(task.title, "Test task")
        self.assertEqual(task.completed, True)

    def test_default_completed(self):
        task = Task.objects.create(title="Test task")
        self.assertEqual(task.completed, False)

    def test_str_method(self):
        task = Task.objects.create(title="Test task")
        self.assertEqual(str(task), "Test task")

    def test_max_length_title(self):
        long_title = "a" * 201
        task = Task(title=long_title, completed=True)
        with self.assertRaises(ValidationError):
            task.full_clean()
