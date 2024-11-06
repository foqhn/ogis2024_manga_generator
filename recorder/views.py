from django.shortcuts import render, HttpResponse,redirect
from django.template import loader
from django.conf import settings
from django import forms
from django.http import JsonResponse
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt


from .models import MasterModel


import json
import base64

import os
import subprocess
import re

from .scripts.manga_creater import MangaCreater

# Create your views here.


mc=MangaCreater()

def rec_main(request):
    if request.method == 'GET':
        model=MasterModel.objects.create()
        context = {
            'id': model.id,
        }
        return render(request, 'recorder/rec_main.html', context)
    elif request.method == 'POST':
        id = request.POST.get('id')
        model=MasterModel.objects.get(id=id)
        json_obj=json.loads(request.POST.get('json'))
        model.mv_json=json_obj
        model.save()
        
        url=reverse('recorder:sample_voice',kwargs={'id':int(id)})
        return redirect(url)
        

def sample_voice(request, id):
    print(id)
    if request.method == 'GET':
        print(id)
        context = {
            'id': id,
        }
        return render(request, 'recorder/sample_recode.html',context)
    
    if request.method == 'POST':
        sv_json = request.POST.get('json')
        model_id=request.POST.get('id')
        model=MasterModel.objects.get(id=model_id)
        model.sv_json=json.loads(sv_json)
        model.save()
           
        save_audios(id)
        
        url=reverse('recorder:wait_for_manga',kwargs={'id':int(id)})
        return redirect(url)
    

def wait_for_manga(request,id):
    if request.method == 'GET':
        print(id)
        context = {
            'id': id,
        }
        return render(request, 'recorder/wait_for_manga.html',context)
    
    if request.method == 'POST':
        id = request.POST.get('id')
        
        # manga_viewにリダイレクト
        url=reverse('recorder:manga_view',kwargs={'id':int(id)})
        return redirect(url)
    
def manga_view(request,id):
    if request.method=='GET':
        print(id)
        model=MasterModel.objects.get(id=id)
        
        if model.manga_json==[]:
            manga_pages=mc.get_manga_data(id)
            model.manga_json=manga_pages
            model.save()
        else:
            manga_pages=model.manga_json
        
        context = {
            'id': id,
            'manga_pages':manga_pages,
        }
        return render(request, 'recorder/manga_view.html',context)
        
        

#create manga###########################################################


#save audio files#######################################################
def save_audios(id):
    BASE_DIR=settings.BASE_DIR
    print(BASE_DIR)
    main_record_dir=os.path.join(BASE_DIR,'record_data','main_voice')
    sample_record_dir=os.path.join(BASE_DIR,'record_data','sample_voice')
    
    
    model=MasterModel.objects.get(id=id)
    
    #save mv audio
    mv_json=model.mv_json[0]
    print(mv_json)
    print(type(mv_json))
    mv_audio_base64=mv_json['audio']
    mv_audio_filename=f'{id}_main_rec.wav'
    res=base64_to_file(json_text=mv_audio_base64,save_dir=main_record_dir,filrname=mv_audio_filename)
    
    #save sv audio
    sv_json=model.sv_json
    num_samples=len(sv_json)
    for i in range(num_samples):
        speaker_name=sv_json[i]['name']
        speaker_gender=sv_json[i]['gender']
        speaker_audio_base64=sv_json[i]['audio']
        speaker_audio_filename=f'{id}_{speaker_name}_{speaker_gender}.wav'
        res=base64_to_file(json_text=speaker_audio_base64,save_dir=sample_record_dir,filrname=speaker_audio_filename)
        
    
    
    


#helper###################################################################
def base64_to_file(json_text,save_dir,filrname):
    base64_str=extract_base64(json_text)
    
    if base64_str is None:
        return False
    return base64_to_wav(base64_str,wav_path=os.path.join(save_dir,filrname))



def base64_to_wav(base64_string, wav_path):
    """
    Base64 エンコードされた WebM データを WAV ファイルに変換します。

    Args:
        base64_string: Base64 エンコードされた WebM データの文字列。
        wav_path: 保存先の WAV ファイルのパス。
    """
    try:
        # 一時ファイル名を作成 (競合を避けるため)
        temp_webm_file = f"{os.path.splitext(wav_path)[0]}.webm"

        # Base64 を WebM にデコード
        webm_data = base64.b64decode(base64_string)
        with open(temp_webm_file, 'wb') as f:
            f.write(webm_data)

        # WebM を WAV に変換
        subprocess.run(['ffmpeg', '-i', temp_webm_file, wav_path], check=True)

        # 一時ファイルを削除
        os.remove(temp_webm_file)

        return True  # 成功

    except Exception as e:
        print(f"Error converting base64 to WAV: {e}")
        # エラー発生時にも一時ファイルを削除しようと試みる
        try:
            os.remove(temp_webm_file)
        except FileNotFoundError:
            pass  # ファイルが存在しない場合は無視
        return False  # 失敗
    


    
        
        
    
    
def extract_base64(data_string):
    """
    文字列から data:audio/webm;base64, の後に続く Base64 データを抽出します。

    Args:
        data_string: データを含む文字列。

    Returns:
        Base64 文字列。見つからない場合は None を返します。
    """
    match = re.search(r"data:audio/webm;base64,([A-Za-z0-9+/=]+)", data_string)
    if match:
        return match.group(1)
    else:
        return None
  