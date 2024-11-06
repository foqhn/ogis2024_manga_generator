from django.conf import settings

import os
import numpy as np
import base64


class MangaCreater:
    def __init__(self):
        self.base_dir=settings.BASE_DIR
        self.path_to_main_voice=''
        self.path_to_sample_voice=''
        
        self.generated_flag=False
        
        

    def set_voice_path(self,path_to_main_voice,path_to_sample_voice):
        self.path_to_main_voice=path_to_main_voice
        self.path_to_sample_voice=path_to_sample_voice
        
    
    def is_exist(self,id):
        dir=os.path.join(self.base_dir,'manga_data',str(id))
        return os.path.exists(dir)
    
    def get_manga_data(self,id):
        if not self.is_exist(id):
            return None
        dir=os.path.join(self.base_dir,'manga_data',str(id))
        num_pages=len(os.listdir(dir))
        manga_queue=[]
        for i in range(num_pages):
            page_path=os.path.join(dir,f'panel{i+1}.png')
            base64_img=img_to_base64(page_path)
            manga_queue.append(base64_img)
        return manga_queue
        
def img_to_base64(img_path):
    with open(img_path, "rb") as img_file:
        img_byte = img_file.read()
    img_base64 = base64.b64encode(img_byte).decode("utf-8")
    return img_base64