{"title":"CF455D 题解","tags":["题解"],"uptime":1634719334}
---
考虑分块，每 $\sqrt n$ 个元素分成一块，每个块内维护 $cnt(b,i)$ 表示 $i$ 这个数在 $b$ 号块中出现了几次，维护 $dq(b)$ 用一个 `deque` 表示出 $b$ 号块内的所有元素。

对于 $1$ 操作，如果 $l$ 与 $r$ 在同一个块里，直接暴力去做即可。如果不在，则将最后一个元素 insert 进第一个元素所在的块中，接着 $(bl_l,bl_r]$ 之间的所有块，把上一个块的最后一个元素移到当前块中，并更新 $cnt$ 值。以保证块内元素数仍为 $\sqrt n$。

对于 $2$ 操作，零散块暴力查询，整块直接读 $cnt$ 值相加即可。

**另外需要特殊注意的是：** 如果你 RE on test 9，如果你写了类似

```cpp
dq[bl[r]].erase(dq[bl[r]].begin() + r - lbl[r]);
```

这种的语法，它会因为 `dq[bl[r]].begin() + r` 跑到了 deque 外面而 RE。

改成这样即可 AC：

```cpp
dq[bl[r]].erase(dq[bl[r]].begin() + (r - lbl[r]));
```

### Code

```cpp
constexpr int N = 1e5 + 9;
constexpr int B = 333;

int n, a[N], cnt[B][N], bl[N], lbl[N], rbl[N], sz;
deque<int> dq[B];

void Init() {
  sz = max(3, (int)sqrt(n));
  re (i, n)
    bl[i] = (i - 1) / sz + 1, lbl[i] = (bl[i] - 1) * sz + 1, rbl[i] = min(n, bl[i] * sz);
  ste(x, 1, n, sz) {
    rep (i, lbl[x], rbl[x])
      dq[bl[x]].push_back(a[i]), ++cnt[bl[x]][a[i]];
  }
}

void Mov(int l, int r) {
  if (bl[l] == bl[r]) {
    int b = bl[l];
    int x = dq[b][r - lbl[l]];
    dq[b].erase(dq[b].begin() + (r - lbl[l]));
    dq[b].insert(dq[b].begin() + (l - lbl[l]), x);
    return;
  }
  dq[bl[l]].insert(dq[bl[l]].begin() + (l - lbl[l]), dq[bl[r]][r - lbl[r]]);
  ++cnt[bl[l]][dq[bl[r]][r - lbl[r]]];
  --cnt[bl[r]][dq[bl[r]][r - lbl[r]]];
  dq[bl[r]].erase(dq[bl[r]].begin() + (r - lbl[r]));
  rep (b, bl[l] + 1, bl[r]) {
    int t = dq[b - 1].back();
    dq[b].push_front(t);
    ++cnt[b][t];
    dq[b - 1].pop_back();
    --cnt[b - 1][t];
  }
}

int Ask(int l, int r, int k) {
  int res = 0;
  if (bl[l] == bl[r]) {
    int b = bl[l];
    rep (i, l, r) {
      if (dq[b][i - lbl[l]] == k) ++res;
    }
    return res;
  }
  res += Ask(l, rbl[l], k);
  rep (b, bl[l] + 1, bl[r] - 1)
    res += cnt[b][k];
  res += Ask(lbl[r], r, k);
  return res;
}

signed main() {
  in(n)(a, n);
  Init();
  int lastans = 0;
  re (_, in()) {
    int op = in(), l = (in() + lastans - 1) % n + 1, r = (in() + lastans - 1) % n + 1;
    if (l > r) swap(l, r);
    if (op == 1)
      Mov(l, r);
    else {
      int k = (in() + lastans - 1) % n + 1;
      lastans = Ask(l, r, k);
      out(lastans)('\n');
    }
  }
  return 0;
}
```

