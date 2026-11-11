# Renders the hero video from public/images. Run from the repo root: python3 scripts/hero-video/render_mobile.py (needs Pillow + ffmpeg). Output goes to out/, then compress into public/video.
import sys, subprocess, math
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw
SRC="public/images/"
SHOTS=[("hero-walkin",0.5),("shower-arch",0.45),("hero-rain",0.45),("shower-barn",0.5),("shower-warm",0.5),("tub-surround",0.5)]
FPS=24; HOLD=2.0; FADE=1.0
mode=sys.argv[1]  # desktop|mobile
W,H=(1280,720) if mode=="desktop" else (720,1280)
imgs=[(Image.open(SRC+n+".webp").convert("RGB"),fy) for n,fy in SHOTS]
def ease(t): return t*t*(3-2*t)
def cover(im, w, h, zoom, fx, fy):
    iw,ih=im.size; s=max(w/iw,h/ih)*zoom
    cw,ch=w/s,h/s
    x0=(iw-cw)*fx; y0=(ih-ch)*fy
    return im.transform((w,h),Image.EXTENT,(x0,y0,x0+cw,y0+ch),Image.BICUBIC)
# precompute desktop backgrounds
bgs=[]
if mode=="desktop":
    for im,_ in imgs:
        b=cover(im,W//4,H//4,1.0,0.5,0.5).filter(ImageFilter.GaussianBlur(6)).resize((W,H),Image.BICUBIC)
        bgs.append(ImageEnhance.Brightness(b).enhance(0.45))
    PW,PH=468,624; PX,PY=W-PW-96,(H-PH)//2+24
    mask=Image.new("L",(PW,PH),0); ImageDraw.Draw(mask).rounded_rectangle((0,0,PW-1,PH-1),radius=18,fill=255)
SEG=HOLD+FADE  # each shot visible for SEG seconds incl. fade-out overlap
def shot_frame(i, t):  # t: seconds since this shot started (0..SEG+FADE)
    im,fy=imgs[i%len(imgs)]
    p=min(max(t/(SEG+FADE),0),1)
    zoom=1.04+0.10*ease(p) if i%2==0 else 1.14-0.10*ease(p)
    fx=0.5+(0.04*(p-0.5) if i%2 else -0.04*(p-0.5))
    if mode=="mobile":
        return cover(im,W,H,zoom,fx,fy)
    fr=bgs[i%len(imgs)].copy()
    panel=cover(im,PW,PH,zoom,fx,fy)
    fr.paste(panel,(PX,PY),mask)
    return fr
n=len(imgs); total=n*SEG  # loop: shot n == shot 0
frames=int(total*FPS)
cmd=["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),"-i","-","-an","-c:v","libx264","-preset","slow","-crf","26","-pix_fmt","yuv420p","-profile:v","high","-movflags","+faststart",f"out/{mode}.mp4"]
pr=subprocess.Popen(cmd,stdin=subprocess.PIPE)
for f in range(frames):
    # start offset FADE so the loop point is seamless
    t=f/FPS+FADE
    k=int(t//SEG); local=t-k*SEG
    cur=shot_frame(k, local+FADE)
    if local<FADE:
        prev=shot_frame(k-1, local+SEG+FADE) if k>0 else shot_frame(n-1, local+SEG+FADE)
        a=ease(local/FADE)
        cur=Image.blend(prev,cur,a)
    pr.stdin.write(cur.tobytes())
pr.stdin.close(); pr.wait()
print(mode, frames/FPS, "s")
