from PIL import Image, ImageDraw, ImageFont
import os
F='/private/tmp/claude-501/-Users-vitorx--Documents-claude-portfolio-v2/db5d530b-4c73-43d0-b1d2-f143ef76b6ee/scratchpad/fonts/Archivo.ttf'
W,H=1200,630; BG=(5,5,6); FG=(242,241,238); GREY=(154,154,162); KICK=(168,199,255)
def curve(t):
    if t<0.42: return 40+200*(1-t/0.42)**1.2
    return 40+215*(((t-0.42)/0.58)**0.42)
def build(img,focus):
    src=Image.open(img).convert('RGB'); s=max(W/src.width,H/src.height)
    r=src.resize((round(src.width*s),round(src.height*s)),Image.LANCZOS)
    x=(r.width-W)//2; y=int((r.height-H)*focus)
    c=r.crop((x,y,x+W,y+H))
    m=Image.new('L',(W,H)); d=ImageDraw.Draw(m)
    for i in range(H): d.line([(0,i),(W,i)],fill=int(curve(i/H)))
    return Image.composite(Image.new('RGB',(W,H),BG),c,m)
def card(out,title,kicker,img,focus):
    c=build(img,focus); d=ImageDraw.Draw(c)
    kf=ImageFont.truetype(F,22); kf.set_variation_by_axes([100,600])
    d.text((72,H-232),kicker.upper(),font=kf,fill=KICK)
    tf=ImageFont.truetype(F,78 if len(title)<26 else 62); tf.set_variation_by_axes([112,700])
    words=title.split(); lines=[]; cur=''
    for w in words:
        t=(cur+' '+w).strip()
        if d.textlength(t,font=tf)>W-144 and cur: lines.append(cur); cur=w
        else: cur=t
    lines.append(cur); yy=H-186
    for ln in lines: d.text((72,yy),ln,font=tf,fill=FG); yy+=tf.size*1.02
    wf=ImageFont.truetype(F,20); wf.set_variation_by_axes([118,700])
    d.text((72,56),'VITOR XAVIER',font=wf,fill=FG)
    mf=ImageFont.truetype(F,20); mf.set_variation_by_axes([100,400])
    d.text((72+d.textlength('VITOR XAVIER',font=wf)+16,56),'Product Designer',font=mf,fill=GREY)
    c.save(out,quality=88,optimize=True)
CARDS=[('index','Let’s skyrocket your company.','Senior Product Designer','assets/rocket-still.jpg',.30),
 ('muni','MUNI','Digital signage for SF transit','assets/projects/muni/thumbnail.jpg',.40),
 ('careers-page','Careers Page','Creator marketplace, hiring','assets/projects/starbasis/hero-desk.jpg',.5),
 ('wcag-study','WCAG Study','Accessibility audit & redesign','assets/projects/wcag/hero.jpg',.5),
 ('creatorhub','CreatorHub','Marketplace, built to be trusted','assets/projects/creatorhub/hero-desk.jpg',.5),
 ('element-dashboard','Element Dashboard','Dashboard redesign','assets/projects/dashboard/hero-desk.jpg',.5),
 ('digital-signage','Digital Signage Interfaces','40+ responsive apps','assets/projects/signage/hero.jpg',.5),
 ('gym-and-bet','Gym&Bet','Betting with friends, for fitness','assets/projects/gymbet/hero.jpg',.45)]
if __name__=='__main__':
    for s,t,k,i,f in CARDS: card(f'assets/og/{s}.jpg',t,k,i,f)
    def lin(c):
        c/=255
        return c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
    def L(p): return .2126*lin(p[0])+.7152*lin(p[1])+.0722*lin(p[2])
    def ratio(a,b):
        x,y=L(a),L(b); return (max(x,y)+.05)/(min(x,y)+.05)
    print(f"  {'card':<22}{'wordmark':<11}{'kicker':<10}{'title':<10}{'KB':<6}")
    fails=[]
    for s,t,k,i,f in CARDS:
        b=build(i,f)
        w=ratio(FG,max(b.crop((72,52,560,84)).getdata(),key=L))
        kk=ratio(KICK,max(b.crop((72,H-234,900,H-206)).getdata(),key=L))
        tt=ratio(FG,max(b.crop((72,H-188,1128,H-94)).getdata(),key=L))
        if min(w,kk,tt)<4.5: fails.append((s,round(min(w,kk,tt),2)))
        print(f"  {s:<22}{w:<11.2f}{kk:<10.2f}{tt:<10.2f}{os.path.getsize(f'assets/og/{s}.jpg')//1024:<6}")
    print(f"\n  below 4.5:1: {fails or 'none — all three zones pass on all eight cards'}")
