# Generated by Django 5.1.2 on 2024-11-04 16:08

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("recorder", "0002_remove_recorder_age_remove_recorder_updated_at_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="MasterModel",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("mv_json", models.JSONField()),
                ("sv_json", models.JSONField(default=dict)),
                ("image", models.ImageField(upload_to="images/")),
                ("order", models.PositiveIntegerField(default=0)),
                ("comment", models.TextField()),
            ],
        ),
        migrations.RemoveField(
            model_name="mangaimagemodel",
            name="parentModel",
        ),
        migrations.RemoveField(
            model_name="samplevoicemodel",
            name="parentModel",
        ),
        migrations.DeleteModel(
            name="MainVoiceModel",
        ),
        migrations.DeleteModel(
            name="MangaImageModel",
        ),
        migrations.DeleteModel(
            name="Recorder",
        ),
        migrations.DeleteModel(
            name="SampleVoiceModel",
        ),
    ]
