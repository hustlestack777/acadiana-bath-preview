# Renders the Onyx hero video from public/images. Run from the repo root: python3 scripts/hero-video/render_desktop.py (needs Pillow + ffmpeg). Output goes to out/, then compress into public/video.
import subprocess
from PIL import Image
SRC="public/images/"
# panel p shows A then B
PANELS=[("hero-walkin","shower-barn"),("shower-arch","shower-warm"),("hero-rain","tub-surround")]
FPS=24; PERIOD=18.0; HALF=PERIOD/2; FADE=1.4; STAGGER=1.6
W,H=1280,720; GAP=8; PW=(W-2*GAP)//3
cache={n:Image.open(SRC+n+".webp").convert("RGB") for pair in PANELS for n in pair}
def ease(t): return t*t*(3-2*t)
def cover(im,w,h,zoom,fx,fy):
    iw,ih=im.size; s=max(w/iw,h/ih)*zoom; cw,ch=w/s,h/s
    x0=(iw-cw)*fx; y0=(ih-ch)*fy
    return im.transform((w,h),Image.EXTENT,(x0,y0,x0+cw,y0+ch),Image.BICUBIC)
def img_at(name, local, idx):
    # local: seconds since this image began fading in (0..HALF+FADE)
    p=min(max(local/(HALF+FADE),0),1)
    z=1.03+0.09*ease(p) if idx%2==0 else 1.12-0.09*ease(p)
    return cover(cache[name],PW,H,z,0.5,0.5)
def panel(pi,t):
    a,b=PANELS[pi]; s=pi*STAGGER
    u=(t-s)%PERIOD  # 0..PERIOD; A begins fading in at u=0 (fade 0..FADE), B at u=HALF
    if u<HALF:
        cur=img_at(a,u,pi); 
        if u<FADE: cur=Image.blend(img_at(b,u+HALF,pi+1),cur,ease(u/FADE))
    else:
        v=u-HALF; cur=img_at(b,v,pi+1)
        if v<FADE: cur=Image.blend(img_at(a,v+HALF,pi),cur,ease(v/FADE))
    return cur
frames=int(PERIOD*FPS)
cmd=["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),"-i","-","-an","-c:v","libx264","-preset","slow","-crf","26","-pix_fmt","yuv420p","-profile:v","high","-movflags","+faststart","out/desktop.mp4"]
pr=subprocess.Popen(cmd,stdin=subprocess.PIPE)
for f in range(frames):
    t=f/FPS; fr=Image.new("RGB",(W,H),(28,16,20))
    for pi in range(3):
        fr.paste(panel(pi,t),(pi*(PW+GAP),0))
    pr.stdin.write(fr.tobytes())
pr.stdin.close(); pr.wait()
