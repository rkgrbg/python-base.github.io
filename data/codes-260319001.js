window.CODE_LIBRARY_DATA = {
  defaultLanguage: "Python",
  categories: [
    { id: "ckzj", name: "基礎語法(CKZJ)" }
  ],
  items: [
    {
      category: "ckzj",
      title: "01基礎 01 Hello World",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-06",
      tags: ["基礎"],
      code:
`print("Hello, World!")
print("Hello, Python!")`
    },{
      category: "ckzj",
      title: "01基礎 02 星跡",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-06",
      tags: ["基礎"],
      code:
`d = float(input())
print(24.0*(d/360.0))`
    },{
      category: "ckzj",
      title: "01基礎 03 停車費計算",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-06",
      tags: ["基礎"],
      code:
`h = int(input())
print(h*(30 if h<= 2 else (40 if h <= 5 else 50)))`
    },{
      category: "ckzj",
      title: "01基礎 04 手機費計算",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-06",
      tags: ["基礎"],
      code:
`p = int(input())
m = float(input())

if(p==199):
	print((m-60 if m > 60 else 0)*1.2+199)
elif(p==399):
	print((m-120 if m > 120 else 0)*0.75+399)
else:
	print((m-200 if m > 200 else 0)*0.5+599)`
    },{
      category: "ckzj",
      title: "02迴圈 01 數列 I",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-06",
      tags: ["基礎"],
      code:
`n = int(input())

for i in range(n) :
    print(i+1)`
    },{
      category: "ckzj",
      title: "02迴圈 02 數列 II",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-06",
      tags: ["基礎"],
      code:
`n = int(input())

for i in range(n) :
    print(3*(i+1))`
    },{
      category: "ckzj",
      title: "02迴圈 03 數列 III",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-06",
      tags: ["基礎"],
      code:
`n = int(input())

ans = 0
for i in range(n) :
    ans += i
    print(ans)`
    },{
      category: "ckzj",
      title: "02迴圈 04 平方和差",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-06",
      tags: ["基礎"],
      code:
`n = int(input())

ans = 0

for i in range(n):
    ans += (i+1)**2

print(int(abs(((1+n)*n/2)**2 - ans)))`
    },{
      category: "ckzj",
      title: "02迴圈 05 偶數和",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-06",
      tags: ["基礎"],
      code:
`a = int(input())
b = int(input())
ans = 0

for i in range(min(a, b), max(a, b)+1) :
    if(not i&1) :
        ans += i
        
print(ans)`
    },{
      category: "ckzj",
      title: "03字串 01 擷取學號",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-12",
      tags: ["基礎"],
      code:
`n = int(input())

for _ in range(n) :
	s = input()
	print(s[2:10])`
    },{
      category: "ckzj",
      title: "03字串 02 重複次數",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-12",
      tags: ["基礎"],
      code:
`k = input().strip().lower()
s = input().strip().lower()

print(s.count(k))`
    },{
      category: "ckzj",
      title: "03字串 03 總投票數",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-12",
      tags: ["基礎", "是奇蹟啊"],
      code:
`n = int(input())
print(sum(int(input().replace(',', '')) for _ in range(n)))`
    },{
      category: "ckzj",
      title: "03字串 04 異動航班",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-12",
      tags: ["基礎"],
      code:
`n = int(input())

for _ in range(n) :
	s = input().strip()
	si = input().strip()
	if si == "Cancelled" or si == "Delayed" :
		print(s[s.find('(')+1 : s.find(')')])`
    },{
      category: "ckzj",
      title: "03字串 05 面積轉換",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-12",
      tags: ["基礎", "是奇蹟啊"],
      code:
`print(input().translate(str.maketrans('.,', ',.')))`
    },{
      category: "ckzj",
      title: "04陣列 01 最後倒數",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-19",
      tags: ["基礎"],
      code:
`n = int(input())
l = [input() for _ in range(n)]

for x in l[::-1] :
    print(x)`
    },{
      category: "ckzj",
      title: "04陣列 02 歐洲文化之都",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-19",
      tags: ["基礎"],
      code:
`n = int(input())

for _ in range(n) :
    print(input().split(',')[1].strip())`
    },{
      category: "ckzj",
      title: "04陣列 03 志願選填",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-19",
      tags: ["基礎"],
      code:
`l = input().split()
s = input().strip()

print(l.index(s) + 1)`
    },{
      category: "ckzj",
      title: "04陣列 04 商品製造日期轉換",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-19",
      tags: ["基礎"],
      code:
`m, d, y = map(int, input().split('/'))

print(f"{y-1911}/{m:02d}/{d:02d}")`
    },{
      category: "ckzj",
      title: "04陣列 05 死線之前",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-19",
      tags: ["基礎"],
      code:
`nh, nm = map(int, input().split(':'))
th, tm = map(int,input().split(':'))

if nm > tm :
	print(f"{th-nh-1} Hour(s) {tm-nm+60} Minute(s)")
else :
	print(f"{th-nh} Hour(s) {tm-nm} Minute(s)")`
    },{
      category: "ckzj",
      title: "04陣列 06 今彩 539 對獎器",
      description: "這段程式碼很高冷，他沒有多說什麼...，只留下了一聲不屑的「哼」。",
      updated: "2026-03-19",
      tags: ["基礎", "是奇蹟啊"],
      code:
`s = set(map(int, input().split()))
li = list(map(int, input().split()))

print(sum(x in s for x in li))`
    }
  ]
};
window.CPP_CODE_DATA = window.CODE_LIBRARY_DATA;
