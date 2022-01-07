---
title: CF1340F 题解
tags: [题解]
uptime: 1640845678
---

这似乎是一片时间复杂度是假的的题解？欢迎 hack。

## 题目大意

维护一个长度为 $n$ 的括号序列，括号共有 $k$ 种，进行 $m$ 次操作。支持单点修改，区间询问括号是否匹配。$n,q\le 10^5$。

## 做法介绍

考虑分块，每 $\sqrt n$ 个元素分成一块。对于每个块内，用栈预处理出当前块进行匹配的结果，你可以理解为：将这个块中的括号序列进行「化简」。如果这个块本身就失配，那询问区间中如果包含这个整块答案就一定是 `NO`。否则，这个块进行匹配后一定是一段右括号紧跟上一段左括号。把这两部分记录下来。

- 对于单点修改操作，直接暴力重构整个块即可。

- 对于查询操作，从左到右用栈模拟括号匹配的过程。这里我和其他人的题解有个不一样的地方，在合并整块的时候，没有用 hash 等方式 $O(1)$ 判断，而是直接用 `memcpy` 把括号复制过来暴力 $O(\sqrt n)$ 合并。按理来说这样做的时间复杂度为最差 $O(nm)$，在全是左括号的数据上表现最差。但是可能是因为 `memcpy` 常数较小，本地自造数据都没有成功 hack 掉，所以欢迎来提供 hack 数据。

## 代码

```cpp
const int N=1e5+9;
const int SQRTN=320;

int sz,bl[N],n,m,lbl[N],rbl[N],a[N],k,L[SQRTN][N],R[SQRTN][N],sta[N],tp;
bool ok[N];

void Up(int x){
  int b=bl[x];
  ok[b]=1,L[b][0]=R[b][0]=0;
  tp=0;
  rep(i,lbl[x],rbl[x]){
    if(a[i]>0)sta[++tp]=a[i];
    else if(tp){
      if(sta[tp--]!=-a[i]){ok[b]=0;return;}
    }else L[b][++L[b][0]]=a[i];
  }
  memcpy(R[b]+1,sta+1,tp*sizeof(int)),R[b][0]=tp;
}

inline void Init() {
  sz = sqrt(n);
  rep (i, 1, n) {
    bl[i] = (i - 1) / sz + 1;
    lbl[i] = (bl[i] - 1) * sz + 1;
    rbl[i] = min(bl[i] * sz, n);
  }
  ste(i, 1, n, sz) Up(i);
}

void Add(int p,int x){a[p]=x;Up(p);}

bool Ask(int l,int r){
  tp=0;
  if(bl[l]==bl[r]){
    rep(i,l,r){
      if(a[i]>0)sta[++tp]=a[i];
      else if(!tp||sta[tp--]!=-a[i])return 0;
    }
    return !tp;
  }
  rep(i,l,rbl[l]){
    if(a[i]>0)sta[++tp]=a[i];
    else if(!tp||sta[tp--]!=-a[i])return 0;
  }
  rep(b,bl[l]+1,bl[r]-1)if(!ok[b])return 0;
  rep(b,bl[l]+1,bl[r]-1){
    if(tp<L[b][0])return 0;
    re(i,L[b][0])if(sta[tp--]!=-L[b][i])return 0;
    memcpy(sta+1+tp,R[b]+1,R[b][0]*sizeof(int)),tp+=R[b][0]; // 这里复杂度是假的
  }
  rep(i,lbl[r],r){
    if(a[i]>0)sta[++tp]=a[i];
    else if(!tp||sta[tp--]!=-a[i])return 0;
  }
  return !tp;
}

signed main(){
  ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
  cout<<setiosflags(ios::fixed)<<setprecision(4);
  cin>>n>>k;
  re(i,n)cin>>a[i];
  Init();
  cin>>m;
  while(m--){
    int op,x,y;cin>>op>>x>>y;
    if(op==1){
      Add(x,y);
    }else{
      bool b=Ask(x,y);
      cout<<(b?"Yes\n":"No\n");
    }
  }
  return 0;
}
```
