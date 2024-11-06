from django.db import models

# Create your models here.
class MasterModel(models.Model):
    id = models.AutoField(primary_key=True)
    mv_json = models.JSONField(default=dict)
    sv_json = models.JSONField(default=dict)
    manga_json = models.JSONField(default=list)
    

    
   