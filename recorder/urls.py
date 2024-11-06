from django.urls import path
from . import views

app_name = 'recorder'
urlpatterns = [
    path('rec_main/', views.rec_main, name='rec_main'),
    path('sample_voice/<int:id>/', views.sample_voice, name='sample_voice'),
    path('wait_for_manga/<int:id>/', views.wait_for_manga, name='wait_for_manga'),
    path('manga_view/<int:id>/', views.manga_view, name='manga_view'),
]